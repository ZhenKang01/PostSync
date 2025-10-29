import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  Sparkles,
  Calendar,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Zap,
  PlusCircle
} from 'lucide-react';

export function Sidebar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Sparkles, label: 'AI Copywriting', path: '/dashboard/copywriting' },
    { icon: Calendar, label: 'Schedule Post', path: '/dashboard/schedule' },
    { icon: BarChart3, label: 'Analytics', path: '/dashboard/analytics' },
    { icon: Users, label: 'Team & Roles', path: '/dashboard/team' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-50">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">FlowPost</h1>
            <p className="text-xs text-gray-500">Design once. Post everywhere.</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <NavLink
          to="/dashboard/create"
          className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Post
        </NavLink>
      </div>

      <nav className="flex-1 px-4 py-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : ''}`} />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
