import {
  Bell,
  ChevronDown,
  UserCircle,
} from "lucide-react";

function Navbar() {
  const userName = "Dipak";

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8">
      
      {/* Left */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800">
          Banking Dashboard
        </h2>

        <p className="text-sm text-gray-500">
          Manage your finances securely
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center gap-5">
        
        {/* Notification */}
        <button
          className="relative p-2 text-gray-500 hover:text-[#0F3D56] hover:bg-gray-100 rounded-lg transition"
          aria-label="Notifications"
        >
          <Bell size={21} />

          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-800">
              {userName}
            </p>

            <p className="text-xs text-gray-500">
              Customer
            </p>
          </div>

          <UserCircle
            size={38}
            className="text-[#0F3D56]"
          />

          <ChevronDown
            size={18}
            className="text-gray-500"
          />
        </div>
      </div>
    </header>
  );
}

export default Navbar;