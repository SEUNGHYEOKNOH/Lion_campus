package com.kbsw.campus_hackthon.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kbsw.campus_hackthon.Repository.CareerItemRepository;
import com.kbsw.campus_hackthon.Repository.UserProfileRepository;
import com.kbsw.campus_hackthon.entity.CareerItem;
import com.kbsw.campus_hackthon.entity.DefinedTag;
import com.kbsw.campus_hackthon.entity.Tags;
import com.kbsw.campus_hackthon.entity.UserProfile;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TFIDFRecommenderService {
    private final CareerItemRepository itemRepo;
    private final UserProfileRepository userRepo;
    private final RestTemplate restTemplate;
    private final String llamaApiUrl;
    private final String llamaApiKey;

    public TFIDFRecommenderService(CareerItemRepository itemRepo,
                                   UserProfileRepository userRepo,
                                   Dotenv dotenv) {
        this.itemRepo = itemRepo;
        this.userRepo = userRepo;
        this.restTemplate = new RestTemplate();
        this.llamaApiUrl = dotenv.get("LLAMA_API_URL");
        this.llamaApiKey = dotenv.get("LLAMA_API_KEY");
    }

    public List<CareerItem> recommendByUserProfile(Long id) {
        UserProfile user = userRepo.findById(id).orElseThrow(() -> {
            log.error("❌ 사용자 ID {}에 해당하는 유저를 찾을 수 없습니다.", id);
            return new IllegalArgumentException("유저를 찾을 수 없습니다.");
        });

        log.info("🔍 유저 불러오기 완료 - ID: {}, 진로: {}", user.getId(), user.getCareer());

        if (user.getCareer() != null && !user.getCareer().isEmpty()) {
            List<Tags> tags = user.getTags();

            if (tags == null || tags.isEmpty()) {
                log.info("🧠 유저 태그 없음 → 진로 기반 태그 생성 시작");
                for (Map.Entry<String, String> entry : generateTagsFromCareer(user.getCareer()).entrySet()) {
                    Tags tag = Tags.builder()
                            .tagName(entry.getKey())
                            .koreanName(entry.getValue())
                            .userProfile(user)
                            .build();
                    user.addTag(tag);
                    log.debug("➕ 태그 생성됨: {} ({})", entry.getKey(), entry.getValue());
                }
                userRepo.save(user);
                tags = user.getTags();
                log.info("✅ 유저 태그 저장 완료 ({}개)", tags.size());
            }

            List<String> tagNames = tags.stream().map(Tags::getTagName).toList();
            log.info("📝 유저 태그 리스트: {}", tagNames);
            return recommendByKeywords(tagNames);
        } else {
            throw new IllegalArgumentException("유저 진로 정보가 없습니다.");
        }
    }

    public Map<String, String> generateTagsFromCareer(String career) {
        return translateCareerToEnglishTags(career);
    }

    public Map<String, String> translateCareerToEnglishTags(String koreanText) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + llamaApiKey);

        String prompt = "진로: " + koreanText +
                "\n아래 리스트에 있는 태그들 중에서 해당 진로와 관련 있는 키워드 5개를 코드블럭 없이 순수한 json으로 영어-한글 쌍으로 추출해줘. " +
                "예시는 반드시 아래 형식처럼 출력해줘. 다른 설명은 하지 마. " +
        "예시 형식: {\"spring\": \"스프링\", \"java\": \"자바\"}"
                + "\n 'backend', 'java', 'spring', 'sql', 'rest api', 'docker', 'aws', 'linux', 'mysql', 'devops',\n" +
                "  'research', 'lab', 'data science', 'statistics', 'python', 'pandas', 'tensorflow', 'pytorch',\n" +
                "  'law', 'government', 'public service', 'tax', 'policy', 'teacher', 'judge',\n" +
                "  'youtube', 'influencer', 'content', 'editing', 'vlog', 'video', 'social media',\n" +
                "  'entrepreneurship', 'freelancer', 'marketing', 'accounting', 'startup', 'sales', 'finance',\n" +
                "  'celebrity', 'entertainment', 'performer'";

        log.info("📡 LLM 요청 전송 시작");
        log.info("🔍 LLM Prompt: {}", prompt);
        log.debug("LLM Prompt: {}", prompt);
        log.debug("요청 URL: {}", llamaApiUrl);

        Map<String, Object> payload = new HashMap<>();
        payload.put("model", "openrouter/cypher-alpha:free");
        payload.put("messages", List.of(Map.of("role", "user", "content", prompt)));
        payload.put("max_tokens", 200);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(llamaApiUrl, new HttpEntity<>(payload, headers), String.class);
            JsonNode json = new ObjectMapper().readTree(response.getBody());
            String content = json.path("choices").get(0).path("message").path("content").asText();

            log.info("📨 LLM 응답 수신 완료: {}", content);
            return new ObjectMapper().readValue(content, HashMap.class);
        } catch (Exception e) {
            log.error("🔥 LLM 응답 처리 중 오류 발생", e);
            return Map.of();
        }
    }

    public List<CareerItem> recommendByKeywords(List<String> inputKeywords) {
        List<String> cleanedKeywords = inputKeywords.stream().map(k -> k.trim().toLowerCase()).toList();
        log.info("🔎 입력 키워드: {}", inputKeywords);
        log.debug("🔧 정제된 키워드: {}", cleanedKeywords);

        List<CareerItem> items = itemRepo.findAllWithDefinedTags();
        log.info("📦 전체 CareerItem 개수: {}", items.size());

        Set<String> allTags = items.stream()
                .flatMap(item -> item.getDefinedTags().stream())
                .map(tag -> tag.getTagName().trim().toLowerCase())
                .collect(Collectors.toSet());

        Map<String, Integer> tagIndexMap = new HashMap<>();
        int idx = 0;
        for (String tag : allTags) tagIndexMap.put(tag, idx++);

        int tagSize = tagIndexMap.size();
        Map<Long, double[]> itemVectors = new HashMap<>();
        Map<String, Integer> df = new HashMap<>();

        for (CareerItem item : items) {
            double[] tf = new double[tagSize];
            Set<String> counted = new HashSet<>();

            for (DefinedTag tag : item.getDefinedTags()) {
                String tagName = tag.getTagName().trim().toLowerCase();
                tf[tagIndexMap.get(tagName)]++;
                if (counted.add(tagName)) {
                    df.put(tagName, df.getOrDefault(tagName, 0) + 1);
                }
            }
            itemVectors.put(item.getId(), tf);
        }

        int docCount = items.size();
        for (Map.Entry<Long, double[]> entry : itemVectors.entrySet()) {
            double[] tfidf = entry.getValue();
            for (int i = 0; i < tfidf.length; i++) {
                final int iFinal = i;
                String tag = tagIndexMap.entrySet().stream()
                        .filter(e -> e.getValue().equals(iFinal)).map(Map.Entry::getKey)
                        .findFirst().orElse(null);
                double idf = Math.log((double) docCount / (1 + df.getOrDefault(tag, 1)));
                tfidf[i] *= idf;
            }
            double norm = Math.sqrt(Arrays.stream(tfidf).map(x -> x * x).sum());
            for (int i = 0; i < tfidf.length; i++) tfidf[i] /= norm;
        }

        double[] userVector = new double[tagSize];
        for (String keyword : cleanedKeywords) {
            if (tagIndexMap.containsKey(keyword)) {
                userVector[tagIndexMap.get(keyword)] = 1.0;
            }
        }

        double norm = Math.sqrt(Arrays.stream(userVector).map(x -> x * x).sum());
        for (int i = 0; i < userVector.length; i++) userVector[i] /= norm;
        log.info("🧠 유저 벡터 생성 완료");

        List<CareerItem> result = items.stream()
                .sorted(Comparator.comparingDouble(a -> -cosineSim(itemVectors.get(a.getId()), userVector)))
                .limit(5)
                .collect(Collectors.toList());

        log.info("✅ 추천 결과 CareerItem ID: {}", result.stream().map(CareerItem::getId).toList());
        return result;
    }

    private double cosineSim(double[] v1, double[] v2) {
        double dot = 0.0;
        for (int i = 0; i < v1.length; i++) dot += v1[i] * v2[i];
        return dot;
    }

    @Transactional
    public void updateUserProfile(Long userId, List<String> careers) {
        UserProfile user = userRepo.findById(userId).orElseThrow();
        log.info("🛠️ 유저 진로 업데이트 시작 - ID: {}, 진로 리스트: {}", userId, careers);

        String combinedCareer = String.join(", ", careers);
        user.setCareer(combinedCareer);
        user.getTags().clear();

        Map<String, String> tagMap = generateTagsFromCareer(combinedCareer);
        List<CareerItem> recommendedItems = recommendByKeywords(new ArrayList<>(tagMap.keySet()));
        CareerItem bestMatch = recommendedItems.isEmpty() ? null : recommendedItems.get(0);

        List<Tags> newTags = tagMap.entrySet().stream()
                .map(entry -> Tags.builder()
                        .tagName(entry.getKey())
                        .koreanName(entry.getValue())
                        .userProfile(user)
                        .careerItem(bestMatch)
                        .build())
                .toList();

        newTags.forEach(tags ->
                log.debug("➕ 태그 추가: {} ({}) - CareerItem ID: {}",
                        tags.getTagName(),
                        tags.getKoreanName(),
                        tags.getCareerItem() != null ? tags.getCareerItem().getId() : "없음"));

        newTags.forEach(user::addTag);
        userRepo.save(user);
        log.info("📌 유저 프로필 저장 완료");
    }
}