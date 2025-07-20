import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import FloatedMenu from "../components/Common/FloatedMenu";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRightCircle } from "lucide-react";
import tagImg1 from "../assets/tagImg1.png";
import { extractAndSaveTokensFromUrl } from "../utils/auth";
import { fetchUserTags } from "../api/tags";
import { userAPI } from "../utils/api";

const Main = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    id: null,
    name: "",
    email: "",
    nickname: "",
    school: "",
    major: "",
    career: "",
    tags: [],
  });

  const [userTags, setUserTags] = useState([]);

  useEffect(() => {
    const initUser = async () => {
      const savedUser = localStorage.getItem("userInfo");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUserInfo(parsed);
  
        try {
          const tags = await fetchUserTags(parsed.id);
          if (Array.isArray(tags)) {
            setUserTags(tags);
          } else {
            console.warn("❌ 태그 응답 형식이 잘못됨:", tags);
          }
        } catch (err) {
          console.error("❌ 태그 로딩 실패:", err);
        }
      } else {
        // URL에 토큰 있으면 저장
        const hasTokens = extractAndSaveTokensFromUrl();
        const accessToken = localStorage.getItem("accessToken");
  
        if (hasTokens || accessToken) {
          try {
            const user = await userAPI.getCurrentUser();
            setUserInfo(user);
            localStorage.setItem("userInfo", JSON.stringify(user));
  
            const tags = await fetchUserTags(user.id);
            if (Array.isArray(tags)) {
              setUserTags(tags);
            }
          } catch (err) {
            console.error("❌ 사용자 정보 또는 태그 로딩 실패:", err);
          }
        }
      }
    };
  
    initUser();
  }, []);
  

  const handleCardClick = (tagEn) => {
    if (tagEn) {
      navigate(`/tags/${encodeURIComponent(tagEn)}`);
    } else {
      console.warn("⚠️ 영어 태그(tagEn)가 없습니다.");
    }
  };

  return (
    <div>
      <Header />
      <Body>
        <Text1>
          <p className="MainTitle1">
            로그인 후 발자취를
            <br />
            기록하고 공유해보세요
          </p>
        </Text1>

        <RouteCardGrid>
          <Link to="/milestone">
            <FeatureCard style={{ backgroundColor: "#e0edff" }}>
              <div className="Headline4" style={{ fontWeight: 600 }}>마일스톤</div>
              <div style={{ fontSize: "12px", color: "#000000" }}>나의 기록을 한번에 볼 수 있어요</div>
              <ArrowWrapper>보러가기 <ArrowRightCircle /></ArrowWrapper>
            </FeatureCard>
          </Link>
          <Link to="/write">
            <FeatureCard style={{ backgroundColor: "#aecce9" }}>
              <div className="Headline4" style={{ fontWeight: 600 }}>글쓰기</div>
              <div style={{ fontSize: "12px", color: "#000000" }}>게시글을 작성할 수 있어요</div>
              <ArrowWrapper>포스팅하기 <ArrowRightCircle /></ArrowWrapper>
            </FeatureCard>
          </Link>
          <Link to="/tags" style={{ textDecoration: "none", color: "inherit" }}>
            <FeatureCard style={{ backgroundColor: "#84b4e1" }}>
              <div className="Headline4" style={{ fontWeight: 600 }}>해시태그 구독하기</div>
              <div style={{ fontSize: "12px", color: "#000000" }}>
                관심 있는 해시태그를 구독하고<br />소식을 받아보세요.
              </div>
              <ArrowWrapper>둘러보기 <ArrowRightCircle /></ArrowWrapper>
            </FeatureCard>
          </Link>
        </RouteCardGrid>

        <Text2>
          <p className="MainTitle1">
            인기있는
            <br />
            해시태그를 모았어요
          </p>
        </Text2>

        <TagCardGrid>
          {userTags.map((tag, idx) => (
            <TagCard1 key={idx} onClick={() => handleCardClick(tag.tagName)}>
              <CardHeader>
                <CategoryBadge>{tag.koreanName}</CategoryBadge>
                <RankChange>▲ TOP {idx + 1}</RankChange>
              </CardHeader>
              <HashTag>#{tag.tagName}</HashTag>
              <Thumbnail src={tag.imageUrl || tagImg1} alt={`${tag.tagName} 썸네일`} />
            </TagCard1>
          ))}
        </TagCardGrid>

        <Text2>
          <p className="MainTitle1">
            새로운 소식을
            <br />
            전해드릴게요
          </p>
        </Text2>

        <NewsGrid>
          <NewsCard style={{ background: "linear-gradient(180deg, #0a1f3d, #274c6e)" }}>
            <div>
              <NewsTitle>새 소식</NewsTitle>
              <NewsDesc>New</NewsDesc>
            </div>
            <ReadMore>확인하기 <ArrowRightCircle /></ReadMore>
          </NewsCard>
          <NewsCard style={{ background: "#a3d3e6" }}>
            <NewsTitle>2025 대한민국 공익광고제</NewsTitle>
            <NewsDesc>25.07.01 ~ 25.08.18</NewsDesc>
            <ReadMore>확인하기 <ArrowRightCircle /></ReadMore>
          </NewsCard>
          <NewsCard style={{ background: "linear-gradient(180deg, #0d2546, #193857)" }}>
            <NewsTitle>현직자가 알려주는 직무 경험 쌓는 법</NewsTitle>
            <ReadMore>확인하기 <ArrowRightCircle /></ReadMore>
          </NewsCard>
          <NewsCard style={{ background: "linear-gradient(180deg, #253c5b, #5c768e)" }}>
            <NewsTitle>MAKER 똑똑하게 사용하기</NewsTitle>
            <NewsDesc>#취업 #활용자 #사용설명서</NewsDesc>
            <ReadMore>확인하기 <ArrowRightCircle /></ReadMore>
          </NewsCard>
        </NewsGrid>
      </Body>
      <Footer />
      <FloatedMenu />
    </div>
  );
};

