import Login from "../Pages/Login";
import Main from "../Pages/Main";


const publicRoutes = [{
  path: "/",
  element: <Main />,
  layoutType :"none"},
  {
  path: "/login",
  element: <Login/>,
  layoutType :"none"}
];

const AuthenticateRoutes = [{}];

export default { publicRoutes, AuthenticateRoutes };
