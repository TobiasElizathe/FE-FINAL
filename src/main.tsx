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
import { ClubPanel } from './pages/clubesPanel/ClubesPanel'; // Asegúrate de importar el panel de clubes
import { AuthProvider } from './contexts/authContext';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/register/Register';

import PrivateRoute from './components/privateRoute/PrivateRoute';

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />, 
  },
  {
    path: "/register",
    element: <Register />, 
  },
  // Ruta principal protegida por autenticación con PrivateRoute
  {
    path: "/",
    element: <PrivateRoute component={Layout} />, // Layout que requiere autenticación
    errorElement: <Fallback />,
    children: [
      {
        index: true,
        element: <Clubes />,
      },
      {
        path: "clubes",
        element: <Clubes />,
      },
      {
        path: "jugadores",
        element: <Jugadores />,
      },
      {
        path: "clubesCreate",
        element: <ClubCreate />,
      },
      {
        path: "jugadoresCreate",
        element: <JugadoresCreate />,
      },
      {
        path: "jugadoresPanel/:id",
        element: <JugadorPanel />,
      },
      {
        path: "clubesPanel/:id",
        element: <ClubPanel />,
      },
    ],
  },
]);
// Renderizado de la app con provider de autenticación y router
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
