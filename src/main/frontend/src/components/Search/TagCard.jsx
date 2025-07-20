import React from 'react';
import styles from '../../styles/Search/TagCard.module.css';
import { useNavigate } from 'react-router-dom';

const TagCard = ({ tag, tagEn, rank, rating, imageUrl, onSubscribe }) => {
  const navigate = useNavigate();

  const handleCardClick = (tagEn) => {
    if (tagEn) {
      navigate(`/tags/${tagEn}`);
    } else {
      console.warn("⚠️ 영어 태그(tagEn)가 없습니다.");
    }
  };



  const handleSubscribeClick = (e) => {
    e.stopPropagation(); // 부모 div의 onClick 전파 방지
    onSubscribe();
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.description}>
        <div className={styles.header}>
          <div className={styles.left}>
            <span className={styles.tag}>#{tag}</span>
            <span className={styles.rank}>TOP {rank}</span>
          </div>
          <button
            className={styles.subscribeBtn}
            onClick={handleSubscribeClick}
          >
            구독
          </button>
        </div>
        <div className={styles.rating}>
          ⭐️ {rating.toFixed(1)} / 5.0
        </div>
      </div>

      <div className={styles.thumbnail}>
        <img src={imageUrl} alt={`${tag} 썸네일`} />
      </div>
    </div>
  );
};

export default TagCard;