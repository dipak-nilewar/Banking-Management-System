import {
  Bell,
  Search,
  UserCircle,
} from "lucide-react";

function AdminNavbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-30 h-20 border-b border-gray-200 bg-white">

      <div className="flex h-full items-center justify-between px-8">

        {/* Left */}
        <div>
          <h2 className="text-xl font-semibold text-[#17202A]">
            Admin Dashboard
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your banking system
          </p>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">

          {/* Search */}
          <div className="hidden items-center rounded-xl bg-gray-50 px-3 py-2 md:flex">
            <Search
              size={18}
              className="text-gray-400"
            />

            <input
              type="text"
              placeholder="Search..."
              className="ml-2 w-48 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Notification */}
          <button
            className="relative rounded-xl p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-[#0F3D56]"
            title="Notifications"
          >
            <Bell size={20} />

            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200" />

          {/* Admin Profile */}
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0F3D56] text-white">
              <UserCircle size={25} />
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-[#17202A]">
                Administrator
              </p>

              <p className="text-xs text-gray-500">
                ADMIN
              </p>
            </div>

          </div>

        </div>
      </div>

    </header>
  );
}

export default AdminNavbar;