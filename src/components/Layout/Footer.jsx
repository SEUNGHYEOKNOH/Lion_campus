import styled from "styled-components";

const Footer = () => {
  return (
    <Foot>
      <FooterMenu>
        <FooterItem>이용약관</FooterItem>
        <FooterItem>개인정보처리방침</FooterItem>
        <FooterItem>약관</FooterItem>
        <FooterItem>고객센터</FooterItem>
      </FooterMenu>
    </Foot>
  );
};

export default Footer;

const Foot = styled.footer`
  width: 100%;
  border-top: 1px solid #ddd;
  padding: 16px 0;
  background-color: #fff;
  display: flex;
  justify-content: flex-start; /* ← 왼쪽 정렬 */
  align-items: center;
  margin-top: 5rem;
`;

const FooterMenu = styled.ul`
  display: flex;
  gap: 24px;
  list-style: none;
  padding: 0;
  margin-bottom: 6%;
  margin-left: 10%;
  font-size: 12px;
  color: #888;
`;

const FooterItem = styled.li`
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;
