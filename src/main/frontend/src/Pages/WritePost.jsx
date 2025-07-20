import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../components/Layout/Header";
import logo from "../assets/logo.png";
import {
  FaImage,
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
} from "react-icons/fa";
import { userAPI } from "../utils/api";

const WritePostPage = () => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    event: "",
    period: "",
    rating: "",
    tags: "",
    visibility: "public",
    title: "",
    content: "",
  });

  const [userInfo, setUserInfo] = useState({
    id: "",
    name: "",
    email: "",
    nickname: "",
    school: "",
    major: "",
    career: "",
    tags: [],
  });

  const navigate = useNavigate();

  const isLoggedIn = () => {
    return !!localStorage.getItem("accessToken");
  };

  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const userData = await userAPI.getCurrentUser();
      setUserInfo({
        id: userData.id || "",
        name: userData.name || "",
        email: userData.email || "",
        nickname: userData.nickname || "",
        school: userData.school || "",
        major: userData.major || "",
        career: userData.career || "",
        tags: userData.tags || [],
      });
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      if (error.message.includes("인증")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    fetchUserInfo();
  }, [navigate]);

  useEffect(() => {
    console.log("🔍 사용자 태그 목록:", userInfo);
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagClick = (tag) => {
    const currentTags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag];
      setForm((prev) => ({ ...prev, tags: newTags.join(", ") }));
    }
  };

  const handleSubmit = async () => {
    const userProfileId = userInfo.id;
    if (!userProfileId) {
      alert("사용자 정보가 없습니다. 다시 로그인 해주세요.");
      return;
    }

    const [startDate, endDate] = form.period.split("~").map((d) => d.trim());

    const payload = {
      userProfileId: Number(userProfileId),
      title: form.title,
      content: form.content,
      imageUrl: "",
      tag: form.tags,
      isActive: form.visibility === "public",
      startDate,
      endDate,
    };

    let res;

    try {
      res = await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("게시글 생성 실패");

      const data = await res.json();
      alert("✅ 게시글이 성공적으로 등록되었습니다.");
      console.log("서버 응답:", data);
      navigate("/");
    } catch (err) {
      console.error("❌ 게시글 등록 실패:", err);
      if (res) {
        console.error("요청 응답 상태 코드:", res.status);
        const text = await res.text().catch(() => "");
        console.error("응답 본문:", text);
      }
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <ContentWrapper>
      <Container>
        <TopBar>
          <Logo
            src={logo}
            alt="로고"
            onClick={() => {
              navigate("/");
            }}
          ></Logo>
          <ButtonGroup>
            <OutlineButton>저장</OutlineButton>
            <FilledButton onClick={handleSubmit}>완료</FilledButton>
          </ButtonGroup>
        </TopBar>

        <FormSection>
          <InputRow>
            <Label>
              <span
                style={{
                  display: "inline-block",
                  width: "5px",
                  height: "13px",
                  backgroundColor: "#102e4a",
                  borderRadius: "4px",
                  marginRight: "8px",
                }}
              />
              참여 행사
            </Label>
            <Input name="event" value={form.event} onChange={handleChange} />
          </InputRow>
          <InputRow>
            <Label>
              {" "}
              <span
                style={{
                  display: "inline-block",
                  width: "5px",
                  height: "13px",
                  backgroundColor: "#102e4a",
                  borderRadius: "4px",
                  marginRight: "8px",
                }}
              />
              행사 기간
            </Label>

            <Input
              name="period"
              value={form.period}
              onChange={handleChange}
              placeholder="예: 2025-07-01 ~ 2025-07-03"
            />
          </InputRow>
          <InputRow>
            <Label>
              {" "}
              <span
                style={{
                  display: "inline-block",
                  width: "5px",
                  height: "13px",
                  backgroundColor: "#102e4a",
                  borderRadius: "4px",
                  marginRight: "8px",
                }}
              />
              평점
            </Label>
            <RatingInputWrapper>
              <Input
                name="rating"
                value={form.rating}
                style={{ marginLeft: "62px" }}
                onChange={handleChange}
              />
              <span>/ 5.0</span>
            </RatingInputWrapper>
          </InputRow>
          <InputRow>
            <Label>
              <span
                style={{
                  display: "inline-block",
                  width: "5px",
                  height: "13px",
                  backgroundColor: "#102e4a",
                  borderRadius: "4px",
                  marginRight: "8px",
                }}
              />
              해시태그
            </Label>
            <Input name="tags" value={form.tags} onChange={handleChange} />
          </InputRow>
          <FormRow style={{ marginLeft: "2rem" }}>
            <Label>
              <span
                style={{
                  display: "inline-block",
                  width: "5px",
                  height: "13px",
                  backgroundColor: "#102e4a",
                  borderRadius: "4px",
                  marginRight: "8px",
                }}
              />
              관심태그
            </Label>
            <TagContainer>
              {userInfo.tags.map((tag, index) => (
                <TagItem key={index} onClick={() => handleTagClick(tag)}>
                  {tag}
                </TagItem>
              ))}
            </TagContainer>
          </FormRow>

          <RadioGroup>
            <label style={{ marginLeft: "2rem" }}>
              <input
                type="radio"
                name="visibility"
                value="public"
                checked={form.visibility === "public"}
                onChange={handleChange}
              />{" "}
              전체공개
            </label>
            <label>
              <input
                type="radio"
                name="visibility"
                value="private"
                checked={form.visibility === "private"}
                onChange={handleChange}
              />{" "}
              비공개
            </label>
          </RadioGroup>

          <EditorToolbar>
            <FaImage />
            <span
              style={{
                display: "inline-block",
                width: "1px",
                height: "1.3rem",
                backgroundColor: "#102e4a",
                borderRadius: "4px",
                marginRight: "8px",
              }}
            />
            <FaBold />
            <FaItalic />
            <FaUnderline />
            <FaStrikethrough />
          </EditorToolbar>

          <TitleInput
            name="title"
            placeholder="제목"
            value={form.title}
            onChange={handleChange}
          />
          <ContentArea
            name="content"
            placeholder="활동내용을 기록해보세요! 다른 사용자들과 공유해보세요!"
            value={form.content}
            onChange={handleChange}
          />
        </FormSection>
      </Container>
    </ContentWrapper>
  );
};

