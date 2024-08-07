import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Logo from '../images/software logo.png';
import dashboardIcon from '../images/dashboard.png';
import patientIcon from '../images/patient.png';
import reportIcon from '../images/report.png';
function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    if (sidebarExpanded) {
      document.querySelector("body").classList.add("sidebar-expanded");
    } else {
      document.querySelector("body").classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <div>
      <div
        className={`fixed inset-0 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      ></div>

      {/* Sidebar */}
      <div
        id="sidebar"
        ref={sidebar}
        className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-20 lg:sidebar-expanded:!w-64 2xl:!w-64 shrink-0 bg-[#eaeaea] p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex justify-between mb-10 pr-3 sm:px-2">
          {/* Close button */}
          <button
            ref={trigger}
            className="lg:hidden text-slate-500 hover:text-slate-400"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
          {/* Logo */}
          <div className="flex items-center">
            <img className="w-8 h-8 rounded-full" src={Logo} width="32" height="32" alt="Logo" />
            <p className="ml-2 font-semibold text-xl lg:hidden lg:sidebar-expanded:block 2xl:block">Dr.Yin</p>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-8">
          {/* Pages group */}
          <div>
            {/*  */}
            <ul className="mt-3">
              {/* Dashboard */}
              <li className="justify-center items-center border-t border-gray-300 py-1">               
                <NavLink
                  to={"/admin/dashboard"}
                  className={({ isActive }) =>
                    isActive ? "flex text-gray-700 bg-blue-200 rounded-xl" : "flex text-gray-600"
                  }
                >
                  <img className="w-8 h-8 ml-1" src={dashboardIcon} alt="dashboardicon" />
                  <span className="text-sm font-medium ml-3 mt-1 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Dashboard
                  </span>
                </NavLink>
              </li>
              {/* </div> */}
              
              <li className="justify-center items-center border-t border-gray-300 py-1">
                <NavLink
                  to={"/admin/patient"}
                  className={({ isActive }) =>
                    isActive ? "flex text-gray-700 bg-blue-200 rounded-xl" : "flex text-gray-600"
                  }
                >
                  <img className="w-8 h-8" src={patientIcon} alt="dashboardicon" />
                  <span className="text-sm font-medium ml-3 mt-1 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Patient
                  </span>
                </NavLink>
              </li>
              <li className="border-t border-gray-300 py-1">
                <NavLink
                  to={"/admin/report"}
                  className={({ isActive }) =>
                    isActive ? "flex text-gray-700 bg-blue-200 py-1 rounded-xl" : "flex text-gray-600"
                  }
                >
                  <img className="w-8 h-8 ml-2" src={reportIcon}  style={{ height: '25px', width : '20px' }} alt="dashboardicon" />
                  <span className="text-sm font-medium ml-3 mt-1 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                    Report
                  </span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Expand / collapse button */}
        <div className="pt-3 hidden lg:inline-flex 2xl:hidden justify-end mt-auto">
          <div className="px-3 py-2">
            <button onClick={() => setSidebarExpanded(!sidebarExpanded)}>
              {/* <span className="sr-only">Expand / collapse sidebar</span> */}
              <svg
                className="w-6 h-6 fill-current sidebar-expanded:rotate-180"
                viewBox="0 0 24 24"
              >
                <path
                  className="text-slate-400"
                  d="M19.586 11l-5-5L16 4.586 23.414 12 16 19.414 14.586 18l5-5H7v-2z"
                />
                <path className="text-slate-600" d="M3 23H1V1h2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
