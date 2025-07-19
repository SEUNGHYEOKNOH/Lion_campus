// components/Layout/Header.jsx
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {  Search } from "lucide-react";
import { isLoggedInState } from "../../atoms/authState";
import { useRecoilState } from "recoil";
import { removeTokens } from "../../api/auth";
// import { isLoggedInState } from "../recoil/authState";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useRecoilState(isLoggedInState);

  const handleLogout = () => {
    setIsLoggedIn((prev) => !prev);
    removeTokens();
    window.location.href = "/"; // 홈 페이지로 리다이렉트
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
      {isLoggedIn ? (
        <Btns>
          <Link to="/mypage">
            <div>마이페이지</div>
          </Link>
          <div
            onClick={() => {
              handleLogout();
            }}
          >
            <div>로그아웃</div>
          </div>
        </Btns>
      ) : (
        <Btns>
          <Link to="/login">
            <div>로그인</div>
          </Link>

          <div>회원가입</div>
        </Btns>
      )}
    </Head>
  );
};

export default Header;

// styled-components
const Head = styled.header`
  display: flex; // Flexbox로 자식 요소 수평 배치
  justify-content: space-between; // 좌우 끝 정렬
  align-items: center; // 수직 정렬 중앙

  padding: 12px 24px; // 내부 여백
  max-width: 100%; // 컨테이너가 부모 너비에 맞게 제한
  margin: 0 auto; // 가운데 정렬
  height: 10vh; // 브라우저 높이의 10%를 헤더 높이로 사용
`;

const LogoWrapper = styled.div`
  margin-left: 10%; // 부모 요소(예: Head)의 너비 기준으로 왼쪽에 10% 여백을 줌
  flex-shrink: 0; // 공간이 부족할 때 이 요소는 절대 줄어들지 않도록 설정
  height: 100%; // 부모 요소의 높이를 100%로 따라감 (예: Head의 높이가 10vh라면 이 div도 10vh)

  img {
    display: block; // inline 특성 제거 → 여백 방지
    height: 50%;
    object-fit: contain; // 비율 유지하면서 박스에 맞게 들어가도록
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 40%;
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
  font-size: 18px;2
  display: flex;
  align-items: center;
`;

const Btns = styled.div`
  display: flex;
  gap: 20px;
  margin-right: 10%;
`;
