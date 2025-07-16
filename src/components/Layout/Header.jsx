// components/Layout/Header.jsx
import React from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { LogIn, LogOut, Search } from "lucide-react";

const Header = () => {
  return (
    <Head>
      <LogoWrapper>
        <Link to="/">
          <img src={logo} alt="로고" />
        </Link>
      </LogoWrapper>

      <SearchContainer>
        <Input type="text" placeholder="검색어를 입력하세요" />
        <SearchButton>
          <Search />
        </SearchButton>
      </SearchContainer>

      <Btns>
        <Link to="/login">
          <div>로그인</div>
        </Link>
        <Link to="/signup">
          <div>회원가입</div>
        </Link>
      </Btns>
    </Head>
  );
};

export default Header;

// styled-components
const Head = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  max-width: 1024px;
  margin: 0 auto;
`;

const LogoWrapper = styled.div`
  flex-shrink: 0;
  img {
    height: 50px;
  }
  margin-left: 12px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 20rem;
  height: 2rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 12px;
  background-color: #fff;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding-left: 8px;
  background: transparent;
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-size: 18px;
  display: flex;
  align-items: center;
`;

const Btns = styled.div`
  display: flex;
  gap: 20px;
`;