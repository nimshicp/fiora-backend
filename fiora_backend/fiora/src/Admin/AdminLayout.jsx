import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function AdminLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-gray-100 p-4 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
