import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import FloatedMenu from "../components/Common/FloatedMenu";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRightCircle } from "lucide-react";
import { extractAndSaveTokensFromUrl } from "../utils/auth";
import { fetchUserTags } from "../api/tags";
import { userAPI } from "../utils/api";
import { isLoggedIn } from "../utils/auth";

const Main = () => {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

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

  // 🔧 Firebase 이미지 URL 생성 함수
  const getFirebaseImageUrl = (tagName) => {
    const encoded = encodeURIComponent(`${tagName}.png`);
    return `https://firebasestorage.googleapis.com/v0/b/web-kit-69b0d/o/${encoded}?alt=media`;
  };

  // ✅ 사용자 및 태그 정보 불러오기
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
          }
        } catch (err) {
          console.error("❌ 태그 로딩 실패:", err);
        }
      } else {
        // 토큰 추출 시도
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
            // ❗ 로그인 페이지로 이동하거나 알림 처리도 가능
          }
        } else {
          console.warn("⚠️ 토큰도 없고 저장된 사용자 정보도 없습니다.");
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
        <Text1 style={{ marginTop: "2rem", marginBottom: "1rem" }}>
          {loggedIn ? (
            <p
              className="MainTitle1"
              style={{ fontSize: "20px", lineHeight: "1.2" }}
            >
              {userInfo.name}님의
              <br />
              발자취를
              <br /> 기록하고 공유해보세요
            </p>
          ) : (
            <p
              className="MainTitle1 "
              style={{ fontSize: "20px", lineHeight: "1.2" }}
            >
              로그인 후 발자취를
              <br />
              기록하고 공유해보세요
            </p>
          )}
        </Text1>

        <RouteCardGrid>
          <Link to="/milestone">
            <FeatureCard style={{ backgroundColor: "#e0edff" }}>
              <div
                className="Headline4"
                style={{ fontWeight: 800, fontSize: "22px" }}
              >
                마일스톤
              </div>
              <div
                style={{ fontSize: "12px", color: "#000000", marginTop: "8px" }}
              >
                이정표로 나의 기록을
                <br />
                한눈에 볼 수 있어요.
              </div>
              <ArrowWrapper>
                보러가기 <ArrowRightCircle />
              </ArrowWrapper>
            </FeatureCard>
          </Link>
          <Link to="/write">
            <FeatureCard style={{ backgroundColor: "#aecce9" }}>
              <div
                className="Headline4"
                style={{ fontWeight: 800, fontSize: "22px" }}
              >
                글쓰기
              </div>
              <div
                style={{ fontSize: "12px", color: "#000000", marginTop: "8px" }}
              >
                참여한 활동에 별점을 매기고
                <br />
                기록을 남겨보세요.
              </div>
              <ArrowWrapper>
                포스팅하기 <ArrowRightCircle />
              </ArrowWrapper>
            </FeatureCard>
          </Link>
          <Link to="/tags" style={{ textDecoration: "none", color: "inherit" }}>
            <FeatureCard style={{ backgroundColor: "#84b4e1" }}>
              <div
                className="Headline4"
                style={{ fontWeight: 800, fontSize: "22px" }}
              >
                해시태그 구독하기
              </div>
              <div
                style={{ fontSize: "12px", color: "#000000", marginTop: "8px" }}
              >
                관심 있는 해시태그를 구독하고
                <br />
                소식을 받아보세요.
              </div>
              <ArrowWrapper>
                둘러보기 <ArrowRightCircle />
              </ArrowWrapper>
            </FeatureCard>
          </Link>
        </RouteCardGrid>

        <Text2>
          {loggedIn ? (
            <p
              className="MainTitle1"
              style={{ fontSize: "20px", lineHeight: "1.2" }}
            >
              {userInfo.name}님을 위한
              <br />
              해시태그를 모았어요
            </p>
          ) : (
            <p
              className="MainTitle1"
              style={{ fontSize: "20px", lineHeight: "1.2" }}
            >
              인기있는
              <br />
              해시태그를 모았어요
            </p>
          )}
        </Text2>

        <TagCardGrid>
          {userTags.slice(0, 4).map((tag, idx) => (
            <TagCard1 key={idx} onClick={() => handleCardClick(tag.tagName)}>
              <CardHeader>
                <CategoryBadge>{tag.koreanName}</CategoryBadge>
                <RankChange>▲ TOP {idx + 1}</RankChange>
              </CardHeader>
              <HashTag>#{tag.tagName}</HashTag>
              <Thumbnail
                src={tag.imageUrl || getFirebaseImageUrl(tag.tagName)}
                alt={`${tag.tagName} 썸네일`}
              />
            </TagCard1>
          ))}
        </TagCardGrid>

        <Text2 style={{ marginBottom: "1rem" }}>
          {loggedIn ? (
            <p
              className="MainTitle1"
              style={{ fontSize: "20px", lineHeight: "1.2" }}
            >
              {userInfo.name}님께
              <br />
              새로운 소식을
              <br />
              전해드릴게요
            </p>
          ) : (
            <p
              className="MainTitle1"
              style={{ fontSize: "20px", lineHeight: "1.2" }}
            >
              새로운 소식을
              <br />
              전해드릴게요
            </p>
          )}
        </Text2>

        <NewsGrid>
          <NewsCard
            style={{ background: "linear-gradient(180deg, #0a1f3d, #274c6e)" }}
          >
            <div>
              <NewsTitle>새 소식</NewsTitle>
              <NewsDesc>New</NewsDesc>
            </div>
            <ReadMore>
              확인하기 <ArrowRightCircle />
            </ReadMore>
          </NewsCard>
          <NewsCard
            style={{ background: "linear-gradient(135deg, #4B4F53, #818F9C)" }}
          >
            <NewsTitle >
              2025 대한민국 공익광고제
            </NewsTitle>
            <NewsDesc>25.07.01 ~ 25.08.18</NewsDesc>
            <ReadMore>
              확인하기 <ArrowRightCircle />
            </ReadMore>
          </NewsCard>
          <NewsCard
            style={{ background: "linear-gradient(180deg, #0d2546, #193857)" }}
          >
            <NewsTitle>현직자가 알려주는 직무 경험 쌓는 법</NewsTitle>
            <ReadMore>
              확인하기 <ArrowRightCircle />
            </ReadMore>
          </NewsCard>
          <NewsCard
            style={{ background: "linear-gradient(180deg, #253c5b, #5c768e)" }}
          >
            <NewsTitle>MAKER 똑똑하게 사용하기</NewsTitle>
            <NewsDesc>#취업 #활용자 #사용설명서</NewsDesc>
            <ReadMore>
              확인하기 <ArrowRightCircle />
            </ReadMore>
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
  gap: 1%;
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
  height: 11rem;
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
  justify-content: flex-end;
`;

const Text1 = styled.div`
  font-weight: 700;
  margin-left: 10%;
  margin-bottom: 2rem;
`;
const Text2 = styled.div`
  font-weight: 700;
  margin-top: 4rem;
  margin-left: 10%;
  margin-bottom: 2rem;
`;

const TagCardGrid = styled.div`
  display: flex;
  align-items: center;
  gap: 1%;
  margin: auto;
`;

const TagCard1 = styled.div`
  width: 23vw;
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
  font-size: 22px;
  font-weight: 700;
  
`;

const NewsDesc = styled.div`
  font-size: 12px;
  opacity: 0.85;
  // line-height: 1.2;
`;

const ReadMore = styled.div`
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  justify-content: flex-end;

  svg {
    width: 16px;
    height: 16px;
  }
`;
