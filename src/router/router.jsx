import Login from "../Pages/Login";
import Main from "../Pages/Main";
import SignUp from "../Pages/SignUp";

const publicRoutes = [
  {
    path: "/",
    element: <Main />,
    layoutType: "none",
  },
  {
    path: "/login",
    element: <Login />,
    layoutType: "none",
  },
  {
    path: "/signup",
    element: <SignUp />,
    layoutType: "none",
  },
];

const AuthenticateRoutes = [{}];

export default { publicRoutes, AuthenticateRoutes };
