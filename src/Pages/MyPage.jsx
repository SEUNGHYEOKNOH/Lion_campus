import React from "react";
import styled from "styled-components";

import Sidebar from "../components/Layout/Sidebar";

const MyPage = () => {
  return (
    <PageWrapper>
      <Sidebar />
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
