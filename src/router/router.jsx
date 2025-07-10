import Main from "../Pages/Main";


const publicRoutes = [{
  path: "/",
  element: <Main />,
  layoutType :"none"}];

const AuthenticateRoutes = [{}];

export default { publicRoutes, AuthenticateRoutes };
