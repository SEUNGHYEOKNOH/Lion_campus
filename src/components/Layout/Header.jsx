import React from "react";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { LogIn, Search } from "lucide-react";

const Header = () => {
  return (
    <Head>
      <LeftSection>
        <Link to="/">
          <Logo src={logo} alt="로고" />
        </Link>
      </LeftSection>

      <SearchContainer>
        <Input type="text" placeholder="검색어를 입력하세요" />
        <SearchButton>
          <Search />
        </SearchButton>
      </SearchContainer>

      <RightSection>
        <Link to="/login" className="login-link">
          <LogIn size={20} />
          <span>로그인</span>
        </Link>
      </RightSection>
    </Head>
  );
};

export default Header;

// styled-components 정의 부분

const Head = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  max-width:1024px;
  margin: 0 auto;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const RightSection = styled.div`
  .login-link {
    display: flex;
    align-items: center;
    gap: 6px;
    text-decoration: none;
    color: #333;
    font-weight: 500;
  }

  .login-link:hover {
    color: #007acc;
  }
`;

const Logo = styled.img`
  height: 60px;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 460px;
  height: 40px;
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