import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Layout/Header';
import PostHeader from '../components/SearchPost/PostHeader';
import styles from '../styles/SearchPost/PostDetailPage.module.css';
import { fetchPostDetail } from '../api/post';

const DetailPostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const loadPost = async () => {
      const data = await fetchPostDetail(postId);
      setPost(data);
    };
    loadPost();
  }, [postId]);

  if (!post) return <div>로딩 중...</div>;

  return (
    <div style={{backgroundColor: '#F5F7F9'}}>
      <Header/>
      <div className={styles.container}>
        <PostHeader post={post} content={post.content} imageUrl={post.imageUrl}/>
        <button className={styles.backBtn} onClick={() => window.history.back()}>이전으로</button>
      </div>
    </div>
  );
};

export default DetailPostPage;