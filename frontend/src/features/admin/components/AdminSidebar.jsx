import {
  LayoutDashboard,
  Users,
  CreditCard,
  ShieldCheck,
  ArrowLeftRight,
  UserCog,
  FileText,
  LogOut,
  Landmark,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function AdminSidebar() {
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: Users,
    },
    {
      name: "Accounts",
      path: "/admin/accounts",
      icon: CreditCard,
    },
    {
      name: "KYC Management",
      path: "/admin/kyc",
      icon: ShieldCheck,
    },
    {
      name: "Transactions",
      path: "/admin/transactions",
      icon: ArrowLeftRight,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: UserCog,
    },
    {
      name: "Audit Logs",
      path: "/admin/audit-logs",
      icon: FileText,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#0F3D56] text-white shadow-xl">

      {/* Logo */}
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          <Landmark size={22} />
        </div>

        <div>
          <h1 className="text-lg font-bold tracking-wide">
            SecureBank
          </h1>

          <p className="text-xs text-white/60">
            Admin Portal
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-6 px-4">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
          Main Menu
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-[#0F3D56] shadow-sm"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 w-full border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/75 transition hover:bg-red-500/20 hover:text-white"
        >
          <LogOut size={19} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}

export default AdminSidebar;