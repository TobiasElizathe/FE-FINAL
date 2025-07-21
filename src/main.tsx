import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import './index.css'
import { Layout } from './components/Layout/Layout';
import { Clubes } from './pages/clubes/Clubes';
import { Jugadores } from './pages/jugadores/Jugadores';
import { Fallback } from './components/Fallback/Fallback';
import { ClubCreate } from './pages/clubesCreate/ClubesCreate'; 
import { JugadoresCreate } from './pages/jugadoresCreate/JugadoresCreate'; 
import { JugadorPanel } from './pages/jugadoresPanel/JugadoresPanel';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // ⬅️ Este es el layout que contiene el Navbar
    errorElement: <Fallback />,
    children: [
      {
        index: true, // ⬅️ esto representa "/"
        element: <Clubes />,
      },
      {
        path: "clubes", // ⬅️ esto representa "/clubes"
        element: <Clubes />,
      },
      {
        path: "jugadores", // ⬅️ esto representa "/jugadores"
        element: <Jugadores />,
      },
      {
        path: "clubesCreate", // ⬅️ esto representa "/clubes/crear"
        element: <ClubCreate />,
      },
      {
        path: "jugadoresCreate", // ⬅️ esto representa "/jugadores/crear"
        element: <JugadoresCreate />,
      },
      {
        path: "jugadoresPanel/:id", // ⬅️ esto representa "/jugadores/:id"
        element: <JugadorPanel />,
      }
    ],
  },
]);


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
