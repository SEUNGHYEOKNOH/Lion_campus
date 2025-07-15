// import { useNavigate } from "react-router-dom";
import "../styles/Main.css";
import Header from "../components/Layout/Header";
import DefaultCard from "../components/Common/Card";
import ImageSlider from "../components/Layout/ImageSlider";
import cardimg1 from "../assets/img-28.png";

const Main = () => {
  const hihi = () => {
    console.log(cardimg1);
  };

  const images = [cardimg1, cardimg1, cardimg1];
  return (
    <div>
      <Header>상단헤더 자리</Header>
      <div>메인페이지</div>
      <button onClick={hihi}></button>
      <main>
        <p className="MainTitle1">
          로그인 후 발자취를
          <br />
          기록하고 공유해보세요
        </p>
        <div className="routeCardContainer">
        </div>
        <p className="MainTitle1">
          인기있는
          <br />
          해시태그를 모았어요
        </p>
        <div className="SliderContainer">
          <ImageSlider images={images}></ImageSlider>
        </div>
      </main>
    </div>
  );
};

export default Main;
