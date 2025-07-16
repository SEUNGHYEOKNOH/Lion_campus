import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import styled from "styled-components";

const MyPSideBar = () => {
  return (
    <SidebarWrapper>
      <Link to="/">
        <Logo src={logo} alt="로고"></Logo>
      </Link>
    </SidebarWrapper>
  );
};

export default MyPSideBar;

const SidebarWrapper = styled.div`
  width: 220px;
  height: 100vh;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const LogoWrapper = styled.div`
  margin-bottom: 40px;
`;

const LogoImage = styled.img`
  width: 120px;
  height: auto;
`;
