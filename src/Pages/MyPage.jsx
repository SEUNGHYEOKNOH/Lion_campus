import styled from "styled-components";
import Sidebar from "../components/Layout/Sidebar";
import { useState } from "react";
import cryA from "../assets/A_cry.png";

const MyPage = () => {
  // 프롭으로 던져진거 처리
  const [selected, setSelected] = useState("edit");

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
                <Input defaultValue="홍길동" />
              </FormRow>
              <FormRow>
                <Label>계정</Label>
                <Input value="hong1234@maker.com" readOnly />
              </FormRow>
              <FormRow>
                <Label>전화번호</Label>
                <Input defaultValue="01012345678" />
              </FormRow>
              <FormRow>
                <Label>비밀번호</Label>
                <Input type="password" placeholder="********" />
              </FormRow>
              <FormRow>
                <Label>비밀번호 확인</Label>
                <Input type="password" placeholder="********" />
              </FormRow>
            </FormGroup>

            <Divider />

            <FormGroup>
              <FormRow>
                <Label>대학교</Label>
                <Input />
              </FormRow>
              <FormRow>
                <Label>학과</Label>
                <Input />
              </FormRow>
              <FormRow>
                <Label>희망진로</Label>
                <Input />
                <TagButton>태그추가</TagButton>
              </FormRow>
            </FormGroup>

            <ButtonGroup>
              <SubmitButton>수정</SubmitButton>
              <CancelButton>뒤로</CancelButton>
            </ButtonGroup>
          </Section>
        </MainContent>
      ) : (
        <Content>
          <Title>회원탈퇴</Title>
          <Box>
            <Question>MAKER를 정말 탈퇴하시겠습니까?</Question>
            <Description>작성하신 게시물은 모두 삭제됩니다.</Description>
            <Image src={cryA} alt="경고 아이콘" />
            <Buttons>
              <ConfirmBtn>예요, 확인 후 탈퇴하겠습니다.</ConfirmBtn>
              <CancelBtn>아니요, 탈퇴하지 않겠습니다.</CancelBtn>
            </Buttons>
          </Box>
        </Content>
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
`;

const Section = styled.div`
  max-width: 700px;
  margin: 0 auto;
`;

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

const TagButton = styled.button`
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 6px;
  background-color: #ffffff;
  border: 1px solid #888;
  cursor: pointer;
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

const Container = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex: 1;
  padding: 40px;
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
`;

const Description = styled.p`
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
