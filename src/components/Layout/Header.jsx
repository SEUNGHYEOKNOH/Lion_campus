// import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { LogIn, LogOut, Search } from "lucide-react"; // ← lucide에서 가져옴

const Header = () => {
  // const onclicked = (e) => {
  //   console.log(e.target);
  // };

  return (
    <Head>
      {/* <LogoWrapper onClick={onclicked}> */}
      <LogoWrapper>
        <Link to="/" alt="로고">
          <img src={logo}></img>
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

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 10%;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 20rem;
  height: 2rem;
  border: 1px solid #ccc;
  border-radius: 20px;
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
  padding: 0;
  display: flex;
  align-items: center;
`;
const LogoWrapper = styled.div`
  flex-shrink: 0;
  img {
    height: 50px;
  }
  margin-left: 12px;
`;

const Btns = styled.div`
  display: flex;
  gap: 20px;
`;

export default Header;
