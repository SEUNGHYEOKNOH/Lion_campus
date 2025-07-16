// MyPage.jsx
import Sidebar from '../components/Sidebar';

const MyPage = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', padding: '32px', flex: 1 }}>
        {/* 여기에 페이지 내용 */}
        <h1>내 활동기록</h1>
      </div>
    </div>
  );
};

export default MyPage;
