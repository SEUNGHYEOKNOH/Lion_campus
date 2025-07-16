import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import styled from "styled-components";

const Sidebar = () => {
  const location = useLocation();

  return (
    <SidebarWrapper>
      <LogoWrapper>
        <Link to="/">
          <img src={logo} alt="MAKER Logo" />
        </Link>
      </LogoWrapper>

      {location.pathname == "/mypage" ? (
        <Menu>
          <StyledLink to="/mypage" $active={location.pathname === "/mypage"}>
            개인정보 수정
          </StyledLink>
          <StyledLink
            to="/mypage/delete"
            $active={location.pathname === "/mypage/delete"}
          >
            회원탈퇴
          </StyledLink>
        </Menu>
      ) : (
        <Menu>
          <StyledLink
            to="/milestone"
            $active={location.pathname === "/milestone"}
          >
            내 활동 기록
          </StyledLink>
          <StyledLink
            to="/mypage/delete"
            $active={location.pathname === "/mypage"}
          >
            글 관리
          </StyledLink>
        </Menu>
      )}
    </SidebarWrapper>
  );
};

export default Sidebar;

const SidebarWrapper = styled.div`
  width: 20rem;
  height: 100vh;
  background-color: #f7f8fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 0;
  border-right: 1px solid #d3d3d3;
`;

const LogoWrapper = styled.div`
  margin-top: 3rem;
  margin-bottom: 4rem;

  img {
    width: 15rem;
  }
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  align-items: center;
`;

const StyledLink = styled(Link)`
  font-size: 16px;
  font-weight: ${(props) => (props.$active ? "bold" : "normal")};
  color: ${(props) => (props.$active ? "#102e4a" : "#444")};
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 6px;
  width: 100%;
  text-align: center;

  &:hover {
    background-color: #e0e6ed;
  }
`;
