import styled from "styled-components";
import Sidebar from "../components/Layout/Sidebar";
import { useState, useEffect } from "react";
import cryA from "../assets/A_cry.png";
import { userAPI } from "../utils/api";
import { isLoggedIn, clearTokens } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { put } from "../utils/api"; // 또는 상대 경로에 따라 조정

const MyPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("edit");
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    nickname: "",
    school: "",
    major: "",
    career: "",
    tags: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 로그인 확인 및 사용자 정보 조회
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    fetchUserInfo();
  }, [navigate]);

  // 사용자 정보 조회
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

  // 입력값 변경 처리
  const handleInputChange = (field, value) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 사용자 정보 수정
  const handleSubmit = async () => {
    try {
      setSaving(true);
      // name과 email은 소셜 로그인에서 가져온 정보이므로 수정 요청에서 제외
      const updatedUser = await userAPI.updateUser({
        nickname: userInfo.nickname,
        school: userInfo.school,
        major: userInfo.major,
        career: userInfo.career,
        tags: userInfo.tags,
      });

      setUserInfo({
        ...userInfo,
        ...updatedUser,
      });

      alert("정보가 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("사용자 정보 수정 실패:", error);
      alert("정보 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  // 회원 탈퇴
  const handleDeleteAccount = async () => {
    if (!window.confirm("정말로 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.")) {
      return;
    }

    try {
      await userAPI.deleteUser();
      clearTokens();
      alert("회원 탈퇴가 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("회원 탈퇴 실패:", error);
      alert("회원 탈퇴에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleGenerateTagsFromCareer = async () => {
    const career = userInfo.career?.trim();
    if (!career) {
      alert("희망진로를 입력해주세요.");
      return;
    }

    try {
      // 이미 만들어진 put() 함수 사용
      await put(`/api/recommend/user/${userInfo.id}`, [career]);

      alert("태그가 성공적으로 생성되었습니다. 새로고침 후 확인하세요.");

      // 또는 생성 후 새로 유저 정보 불러오기:
      await fetchUserInfo();
    } catch (err) {
      console.error("태그 생성 오류:", err);
      alert("태그 생성에 실패했습니다.");
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <LoadingWrapper>로딩 중...</LoadingWrapper>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Sidebar selected={selected} onSelect={setSelected} />
      {selected == "edit" ? (
        <MainContent>
          <Section>
            <SectionTitle>개인정보 수정</SectionTitle>
            <Divider />
            <FormGroup>
              <FormRow>
                <Label>이름</Label>
                <Input
                  value={userInfo.name || ""}
                  readOnly
                  placeholder="소셜 로그인으로 설정된 이름"
                />
              </FormRow>
              <FormRow>
                <Label>계정</Label>
                <Input
                  value={userInfo.email || ""}
                  readOnly
                  placeholder="소셜 로그인 계정"
                />
              </FormRow>
              <FormRow>
                <Label>닉네임</Label>
                <Input
                  value={userInfo.nickname || ""}
                  onChange={(e) =>
                    handleInputChange("nickname", e.target.value)
                  }
                  placeholder="닉네임을 입력하세요"
                />
              </FormRow>
            </FormGroup>

            <Divider />

            <FormGroup>
              <FormRow>
                <Label>대학교</Label>
                <Input
                  value={userInfo.school || ""}
                  onChange={(e) => handleInputChange("school", e.target.value)}
                  placeholder="대학교를 입력하세요"
                />
              </FormRow>
              <FormRow>
                <Label>학과</Label>
                <Input
                  value={userInfo.major || ""}
                  onChange={(e) => handleInputChange("major", e.target.value)}
                  placeholder="학과를 입력하세요"
                />
              </FormRow>
              <FormRow>
                <Label>희망진로</Label>
                <Input
                  value={userInfo.career || ""}
                  onChange={(e) => handleInputChange("career", e.target.value)}
                  placeholder="희망진로를 입력하세요"
                />
                <TagButton onClick={handleGenerateTagsFromCareer}>
                  태그 생성
                </TagButton>
              </FormRow>
              {userInfo.tags && userInfo.tags.length > 0 && (
                <FormRow>
                  <Label>관심태그</Label>
                  <TagContainer>
                    {userInfo.tags.map((tag, index) => (
                      <TagItem key={index}>{tag}</TagItem>
                    ))}
                  </TagContainer>
                </FormRow>
              )}
            </FormGroup>
            <ButtonGroup>
              <SubmitButton onClick={handleSubmit} disabled={saving}>
                {saving ? "저장 중..." : "수정"}
              </SubmitButton>
              <CancelButton onClick={() => navigate(-1)}>뒤로</CancelButton>
            </ButtonGroup>
          </Section>
        </MainContent>
      ) : (
        <MainContent>
          <Title>회원탈퇴</Title>
          <Box>
            <Question>MAKER를 정말 탈퇴하시겠습니까?</Question>
            <Description>작성하신 게시물은 모두 삭제됩니다.</Description>
            <Image src={cryA} alt="경고 아이콘" />
            <Buttons>
              <ConfirmBtn onClick={handleDeleteAccount}>
                예, 확인 후 탈퇴하겠습니다.
              </ConfirmBtn>
              <CancelBtn onClick={() => setSelected("edit")}>
                아니요, 탈퇴하지 않겠습니다.
              </CancelBtn>
            </Buttons>
          </Box>
        </MainContent>
      )}
    </PageWrapper>
  );
};

export default MyPage;

const PageWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 40px 60px;
  background-color: white;
  max-width: 700px;
  margin: 0 auto;
`;

const Section = styled.div``;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ccc;
  margin: 16px 0 24px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Label = styled.label`
  width: 100px;
  text-align: right;
  font-size: 14px;
  color: #333;
`;

const Input = styled.input`
  width: 280px;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: ${(props) => (props.readOnly ? "#f2f2f2" : "white")};
`;

const ButtonGroup = styled.div`
  margin-top: 32px;
  display: flex;
  gap: 16px;
  justify-content: center;
`;

const SubmitButton = styled.button`
  padding: 10px 24px;
  background-color: #102e4a;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #0c243b;
  }
`;

const CancelButton = styled.button`
  padding: 10px 24px;
  background-color: white;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 15px;
  cursor: pointer;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 32px;
`;

const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fdfdfd;
  border: 1px solid #ddd;
  border-radius: 16px;
  padding: 40px;
  max-width: 600px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  he
`;

const Question = styled.h2`
  font-size: 20px;
  margin-bottom: 12px;
  min-width: 18rem;
`;

const Description = styled.p`
  min-width: 17rem;
  color: #666;
  margin-bottom: 24px;
`;

const Image = styled.img`
  width: 80px;
  margin-bottom: 24px;
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ConfirmBtn = styled.button`
  background-color: #102e4a;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #0c243b;
  }
`;

const CancelBtn = styled.button`
  background-color: transparent;
  color: #102e4a;
  padding: 12px;
  border: 1px solid #102e4a;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #f2f4f7;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 18px;
  color: #666;
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
`;
const TagButton = styled.button`
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 6px;
  background-color: #ffffff;
  border: 1px solid #888;
  cursor: pointer;
  min-width: 80px;
`;
