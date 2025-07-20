import { Outlet } from "react-router";
import { Navbar } from "../NavBar/Navbar";

export const Layout = () => (
  <div className="layout">
    <Navbar />
    <Outlet />
  </div>
);