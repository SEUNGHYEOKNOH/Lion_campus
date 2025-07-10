// import { useNavigate } from "react-router-dom";
import "../styles/Main.css"
import Header from "../components/Layout/Header";
import DefaltCard from "../components/Common/Card";

const Main = () => {
  return(
  <div>
      <Header>상단헤더 자리</Header>
    <div>메인페이지</div> 
    <p className="MainTitle1">
    로그인 후 발자취를 
    <br/>
    기록하고 공유해보세요</p>
    <div>
    <div className="routeCardContainer">
    <DefaltCard className="routeCard">
      <div className="">마일스톤</div>
    </DefaltCard>
    </div>

    </div>
    
    
    
  </div>)
};

export default Main;