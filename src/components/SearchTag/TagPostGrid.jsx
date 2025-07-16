// components/SearchTag/TagPostGrid.jsx
import React from 'react';
import TagPostCard from './TagPostCard';
import styles from '../../styles/TagPost/TagPostGrid.module.css';
import { useNavigate } from 'react-router-dom';

const TagPostGrid = ({ posts = [] }) => {
  const navigate = useNavigate();

  if (!Array.isArray(posts)) {
    console.warn("❗posts가 배열이 아닙니다:", posts);
    return <div>게시글이 없습니다.</div>;
  }

  return (
    <div className={styles.grid}>
      {posts.map((post, index) => (
        <TagPostCard
          key={index}
          id={post.id}
          userName={post.writerNickname || '작성자'}
          title={post.title}
          description={post.content}
          startDate={post.startDate}
          endDate={post.endDate}
          imageUrl={post.imageUrl}
          onClick={() => navigate(`/posts/${post.id}`)}
        />
      ))}
    </div>
  );
};

export default TagPostGrid;