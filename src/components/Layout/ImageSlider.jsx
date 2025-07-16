import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = ({ images }) => {
  const settings = {
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    arrows: true,
    slidesToScroll: 1,
  };

  return (
    <Slider {...settings}>
      {images.map((src, idx) => (
        <div key={idx}>
          <img
            src={src}
            alt={`slide-${idx}`}
            style={{
              width: "90%", // 슬라이더 너비에 맞춤
              height: "300px", // 고정 높이 (필요에 따라 조절)
              objectFit: "cover", // 이미지를 비율 유지하며 채우기
              borderRadius: "10px",
            }}
          />
        </div>
      ))}
    </Slider>
  );
};

export default ImageSlider;

// 슬라이더 사용 예시
// import ImageSlider from "../components/ImageSlider";

// const images = [
//   "/img1.jpg",
//   "/img2.jpg",
//   "/img3.jpg"
// ];

// function HomePage() {
//   return (
//     <div>
//       <h1>Welcome</h1>
//       <ImageSlider images={images} />
//     </div>
//   );
// }
