import { Outlet } from "react-router";
import { Navbar } from "../NavBar/Navbar";
import { LogoutButton } from "../logoutButton/LogoutButton";

export const Layout = () => (
  <div className="layout">
    <Navbar />
          <LogoutButton />
    <Outlet />
  </div>
);