import React, { useEffect, useState } from 'react';
import SortToggle from '../components/Search/SortToggle';
import TagGrid from '../components/Search/TagGrid';
import Pagination from '../components/Common/Pagination';
import Header from '../components/Layout/Header';
import { fetchAllTags, fetchUserTags } from '../api/tags';

export default function TagRankingPage() {
  const [tags, setTags] = useState([]);
  const [sortType, setSortType] = useState('popular');
  const [isCustom, setIsCustom] = useState(false);
  const userId = localStorage.getItem("userId");

  const loadAllTags = async () => {
    const tagData = await fetchAllTags();
    const enriched = tagData.map((tag, index) => ({
      tag: tag.koreanName || tag.tagName || tag,
      tagEn: tag.tagName || tag,
      rank: index + 1,
      rating: Math.random() * 2 + 3,
      imageUrl: tag.imageUrl
    }));
    setTags(enriched);
  };

   // 🔧 Firebase 이미지 URL 생성 함수

  const handleCustomClick = async () => {
    const tagData = await fetchUserTags(1);
    console.log("✅ 사용자 태그 응답:", tagData);
  
    if (!Array.isArray(tagData)) {
      console.error("❌ 사용자 태그 응답이 배열이 아닙니다:", tagData);
      return;
    }
  
    const enriched = tagData.map((tag, index) => ({
      tag: tag.koreanName,          // 사용자에게 보여줄 이름
      tagEn: tag.tagName,           // API 전송/라우팅용
      rank: index + 1,
      rating: Math.random() * 2 + 3,
    }));
    setTags(enriched);
    setIsCustom(true);
  };
  useEffect(() => {
    if (sortType === 'popular') {
      loadAllTags();
      console.log(userId);
      setIsCustom(false); // 맞춤형 상태 해제
    }
  }, [sortType]);

  const sortedTags = [...tags].sort((a, b) => {
    return sortType === 'popular' ? a.rank - b.rank : b.rating - a.rating;
  });

  return (
    <>
      <Header />
      <div style={{ padding: '40px 20px', maxWidth: '1024px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontWeight: 'bold' }}>해시태그 검색결과를 보여드려요</h2>
          <SortToggle
            sortType={sortType}
            onChange={setSortType}
            isLoggedIn={!userId}
            onCustomClick={handleCustomClick}
          />
        </div>
        <TagGrid tags={sortedTags} />
        <Pagination />
      </div>
    </>
  );
}