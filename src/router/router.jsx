import Login from "../Pages/Login";
import Main from "../Pages/Main";
import TagRankingPage from "../Pages/TagRankingPage";
import TagPostPage from "../Pages/TagPostPage";
import DetailPostPage from "../Pages/DetailPostPage";


const publicRoutes = [{
  path: "/",
  element: <Main />,
  layoutType :"none"},
  {
  path: "/login",
  element: <Login/>,
  layoutType :"none"},
  {
    path: "/tags",                
    element: <TagRankingPage />,   
    layoutType: "none",            
  },
  {
    path:"/tags/:tagName",
    element: <TagPostPage />,
    layoutType: "none",
  },
  {
    path: "/posts/:postId",
    element:<DetailPostPage />,
    layoutType: "none",

  }
];

const AuthenticateRoutes = [{}];

export default { publicRoutes, AuthenticateRoutes };
