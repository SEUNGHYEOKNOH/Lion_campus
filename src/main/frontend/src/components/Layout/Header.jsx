// components/Layout/Header.jsx
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { LogIn, LogOut, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { isLoggedIn, clearTokens } from "../../utils/auth";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const Header = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  // 로그아웃 처리
  const handleLogout = () => {
    clearTokens();
    setLoggedIn(false);
    navigate('/');
    alert('로그아웃되었습니다.');
  };

  return (
    <Head>
      {/* <div onClick={handleLogout}>테스트용 로그인 버튼</div> */}
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
      {loggedIn ? (
        <Btns>
          <Link to="/mypage">
            <div>마이페이지</div>
          </Link>
          <div onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <div>로그아웃</div>
          </div>
        </Btns>
      ) : (
        <Btns>
          <Link to="/login">
            <div>로그인</div>
          </Link>
          <Link to="/signup">
            <div>회원가입</div>
          </Link>
        </Btns>
      )}
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
