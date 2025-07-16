import Login from "../Pages/Login";
import Main from "../Pages/Main";
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
  },
  {
    path: "/signup",
    element: <SignUp />,
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

const AuthenticateRoutes = [{}];

export default { publicRoutes, AuthenticateRoutes };
