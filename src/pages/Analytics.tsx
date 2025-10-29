import { BarChart3, TrendingUp, Users, Eye, Heart, Share2, ArrowUp, ArrowDown } from 'lucide-react';

export function Analytics() {
  const platforms = [
    { name: 'X', engagement: 245, reach: 12500, color: 'from-gray-800 to-black', trend: 12 },
    { name: 'LinkedIn', engagement: 189, reach: 8900, color: 'from-blue-600 to-blue-700', trend: 8 },
    { name: 'Facebook', engagement: 312, reach: 15200, color: 'from-blue-500 to-blue-600', trend: -3 },
    { name: 'Instagram', engagement: 428, reach: 18700, color: 'from-pink-500 to-purple-600', trend: 15 },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600">Track your social media performance</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <ArrowUp className="w-4 h-4" />
              12%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">55.3K</h3>
          <p className="text-sm text-gray-600">Total Reach</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-600" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <ArrowUp className="w-4 h-4" />
              8%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">1,174</h3>
          <p className="text-sm text-gray-600">Total Engagement</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Share2 className="w-5 h-5 text-green-600" />
            </div>
            <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
              <ArrowUp className="w-4 h-4" />
              24%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">287</h3>
          <p className="text-sm text-gray-600">Total Shares</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <span className="flex items-center gap-1 text-red-600 text-sm font-medium">
              <ArrowDown className="w-4 h-4" />
              2%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">4.2%</h3>
          <p className="text-sm text-gray-600">Engagement Rate</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Platform Performance</h2>
          <div className="space-y-6">
            {platforms.map((platform) => (
              <div key={platform.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">{platform.name}</span>
                  <span className={`flex items-center gap-1 text-sm font-medium ${
                    platform.trend > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {platform.trend > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {Math.abs(platform.trend)}%
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${platform.color}`}
                        style={{ width: `${(platform.engagement / 500) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 min-w-[60px] text-right">
                    {platform.engagement}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Best Performing Posts</h2>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1">Product Launch Post</p>
                <p className="text-xs text-gray-600 mb-2">Posted 2 days ago</p>
                <div className="flex gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> 142
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3 h-3" /> 28
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> 2.4K
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg"></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1">Feature Announcement</p>
                <p className="text-xs text-gray-600 mb-2">Posted 5 days ago</p>
                <div className="flex gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> 98
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3 h-3" /> 15
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> 1.8K
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg"></div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 mb-1">Customer Success Story</p>
                <p className="text-xs text-gray-600 mb-2">Posted 1 week ago</p>
                <div className="flex gap-4 text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <Heart className="w-3 h-3" /> 87
                  </span>
                  <span className="flex items-center gap-1">
                    <Share2 className="w-3 h-3" /> 12
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> 1.5K
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl border border-blue-200 p-8 text-center">
        <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">Keep Growing!</h3>
        <p className="text-gray-600 mb-6">Your engagement is up 12% this week. Keep posting consistently for better results.</p>
      </div>
    </div>
  );
}
