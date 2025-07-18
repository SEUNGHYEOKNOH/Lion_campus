import styled from "styled-components";
import logo from "../assets/logo.png"; // Maker 로고 이미지 위치에 맞게 수정
import google from "../assets/google.png";
import naver from "../assets/naver.png";
import kakao from "../assets/kakao.png";
import { Link } from "react-router-dom";


const LoginPage = () => {
  const loginWithOAuth = (provider) => {
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
  };

  return (
    <Wrapper>
      <LoginBox>
        <Link to="/">
          <Logo src={logo} alt="MAKER Logo" />
        </Link>

        <Input type="text" placeholder="아이디" />
        <Input type="password" placeholder="비밀번호" />
        <LoginButton>로그인</LoginButton>
        <SocialLogin>
          <Icon
            src={google}
            alt="Google"
            onClick={() => {
              loginWithOAuth("google");
            }}
          />
          <Icon
            src={naver}
            alt="Naver"
            onClick={() => {
              loginWithOAuth("naver");
            }}
          />
          <Icon
            src={kakao}
            alt="Kakao"
            onClick={() => {
              loginWithOAuth("kakao");
            }}
          />
        </SocialLogin>
        <SubMenu>
          <a href="#">회원가입</a> | <a href="#">비밀번호 찾기</a> |{" "}
          <a href="#">아이디 찾기</a>
        </SubMenu>
        <Footer>
          <a href="#">도움말</a> · <a href="#">개인정보처리방침</a> ·{" "}
          <a href="#">약관</a>
        </Footer>
      </LoginBox>
    </Wrapper>
  );
};

export default LoginPage;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #97acf3, #f7f4ef);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginBox = styled.div`
  width: 400px;
  text-align: center;
  align-items: center;
`;

const Logo = styled.img`
  display:block
  width: 200px;
  margin-bottom: 3rem;
  
`;

const Input = styled.input`
  width: 100%;
  height: 44px;
  margin-bottom: 12px;
  border-radius: 22px;
  border: none;
  padding: 0 16px;
  font-size: 16px;
  background-color: #ffffff;
`;

const LoginButton = styled.button`
  margin-top: 1.5rem;
  width: 100%;
  height: 44px;
  background-color: #102e4a;
  color: white;
  border-radius: 22px;
  border: none;
  font-weight: bold;
  margin-bottom: 2.5rem;
  cursor: pointer;
`;

const SocialLogin = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const Icon = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
`;

const SubMenu = styled.div`
  font-size: 13px;

  margin-top: 2rem;

  a {
    text-decoration: none;
    color: #444;
    margin: 0 4px;
  }
`;

const Footer = styled.div`
  font-size: 12px;
  color: #888;
  margin-top: 8rem;

  a {
    text-decoration: none;
    color: #888;
    margin: 0 4px;
  }
`;
