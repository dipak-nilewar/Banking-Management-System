import { Outlet } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Area */}
      <div className="ml-64 min-h-screen">

        {/* Navbar */}
        <AdminNavbar />

        {/* Page Content */}
        <main className="pt-20">
          <div className="p-6 lg:p-8">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}

export default AdminLayout;