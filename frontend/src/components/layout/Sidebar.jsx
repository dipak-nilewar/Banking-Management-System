 import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  Wallet,
  Banknote,
  Users,
  ReceiptText,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
    {
      label: "Accounts",
      icon: CreditCard,
      path: "/accounts",
    },
    {
      label: "Transfer",
      icon: ArrowLeftRight,
      path: "/transfer",
    },
    {
      label: "Deposit",
      icon: Wallet,
      path: "/deposit",
    },
    {
      label: "Withdraw",
      icon: Banknote,
      path: "/withdraw",
    },
    {
      label: "Beneficiaries",
      icon: Users,
      path: "/beneficiaries",
    },
    {
      label: "Transactions",
      icon: ReceiptText,
      path: "/transactions",
    },
    {
      label: "Profile",
      icon: UserCircle,
      path: "/profile",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="hidden lg:flex w-64 min-h-screen bg-[#0F3D56] text-white flex-col">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-wide">
          SecureBank
        </h1>

        <p className="text-xs text-blue-200 mt-1">
          Digital Banking
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <p className="text-xs uppercase tracking-wider text-blue-200 px-3 mb-3">
          Main Menu
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? "bg-white/15 text-white shadow-sm"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={20} />

                <span className="text-sm font-medium">
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-4 py-5 border-t border-white/10">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-blue-100 hover:bg-red-500/20 hover:text-white transition"
        >
          <LogOut size={20} />

          <span className="text-sm font-medium">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;