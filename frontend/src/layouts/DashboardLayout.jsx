import Sidebar from "../components/Sidebar";

function DashboardLayout({ children }) {

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-gray-950 lg:flex">

      {/* sidebar */}

      <Sidebar />

      {/* main content */}

      <main className="min-h-screen flex-1 lg:pl-72">

        {children}

      </main>

    </div>
  );
}

export default DashboardLayout;