export default WritePostPage;

// 스타일 정의
const ContentWrapper = styled.div`
  background-color: #f5f7f9;
  align-items: center;
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;

const Container = styled.div`
  max-width: 95vw;
  margin: 0 auto;
  padding: 20px;
  width: 100%;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  height: 5vh;
`;

const Logo = styled.img`
  height: 5vh;
  width: 14vh;
  position: absolute; // 로고 위치 고정(위치지정)
  left: 50%;
  transform: translateX(
    -50%
  ); //로고를 중앙정렬 시키기위해 로고 중앙을 가로중앙에 고정
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  position: absolute;
  right: 0;
`;

const OutlineButton = styled.button`
  padding: 6px 16px;
  border: 1px solid #102e4a;
  background-color: #ffffff;
  color: #102e4a;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  width: 5rem;

  &:hover {
    background-color: #102e4a;
    color: #ffffff;
  }
`;

const FilledButton = styled.button`
  padding: 6px 16px;
  background-color: #102e4a;
  color: #ffffff;
  border: 1px solid #102e4a;
  border-radius: 20px;
  font-weight: 500;
  cursor: pointer;
  width: 5rem;

  &:hover {
    background-color: #ffffff;
    color: #102e4a;
  }
`;

const FormSection = styled.div`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fff;
  border: 1px solid #ddd;
  padding: 32px;
  border-radius: 8px;
`;

const InputRow = styled.div`
  display: flex;
  padding: 4px 4px 4px 2rem;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 4px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border-radius: 1rem;
  border: 1px solid #ccc;
  height: 2rem;
  flex: 1;
  margin-left: 2rem;
  font-size: 14px;
`;

const RatingInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const TagItem = styled.span`
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #bbdefb;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end; // ← 오른쪽 정렬
  padding-right: 2rem; // ← 오른쪽에서 2rem 떨어지도록
  padding-bottom: 1rem; // 아래쪽 여백 추가
  border-bottom: 1px solid #ddd;
`;

const EditorToolbar = styled.div`
  display: flex;
  gap: 12px;
  padding: 10px 0;
  font-size: 18px;
  color: #333;
  padding: 0 0;
  margin-left: 0.5rem;
`;

const TitleInput = styled.input`
  font-size: 20px;
  font-weight: bold;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  border-top: 1px solid #ccc;
`;

const ContentArea = styled.textarea`
  height: 55vh;
  padding: 12px;
  font-size: 16px;
  border: none;
  resize: vertical;
  background-color: #fafafa;
`;
