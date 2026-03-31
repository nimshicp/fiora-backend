import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Shield
} from "lucide-react";

export default function Sidebar() {
  const navigate=useNavigate()
  const location = useLocation();
  const { user, logout } = useUser();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;


  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  
  const navItems = isAdmin ? [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/dashboard/products",
      label: "Products",
      icon: <Package size={20} />,
    },
    {
      path: "/dashboard/orders",
      label: "Orders",
      icon: <ShoppingBag size={20} />,
    },
    {
      path: "/dashboard/users",
      label: "Users",
      icon: <Users size={20} />,
    },
  ] : [];

  
  const getUserInitials = () => {
    if (!user || !user.Username) return 'U';
    return user.Username.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.Username || 'User';
  };

  const getUserEmail = () => {
    if (!user) return 'admin@gmail.com';
    return user.email || 'user@example.com';
  };

  const getUserRole = () => {
    if (!user) return 'Admin';
    return user.role === 'admin' ? 'Administrator' : 'Customer';
  };

  
  if (!isAdmin) {
    return null;
  }

  return (
    <>
      
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-700 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-300"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

    
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

  
      <div className={`
        bg-white
        border-r border-gray-200
        fixed top-0 left-0 z-50 
        h-screen transition-all duration-300 ease-in-out
        flex flex-col
        ${isOpen ? 'w-64' : 'w-20'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        shadow-xl
      `}>
        
        
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'}`}>
            {isOpen && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">FS</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Fiora Scents</h2>
                  <p className="text-gray-500 text-xs font-medium">Admin Panel</p>
                </div>
              </div>
            )}
            
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hidden lg:flex p-2 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {isOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          </div>
        </div>

        
        {isAdmin && (
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group
                  ${isActive(item.path)
                    ? 'bg-gray-900 text-white shadow-md border border-gray-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
                  }
                  ${!isOpen ? 'justify-center' : ''}
                `}
                title={!isOpen ? item.label : ''}
                onClick={() => setIsMobileOpen(false)}
              >
                <div className={`${isActive(item.path) ? 'text-white' : 'text-gray-500'}`}>
                  {item.icon}
                </div>
                
                {isOpen && (
                  <span className="font-medium text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                )}

              
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
                    {item.label}
                  </div>
                )}
              </Link>
            ))}
          </nav>
        )}

        
        <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
        
          <Link
            to="/"
            className={`
              flex items-center gap-3 p-3 rounded-lg transition-all duration-200
              bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-300
              ${!isOpen ? 'justify-center' : ''}
            `}
            title={!isOpen ? 'Back to Store' : ''}
            onClick={() => setIsMobileOpen(false)}
          >
            <Home size={20} className="text-gray-600" />
            {isOpen && <span className="font-medium text-sm">Back to Store</span>}
          </Link>

          
          <button
            onClick={() => {
              logout();
              navigate("/login")
            }}
            className={`
              flex items-center gap-3 p-3 rounded-lg transition-all duration-200 w-full
              bg-white text-gray-700 hover:bg-gray-100 hover:text-gray-900 border border-gray-300
              ${!isOpen ? 'justify-center' : ''}
            `}
            title={!isOpen ? 'Logout' : ''}
          >
            <LogOut size={20} className="text-gray-600" />
            {isOpen && <span className="font-medium text-sm">Logout</span>}
          </button>

          
          <div className={`
            flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-300 shadow-sm
            ${!isOpen ? 'justify-center' : ''}
          `}>
            <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">
                {getUserInitials()}
              </span>
            </div>
            
            {isOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 font-medium text-sm truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-gray-500 text-xs truncate">
                  {getUserEmail()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Shield size={12} className="text-gray-600" />
                  <span className="text-gray-700 text-xs font-medium">
                    {getUserRole()}
                  </span>
                </div>
              </div>
            )}

            {isOpen && (
              <div className={`w-2 h-2 rounded-full ${
                user?.isBlock ? 'bg-red-400' : 'bg-green-400'
              }`}></div>
            )}
          </div>
        </div>
      </div>


      <div className={`
        transition-all duration-300 ease-in-out
        ${isOpen ? 'lg:ml-64' : 'lg:ml-20'}
      `}></div>
    </>
  );
}