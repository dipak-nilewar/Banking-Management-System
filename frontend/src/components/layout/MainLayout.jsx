import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#F6F8FB] flex">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex-1 min-w-0">
        
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}

export default MainLayout;