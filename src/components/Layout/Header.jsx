// import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { LogIn, LogOut, Search } from "lucide-react"; // ← lucide에서 가져옴


const Header = () => {
  const onclicked = (e) => {
    console.log(e.target);
  };
  return (
    <Head>
      <LogoWrapper onClick={onclicked}>
        <Link to="/" alt="로고"></Link>
        <img src={logo}></img>
      </LogoWrapper>
      <SearchContainer>
        <Input type="text" placeholder="검색어를 입력하세요" />
        <SearchButton>
          <Search />
        </SearchButton>
      </SearchContainer>
      <div className="login">
        <Link to="/login"></Link>
      </div>
    </Head>
  );
};

const Head = styled.div`
  display: flex;
  align-items: center;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
  height: 40px;
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
    height: 40px;
  }
`;

export default Header;
