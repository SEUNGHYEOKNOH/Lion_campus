import React from 'react';
import TagCard from './TagCard';
import styles from '../../styles/Search/TagGrid.module.css';
import { useNavigate } from 'react-router-dom';

const TagGrid = ({ tags }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.grid}>
      {tags.map((tagItem, index) => (
        <TagCard
          key={index}
          tag={tagItem.koreanName || tagItem.tag}
          tagEn={tagItem.tagName || tagItem.tagEn}
          rank={tagItem.rank}
          rating={tagItem.rating}
          imageUrl={tagItem.imageUrl}
          onSubscribe={() => console.log(`${tagItem.koreanName || tagItem.tag} 구독 클릭됨`)}
          onClick={() => navigate(`/tags/${tagItem.tagName || tagItem.tagEn}`)} // ✅ 이거 추가
        />
      ))}
    </div>
  );
};

export default TagGrid;