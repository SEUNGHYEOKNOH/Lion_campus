import Login from "../Pages/Login";
import Main from "../Pages/Main";
import TagRankingPage from "../Pages/TagRankingPage";
import TagPostPage from "../Pages/TagPostPage";
import DetailPostPage from "../Pages/DetailPostPage";
import SignUp from "../Pages/SignUp";
import Milestone from "../Pages/Milestone";
import MyPage from "../Pages/MyPage";
import Write from "../Pages/Write";


const publicRoutes = [
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/login",
    element: <Login />,
    layoutType: "none",
  },
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/tags",
    element: <TagRankingPage />,
    layoutType: "none",
  },
  {
    path: "/tags/:tagName",
    element: <TagPostPage />,
    layoutType: "none",
  },
  {
    path: "/posts/:postId",
    element: <DetailPostPage />,
    layoutType: "none",
  },
  {
    path: "/milestone",
    element: <Milestone />,
  },
  {
    path: "/mypage",
    element: <MyPage />,
  },
  {
    path: "/write",
    element: <Write />,
  },
];

const AuthenticateRoutes = [];

export default { publicRoutes, AuthenticateRoutes };
