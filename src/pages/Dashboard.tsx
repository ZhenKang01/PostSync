import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { TrendingUp, Calendar, Sparkles, Users, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    scheduledPosts: 0,
    totalPosts: 0,
    draftPosts: 0,
  });

  useEffect(() => {
    if (user) {
      loadProfile();
      loadStats();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();
    setProfile(data);
  };

  const loadStats = async () => {
    if (!user) return;
    const { data: posts } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', user.id);

    if (posts) {
      setStats({
        totalPosts: posts.length,
        scheduledPosts: posts.filter(p => p.status === 'scheduled').length,
        draftPosts: posts.filter(p => p.status === 'draft').length,
      });
    }
  };

  const firstName = profile?.full_name?.split(' ')[0] || 'there';

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {firstName}!
        </h1>
        <p className="text-gray-600">Here's what's happening with your social media today</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600">Active</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.scheduledPosts}</h3>
          <p className="text-sm text-gray-600">Scheduled Posts</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-green-600">Total</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalPosts}</h3>
          <p className="text-sm text-gray-600">Total Posts</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-purple-600">AI Ready</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.draftPosts}</h3>
          <p className="text-sm text-gray-600">Draft Posts</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm font-medium text-orange-600">Connected</span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">4</h3>
          <p className="text-sm text-gray-600">Platforms</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/dashboard/create')}
              className="group p-6 border-2 border-gray-200 hover:border-blue-500 rounded-xl transition-all hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Create New Post</h3>
              <p className="text-sm text-gray-600">Design and schedule content</p>
            </button>

            <button
              onClick={() => navigate('/dashboard/copywriting')}
              className="group p-6 border-2 border-gray-200 hover:border-purple-500 rounded-xl transition-all hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">AI Copywriting</h3>
              <p className="text-sm text-gray-600">Optimize your captions</p>
            </button>

            <button
              onClick={() => navigate('/dashboard/analytics')}
              className="group p-6 border-2 border-gray-200 hover:border-green-500 rounded-xl transition-all hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">View Analytics</h3>
              <p className="text-sm text-gray-600">Track your performance</p>
            </button>

            <button
              onClick={() => navigate('/dashboard/team')}
              className="group p-6 border-2 border-gray-200 hover:border-orange-500 rounded-xl transition-all hover:shadow-lg"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Manage Team</h3>
              <p className="text-sm text-gray-600">Collaborate with members</p>
            </button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-sm border border-blue-700 p-6 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold mb-2">AI Assistant</h2>
          <p className="text-blue-100 mb-6 text-sm leading-relaxed">
            Get instant feedback on your captions, tone analysis, and CTA suggestions powered by AI.
          </p>
          <button
            onClick={() => navigate('/dashboard/copywriting')}
            className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Try AI Assistant
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Schedule</h2>
            <button
              onClick={() => navigate('/dashboard/schedule')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View all
            </button>
          </div>

          {stats.scheduledPosts === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No scheduled posts yet</p>
              <button
                onClick={() => navigate('/dashboard/create')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Create your first post
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">Your scheduled posts will appear here</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Platform Performance</h2>
            <button
              onClick={() => navigate('/dashboard/analytics')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View details
            </button>
          </div>

          <div className="space-y-4">
            {[
              { name: 'X', icon: '/image.png', bg: 'bg-black' },
              { name: 'LinkedIn', icon: '/linkedin-logo.svg', bg: 'bg-white border border-gray-200' },
              { name: 'Facebook', icon: '/facebook-logo.svg', bg: 'bg-white border border-gray-200' },
              { name: 'Instagram', icon: '/instagram-logo.png', bg: 'bg-white border border-gray-200' },
            ].map((platform) => (
              <div key={platform.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden ${platform.bg}`}>
                    <img src={platform.icon} alt={platform.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="font-medium text-gray-900">{platform.name}</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">-</p>
                  <p className="text-xs text-gray-500">No data yet</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
