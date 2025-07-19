import Sidebar from "../components/Layout/Sidebar";
import styled from "styled-components";
import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { userAPI } from "../utils/api";
import { isLoggedIn } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const Milestone = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState("milestone");
  const [userInfo, setUserInfo] = useState({
    name: '',
    school: '',
    major: '',
    career: ''
  });
  const [loading, setLoading] = useState(true);

  // 로그인 확인 및 사용자 정보 조회
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }

    fetchUserInfo();
  }, [navigate]);

  // 사용자 정보 조회
  const fetchUserInfo = async () => {
    try {
      setLoading(true);
      const userData = await userAPI.getCurrentUser();
      setUserInfo({
        name: userData.name || '',
        school: userData.school || '',
        major: userData.major || '',
        career: userData.career || ''
      });
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      if (error.message.includes('인증')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const posts = [
    {
      id: 1,
      title: "YBM 토익시험 3회차 후기",
      date: "2024.12.21",
      isPublic: true,
    },
    {
      id: 2,
      title: "웹 디자이너 취업 전략 정석 후기",
      date: "2025.03.25",
      isPublic: true,
    },
    {
      id: 3,
      title: "웹 디자인 해보니 쉽지 않아 + 팀이 잘 굴러가는 법",
      date: "2025.07.11",
      isPublic: true,
    },
  ];

  const drafts = [
    {
      id: 4,
      title: "2학년 1학기 학점 피드백",
      date: "2025.07.17",
      isPublic: false,
    },
  ];

  const data = activeTab === "all" ? posts : drafts;

  if (loading) {
    return (
      <MilestoneContainer>
        <Sidebar selected={selected} onSelect={setSelected} />
        <ContentWrapper>
          <LoadingWrapper>로딩 중...</LoadingWrapper>
        </ContentWrapper>
      </MilestoneContainer>
    );
  }

  return (
    <MilestoneContainer>
      <Sidebar selected={selected} onSelect={setSelected} />

      {selected == "milestone" ? (
        <ContentWrapper>
          <TopSection>
            <GoalCard>
              <h3>{userInfo.name ? `${userInfo.name}님의 목표` : '사용자님의 목표'} 🔥</h3>
              <ul>
                <li>🎓 학력: {userInfo.school ? `${userInfo.school} 재학 중` : '학교 정보를 입력해주세요'}</li>
                <li>📘 전공: {userInfo.major || '전공 정보를 입력해주세요'}</li>
                <li>💼 진로: {userInfo.career || '희망진로를 입력해주세요'}</li>
              </ul>
              {(!userInfo.school || !userInfo.major || !userInfo.career) && (
                <ProfileCompleteNotice>
                  📝 프로필을 완성하여 더 나은 서비스를 받아보세요!{' '}
                  <ProfileLink onClick={() => navigate('/mypage')}>
                    마이페이지에서 설정하기
                  </ProfileLink>
                </ProfileCompleteNotice>
              )}
            </GoalCard>

            <CalendarWrapper>
              <Calendar onChange={setDate} value={date} />
            </CalendarWrapper>
          </TopSection>
          <TimelineSection>
            <h3>🧭 활동 마일스톤</h3>
            <Swiper slidesPerView={3} spaceBetween={20}>
              {posts.map((post) => (
                <SwiperSlide key={post.id}>
                  <MilestoneCard>
                    <p>{post.date}</p>
                    <h4>{post.title}</h4>
                  </MilestoneCard>
                </SwiperSlide>
              ))}
            </Swiper>
          </TimelineSection>
        </ContentWrapper>
      ) : (
        <ContentWrapper>
          {" "}
          <SectionHeader>
            <Title>📝 글 관리</Title>
          </SectionHeader>
          <Tabs>
            <TabButton
              $active={activeTab === "all"}
              onClick={() => setActiveTab("all")}
            >
              전체 글 ({posts.length})
            </TabButton>
            <TabButton
              $active={activeTab === "draft"}
              onClick={() => setActiveTab("draft")}
            >
              임시저장 글 ({drafts.length})
            </TabButton>
          </Tabs>
          <TableWrapper>
            <StyledTable>
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" />
                  </th>
                  <th>공개여부</th>
                  <th>제목</th>
                  <th>등록일</th>
                  <th>편집</th>
                </tr>
              </thead>
              <tbody>
                {data.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>
                      <Tag $public={post.isPublic}>
                        {post.isPublic ? "공개" : "비공개"}
                      </Tag>
                    </td>
                    <td>{post.title}</td>
                    <td>{post.date}</td>
                    <td>
                      <EditButton>수정</EditButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
            <DeleteButton disabled>선택 삭제</DeleteButton>
          </TableWrapper>
        </ContentWrapper>
      )}
    </MilestoneContainer>
  );
};

export default Milestone;

const MilestoneContainer = styled.div`
  display: flex;
`;

const ContentWrapper = styled.div`
  width: 75%;
  padding: 2rem;
`;

const TopSection = styled.div`
  display: flex;
  width: 95%;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
`;

const GoalCard = styled.div`
  flex: 1;
  background: #f9f9f9;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  ul {
    margin-top: 12px;
    padding-left: 20px;
    line-height: 1.8;
  }
`;

const ProfileCompleteNotice = styled.div`
  margin-top: 16px;
  padding: 12px;
  background-color: #e3f2fd;
  border-radius: 8px;
  font-size: 14px;
  color: #1976d2;
  border-left: 4px solid #2196f3;
`;

const ProfileLink = styled.span`
  color: #1976d2;
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #0d47a1;
  }
`;

const CalendarWrapper = styled.div`
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-top: 8px;
`;

const Tabs = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
`;

const TabButton = styled.button`
  padding: 8px 16px;
  background-color: ${(props) => (props.$active ? "#102e4a" : "#eee")};
  color: ${(props) => (props.$active ? "#fff" : "#333")};
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
`;

const TableWrapper = styled.div`
  overflow-x: auto;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;

  th,
  td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f0f0f0;
    font-weight: bold;
  }

  tr:hover {
    background-color: #f9f9f9;
  }
`;

const Tag = styled.span`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  background-color: ${(props) => (props.$public ? "#d9f5d3" : "#eee")};
  color: ${(props) => (props.$public ? "#137a0b" : "#888")};
  font-size: 13px;
`;

const EditButton = styled.button`
  background: none;
  color: #102e4a;
  border: none;
  cursor: pointer;
  font-weight: bold;
  text-decoration: underline;
`;

const DeleteButton = styled.button`
  background-color: #ccc;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: not-allowed;
`;

const TimelineSection = styled.div`
  margin-top: 40px;

  h3 {
    margin-bottom: 16px;
  }
`;

const MilestoneCard = styled.div`
  background-color: #f4f4f4;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

  h4 {
    font-size: 16px;
    margin-top: 8px;
  }

  p {
    font-size: 14px;
    color: #666;
  }
`;

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  font-size: 18px;
  color: #666;
`;
