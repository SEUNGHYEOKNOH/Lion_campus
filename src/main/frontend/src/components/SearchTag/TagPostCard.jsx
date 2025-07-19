import React from 'react';
import styles from '../../styles/TagPost/TagPostCard.module.css';
import { useNavigate } from 'react-router-dom';

const TagPostCard = ({ id, userName, title, description, startDate, endDate, imageUrl }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    console.log("📦 게시글 ID 확인:", id); // ✅ 올바른 위치
    navigate(`/posts/${id}`);
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.thumbnail}>
        <img src={imageUrl || '/images/default.jpg'} alt={`${title} 썸네일`} />
      </div>

      <div className={styles.content}>
        <span className={styles.username}>@{userName}</span>
        <span className={styles.title}>{title}</span>
        <span className={styles.description}>{description}</span>
        <div className={styles.row}>
          <span className={styles.day}>행사기간</span>
          <span className={styles.date}>{startDate} ~ {endDate}</span>
        </div>
      </div>
    </div>
  );
};

export default TagPostCard;