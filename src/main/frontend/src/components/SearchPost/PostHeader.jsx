// components/SearchPost/PostHeader.jsx
import React from 'react';
import styles from '../../styles/SearchPost/PostHeader.module.css';
import dumiimg from '../../assets/img-28.png'; // 임시 이미지
const PostHeader = ({ post,imageUrl, content}) => {
  return (
    <div className={styles.header}>
      <div className={styles.meta}>
        <div><strong>| 참여 행사:</strong></div> <div>{post.eventName} {post.title}</div>
        <div><strong>| 행사 기간:</strong></div> <div>{post.startDate} ~ {post.endDate}</div>
        <div><strong>| 평점:</strong></div> <div>{post.rating} / 5.0</div>
        <div><strong>| 해시태그:</strong></div> <div>#{post.tag}</div>
        </div>

        <div className={styles.imgSection}>
            <img src={imageUrl || dumiimg} alt="포스트 이미지" className={styles.image} />
        </div>


      <div className={styles.titleSection}>
        <h2 className={styles.title}>{post.title}</h2>
        <div className={styles.writerInfo}>
          글 작성자 <strong>@{post.writerNickname}</strong>
        </div>
      </div>
      <div className={styles.content}>
                {content.split('\n').map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </div>
    </div>
  );
};

export default PostHeader;