import { useEffect, useState } from "react";

import API from "../services/api";

import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../layouts/DashboardLayout";

function Dashboard() {

  const { user } = useAuth();

  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  // fetch dashboard stats
  useEffect(() => {

    const fetchStats = async () => {

      try {

        const response = await API.get(
          "/dashboard/stats"
        );

        setStats(response.data);

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

    fetchStats();

  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-lg border border-gray-200 bg-white px-6 py-4 text-sm font-medium text-gray-600 shadow-sm">
          Loading dashboard...
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Tasks",
      value: stats?.totalTasks ?? 0,
      accent: "border-blue-200 bg-blue-50 text-blue-700",
    },
    {
      label: "To Do",
      value: stats?.tasksByStatus?.todo ?? 0,
      accent: "border-gray-200 bg-gray-50 text-gray-700",
    },
    {
      label: "In Progress",
      value: stats?.tasksByStatus?.inProgress ?? 0,
      accent: "border-amber-200 bg-amber-50 text-amber-700",
    },
    {
      label: "Completed",
      value: stats?.tasksByStatus?.completed ?? 0,
      accent: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
  ];

  return (
    <DashboardLayout>
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

      {/* top section */}

      <div className="mb-8 flex flex-col justify-between gap-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-end">

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            Overview
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-950">
            Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Welcome back, {user?.name}. Track work distribution, task progress, and overdue delivery risks from one place.
          </p>

        </div>

        <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-xs font-medium  tracking-wide text-gray-500">
            Welcome back,
          </p>

          <p className="mt-1 font-semibold text-gray-950">
            {user?.name}
          </p>
        </div>

      </div>

      {/* stats cards */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">

        {statCards.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${item.accent}`}>
              {item.label}
            </div>

            <p className="mt-5 text-4xl font-bold tracking-tight text-gray-950">
              {item.value}
            </p>
          </div>
        ))}

      </div>

      {/* second section */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

        {/* overdue tasks */}

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-950">
            Overdue Tasks
          </h2>

          <p className="mt-2 text-sm text-gray-600">
            Tasks past their due date and still requiring attention.
          </p>

          <p className="mt-8 text-6xl font-bold tracking-tight text-red-600">
            {stats?.overdueTasks}
          </p>

        </div>

        {/* tasks per user */}

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-gray-950">
            Tasks Per User
          </h2>

          <div className="mt-5 space-y-3">

            {
              stats?.tasksPerUser?.length ? stats.tasksPerUser.map((item) => (

                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3"
                >

                  <span className="font-medium text-gray-800">{item.name}</span>

                  <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-gray-950 shadow-sm">
                    {item.count}
                  </span>

                </div>
              )) : (
                <p className="rounded-lg border border-dashed border-gray-200 bg-gray-50 p-4 text-sm text-gray-500">
                  No task assignment data yet.
                </p>
              )
            }

          </div>

        </div>

      </div>

    </div>
    </DashboardLayout>
  );
}

export default Dashboard;
