import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import './index.css'
import { Layout } from './components/Layout/Layout';
import { Clubes } from './pages/clubes/Clubes';
import { Jugadores } from './pages/jugadores/Jugadores';
import { Fallback } from './components/Fallback/Fallback';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Clubes />,
    errorElement: <Fallback />,
  },
  {
    path: "/clubes",
    element: <Layout />,
  },
  {
    path: "/jugadores",
    element: <Jugadores />,
    errorElement: <Fallback />,
  }
  


]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
