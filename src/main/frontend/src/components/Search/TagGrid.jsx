import React from 'react';
import TagCard from './TagCard';
import styles from '../../styles/Search/TagGrid.module.css';
import { useNavigate } from 'react-router-dom';

const TagGrid = ({ tags }) => {
  const navigate = useNavigate();

  const getFirebaseImageUrl = (tagName) => {
    const encoded = encodeURIComponent(`${tagName}.png`);
    return `https://firebasestorage.googleapis.com/v0/b/web-kit-69b0d/o/${encoded}?alt=media`;
  };
  

  return (
    <div className={styles.grid}>
      {tags.map((tagItem, index) => (
        <TagCard
          key={index}
          tag={tagItem.koreanName || tagItem.tag}
          tagEn={tagItem.tagName || tagItem.tagEn}
          rank={tagItem.rank}
          rating={tagItem.rating}
          imageUrl={tagItem.imageUrl || getFirebaseImageUrl(tagItem.tagName ||tagItem.tagEn)}
          onSubscribe={() => console.log(`${tagItem.tagEn || tagItem.tag} 구독 클릭됨`)}
          onClick={() => navigate(`/tags/${tagItem.tagEn}`)} // ✅ 이거 추가
        />
      ))}
    </div>
  );
};

export default TagGrid;