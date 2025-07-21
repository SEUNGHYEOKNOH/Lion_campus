// components/Layout/Header.jsx
import logo from "../../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { isLoggedIn, clearTokens } from "../../utils/auth";
import { searchAPI } from "../../api/search";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const Header = () => {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  
  // 검색 관련 상태
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // 컴포넌트 마운트 시 로그인 상태 확인
  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  // 검색창 외부 클릭 시 결과 숨기기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 검색 실행
  const handleSearch = async (keyword) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      console.log('검색 시작:', keyword);
      const response = await searchAPI.search(keyword);
      console.log('검색 응답:', response);
      
      // API 응답 구조에 따라 데이터 추출
      const results = response?.data || response || [];
      console.log('검색 결과:', results);
      
      setSearchResults(Array.isArray(results) ? results : []);
      setShowResults(true);
    } catch (error) {
      console.error('검색 오류:', error);
      console.error('에러 상세:', error.response || error.message);
      
      // 네트워크 오류나 서버 오류 시 빈 결과 표시
      setSearchResults([]);
      setShowResults(true); // 오류 메시지를 보여주기 위해 true 유지
    } finally {
      setIsSearching(false);
    }
  };

  // 검색어 변경 처리 (실시간 검색)
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchKeyword(value);
    
    // 디바운싱을 위한 setTimeout
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      clearTimeout(window.searchTimeout);
      handleSearch(searchKeyword);
    }
  };

  // 검색 버튼 클릭
  const handleSearchClick = () => {
    clearTimeout(window.searchTimeout);
    handleSearch(searchKeyword);
  };

  // 검색어 초기화
  const handleClearSearch = () => {
    setSearchKeyword("");
    setSearchResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  // 검색 결과 클릭 처리
  const handleResultClick = (result) => {
    setShowResults(false);
    if (result.type === 'tag') {
      navigate(`/tags/${result.tagName}`);
    } else if (result.type === 'post') {
      navigate(`/posts/${result.id}`);
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    clearTokens();
    localStorage.removeItem("userInfo"); // 🔥 userInfo도 제거
    setLoggedIn(false);
    navigate("/");
    alert("로그아웃되었습니다.");
  };

  return (
    <Head>
      {/* <div onClick={handleLogout}>테스트용 로그인 버튼</div> */}
      <LogoWrapper>
        <Link to="/">
          <img src={logo} alt="로고" />
        </Link>
      </LogoWrapper>

      <SearchWrapper ref={searchRef}>
        <SearchContainer>
          <Input 
            ref={inputRef}
            type="text" 
            placeholder="해시태그나 게시글을 검색하세요" 
            value={searchKeyword}
            onChange={handleSearchChange}
            onKeyPress={handleKeyPress}
            onFocus={() => searchKeyword && setShowResults(true)}
          />
          {searchKeyword && (
            <ClearButton onClick={handleClearSearch}>
              <X size={16} />
            </ClearButton>
          )}
          <SearchButton onClick={handleSearchClick} disabled={isSearching}>
            <Search />
          </SearchButton>
        </SearchContainer>
        
        {showResults && (
          <SearchResults>
            {isSearching ? (
              <SearchItem>
                <div>검색 중...</div>
              </SearchItem>
            ) : searchResults.length > 0 ? (
              searchResults.map((result, index) => (
                <SearchItem key={index} onClick={() => handleResultClick(result)}>
                  <SearchItemImage>
                    {result.imageUrl ? (
                      <img src={result.imageUrl} alt={result.title} />
                    ) : (
                      <div className="no-image">
                        {result.type === 'tag' ? '#' : '📄'}
                      </div>
                    )}
                  </SearchItemImage>
                  <SearchItemContent>
                    <SearchItemTitle>
                      {result.type === 'tag' && '#'}{result.title}
                    </SearchItemTitle>
                    <SearchItemDesc>
                      {result.description}
                      {result.type === 'tag' && result.postCount && (
                        <span> • {result.postCount}개 게시글</span>
                      )}
                    </SearchItemDesc>
                  </SearchItemContent>
                </SearchItem>
              ))
            ) : (
              <SearchItem>
                <div>검색 결과가 없습니다.</div>
              </SearchItem>
            )}
          </SearchResults>
        )}
      </SearchWrapper>

      {loggedIn ? (
        <Btns>
          <Link to="/mypage">
            <div>마이페이지</div>
          </Link>
          <div onClick={handleLogout} style={{ cursor: "pointer" }}>
            <div>로그아웃</div>
          </div>
        </Btns>
      ) : (
        <Btns>
          <Link to="/login">
            <div>로그인</div>
          </Link>
          <Link to="/signup">
            <div>회원가입</div>
          </Link>
        </Btns>
      )}
    </Head>
  );
};

export default Header;

// styled-components
const Head = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  // padding: 12px 24px;
  max-width: 80vw;
  margin: 0 auto;
  height: 10vh;
  position: relative;
`;

const LogoWrapper = styled.div`
  flex-shrink: 0;
  img {
    height: 4rem;
  }
  margin-left: 2vw;
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 30vw;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 2rem;
  border: 1px solid #ccc;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 12px;
  background-color: #fff;
  position: relative;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding-left: 8px;
  background: transparent;
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #999;
  display: flex;
  align-items: center;
  padding: 2px;
  
  &:hover {
    color: #666;
  }
`;

const SearchButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-size: 18px;
  display: flex;
  align-items: center;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 4px;
`;

const SearchItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const SearchItemImage = styled.div`
  width: 40px;
  height: 40px;
  margin-right: 12px;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .no-image {
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    font-size: 18px;
    color: #999;
  }
`;

const SearchItemContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SearchItemTitle = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SearchItemDesc = styled.div`
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Btns = styled.div`
  display: flex;
  gap: 20px;
  min-width: 10rem;
`;
