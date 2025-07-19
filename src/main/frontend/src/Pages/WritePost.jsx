import { useState } from "react";
import styled from "styled-components";
import Header from "../components/Layout/Header";
// Font Awesome 계열
import { FaImage,FaBold, FaItalic, FaUnderline, FaStrikethrough } from "react-icons/fa";

const WritePostPage = () => {
  const [form, setForm] = useState({
    event: "",
    period: "",
    rating: "",
    tags: "",
    visibility: "public",
    title: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <ContentWrapper>
      <Header />
      <Container>
        <TopBar>
          <LogoSection></LogoSection>
          <ButtonGroup>
            <Button>저장</Button>
            <SubmitButton>완료</SubmitButton>
          </ButtonGroup>
        </TopBar>

        <FormSection>
          <InputRow>
            <Label>참여 행사</Label>
            <Input name="event" value={form.event} onChange={handleChange} />
          </InputRow>
          <InputRow>
            <Label>행사 기간</Label>
            <Input name="period" value={form.period} onChange={handleChange} />
          </InputRow>
          <InputRow>
            <Label>평점</Label>
            <RatingInputWrapper>
              <Input
                name="rating"
                value={form.rating}
                onChange={handleChange}
              />
              <span>/ 5.0</span>
            </RatingInputWrapper>
          </InputRow>
          <InputRow>
            <Label>해시태그</Label>
            <Input name="tags" value={form.tags} onChange={handleChange} />
          </InputRow>

          <RadioGroup>
            <label>
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
            <FaImage/>
            |
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

const ContentWrapper = styled.div``;

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
`;



const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border: 1px solid #999;
  background: white;
`;

const SubmitButton = styled(Button)`
  background: #4e72f2;
  color: white;
  border: none;
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
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 4px;
`;

const Input = styled.input`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const RatingInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const RadioGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const EditorToolbar = styled.div`
  display: flex;
  gap: 12px;
  padding: 10px 0;
  font-size: 18px;
  color: #333;
`;

const TitleInput = styled.input`
  font-size: 20px;
  font-weight: bold;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #ccc;
`;

const ContentArea = styled.textarea`
  min-height: 300px;
  padding: 12px;
  font-size: 16px;
  border: none;
  resize: vertical;
  background-color: #fafafa;
`;
