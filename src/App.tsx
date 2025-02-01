// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import "./App.css";

import {RouterProvider } from "react-router";
// import AuthorizePage from "./pages/AuthorizePage";
import router from "./routes"

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  );
}

export default App;
