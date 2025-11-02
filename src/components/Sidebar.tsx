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
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#1F2937] border-r border-[#374151] flex flex-col z-50">
      <div className="p-6 border-b border-[#374151]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#3B82F6] to-[#8B5CF6] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">FlowPost</h1>
            <p className="text-xs text-[#9CA3AF]">Design once. Post everywhere.</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <NavLink
          to="/dashboard/create"
          className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:scale-105 text-white rounded-xl font-medium transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
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
                `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all duration-200 ${
                  isActive
                    ? 'bg-[#3B82F6]/20 text-[#3B82F6] font-medium shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                    : 'text-[#D1D5DB] hover:bg-[#374151] hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-[#3B82F6]' : ''}`} />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#374151]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-[#D1D5DB] hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
