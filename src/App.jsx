// import { useState } from 'react'

import { Route, Routes } from "react-router-dom";
import Main from "./Pages/Main";
import routes from "./router/router";
import "./styles/Global.css";
import { RecoilRoot } from "recoil";

const { publicRoutes, AuthenticateRoutes } = routes;

function App() {
  return (
    <RecoilRoot>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route key={idx} path={route.path} element={route.element} />
        ))}
        {AuthenticateRoutes.map((route, idx) => {
          <Route key={idx} path={route.path} element={route.element} />;
        })}
      </Routes>
    </RecoilRoot>
  );
}

export default App;