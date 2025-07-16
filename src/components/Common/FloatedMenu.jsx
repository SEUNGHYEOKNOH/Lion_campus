import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Flag, Pen, MessageCircle } from "lucide-react";
import AIcon from "../../assets/AIcon.png";

const FloatedMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleClick = (path) => {
    navigate(path);
  };

  return (
    <Wrapper
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {open && (
        <>
          <ActionButton onClick={() => handleClick("/write")}>
            <Pen size={18} />
          </ActionButton>
          <ActionButton onClick={() => handleClick("/milestone")}>
            <Flag size={18} />
          </ActionButton>
        </>
      )}
      <MainButton onClick={() => setOpen(!open)}>
        {/* <Dot /> */}
        <img src={AIcon} alt="플롯 아이콘" />
      </MainButton>
    </Wrapper>
  );
};

export default FloatedMenu;

const Wrapper = styled.div`
  position: fixed;
  bottom: 32px;
  right: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  z-index: 100;
`;

const MainButton = styled.button`
  width: 50px;
  height: 50px;
  background-color: #102e4a;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
`;

const ActionButton = styled(MainButton)`
  background-color: #ffffff;
  color: #102e4a;
  transition: all 0.3s ease;
  &:hover {
    background-color: #e7effc;
  }
`;