export default Main;

const RouteCardGrid = styled.div`
  display: flex;
  gap: 2%;
  justify-content: center;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FeatureCard = styled.div`
  background-color: ${({ bgColor }) => bgColor || "#f5f5f5"};
  border-radius: 1rem;
  padding: 1.2rem;
  width: 25vw;
  min-width: 15rem;
  height: 160px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &:hover {
    transform: translateY(-4px);
    transition: 0.2s ease;
  }
`;
const ArrowWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  cursor: pointer;
  margin-top: 12px;

  svg {
    width: 20px;
    height: 20px;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: translateX(4px);
  }
`;

const Text1 = styled.div`
  font-weight: 500;
  margin-left: 10%;
  margin-bottom: 2rem;
`;
const Text2 = styled.div`
  font-weight: 500;
  margin-top: 4rem;
  margin-left: 10%;
  margin-bottom: 2rem;
`;

const TagCardGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 3%;
  margin: auto;
`;

const TagCard1 = styled.div`
  width: 19.5vw;
  min-width: 7rem;
  height: 200px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  background-color: hsl(204, 10%, 91%);
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    transition: 0.2s ease;
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CategoryBadge = styled.div`
  font-size: 12px;
  font-weight: 500;
  background-color: #0a2941;
  color: white;
  padding: 2px 8px;
  border-radius: 8px;
`;
const RankChange = styled.div`
  font-size: 12px;
  color: #d33; /* 그냥 고정 색상으로 */
  font-weight: 600;
`;

const HashTag = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin: 8px 0;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 90px;
  border-radius: 8px;
  object-fit: cover;
`;

const NewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* ← 열을 2개로 고정 */
  grid-template-rows: repeat(2, auto); /* ← 2행 자동 높이 */
  gap: 16px;
  padding: 0 10%;
`;

const NewsCard = styled.div`
  background: linear-gradient(135deg, #0d1e30, #446185);
  border-radius: 16px;
  padding: 16px;
  height: 160px;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transition: 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
  }
`;

const NewsTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
`;

const NewsDesc = styled.div`
  font-size: 12px;
  opacity: 0.85;
`;

const ReadMore = styled.div`
  font-size: 12px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fff;

  svg {
    width: 16px;
    height: 16px;
  }
`;
