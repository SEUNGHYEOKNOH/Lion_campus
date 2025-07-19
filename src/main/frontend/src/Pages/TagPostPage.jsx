import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import TagPostGrid from '../components/SearchTag/TagPostGrid';
import Pagination from '../components/Common/Pagination';
import styles from '../styles/TagPost/TagPostTitle.module.css';
import Header from '../components/Layout/Header';
import { fetchPostsByTag } from '../api/post';
import { fetchAllTags } from '../api/tags'; // 🔁 태그 한글명 조회용

const TagPostPage = () => {
  const { tagName } = useParams(); // 영어 태그
  const [displayName, setDisplayName] = useState(tagName); // 한글 이름 표시용
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPostsByTag(tagName); // 영어 태그로 API 호출
        setPosts(data);
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
        setPosts([]);
      }
    };

    const loadDisplayName = async () => {
      try {
        const allTags = await fetchAllTags(); // 모든 태그 불러와서 매핑
        const match = allTags.find(tag => tag.tagName === tagName);
        if (match) setDisplayName(match.koreanName);
      } catch (e) {
        console.warn('태그 이름 매핑 실패:', e);
      }
    };

    loadPosts();
    loadDisplayName();
  }, [tagName]);

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = posts.slice(indexOfFirst, indexOfLast);

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <div className={styles.tagHeader}>
          <h2 className={styles.pageTitle}>#{displayName}</h2>
          <div className={styles.ratingBox}>
            <span className={styles.ratingValue}>
              평균평점 <strong>4.8 / 5.0</strong>
            </span>
            <span className={styles.ratingCount}>7명 참여 평가</span>
          </div>
        </div>

        <TagPostGrid posts={currentPosts}  />

        <Pagination
          totalItems={posts.length}
          itemsPerPage={postsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  );
};

export default TagPostPage;