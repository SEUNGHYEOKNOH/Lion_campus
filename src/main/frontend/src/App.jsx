// import { useState } from 'react'

import { Route, Routes } from "react-router-dom";
import Main from "./Pages/Main";
import routes from "./router/router";
import "./styles/Global.css";
import 'react-datepicker/dist/react-datepicker.css';


const { publicRoutes, AuthenticateRoutes } = routes;

function App() {
  return (
    
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route key={idx} path={route.path} element={route.element} />
        ))}
        {AuthenticateRoutes.map((route, idx) => {
          <Route key={idx} path={route.path} element={route.element} />;
        })}
      </Routes>
 
  );
}

export default App;