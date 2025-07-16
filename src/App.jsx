import { Route, Routes } from "react-router-dom";
import routes from "./router/router";
import './styles/Global.css';

const { publicRoutes, AuthenticateRoutes } = routes;

function App() {
  return (
    <Routes>
      {publicRoutes.map((route, idx) => (
        <Route key={idx} path={route.path} element={route.element} />
      ))}
      {AuthenticateRoutes.map((route, idx) => (
        <Route key={idx} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}

export default App;