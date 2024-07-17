import { useState } from 'react';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import { Outlet } from "react-router-dom";

function Main() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <div className="px-0 md:px-0 lg:px-0 xl:px-2 py-0 md:py-2 lg:py-2 w-full max-w-9xl mx-auto">
            <div className="flex">
                 <Outlet/>        
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Main;