import {
  NavLink,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

function Sidebar() {

  const navigate = useNavigate();

  const { logout } = useAuth();

  const handleLogout = () => {

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <aside className="border-b border-gray-200 bg-white/95 px-4 py-4 shadow-sm lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-7">

      <div className="mb-6 flex items-center justify-between lg:mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">
            Workspace
          </p>

          <h1 className="mt-1 text-xl font-bold text-gray-950">
            Team Task Manager
          </h1>
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2">

        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `whitespace-nowrap rounded-lg px-4 py-3 text-sm font-semibold transition lg:block ${
              isActive
                ? "bg-gray-950 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `whitespace-nowrap rounded-lg px-4 py-3 text-sm font-semibold transition lg:block ${
              isActive
                ? "bg-gray-950 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
            }`
          }
        >
          Projects
        </NavLink>

        <button
          onClick={handleLogout}
          className="whitespace-nowrap rounded-lg px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50 lg:mt-8 lg:w-full"
        >
          Logout
        </button>

      </nav>

    </aside>
  );
}

export default Sidebar;
