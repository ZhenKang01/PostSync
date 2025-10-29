import { Users, UserPlus, Crown, Edit, Shield } from 'lucide-react';

export function Team() {
  const teamMembers = [
    { name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Admin', avatar: 'SJ', color: 'from-blue-500 to-blue-600' },
    { name: 'Michael Chen', email: 'michael@company.com', role: 'Editor', avatar: 'MC', color: 'from-green-500 to-green-600' },
    { name: 'Emily Rodriguez', email: 'emily@company.com', role: 'Editor', avatar: 'ER', color: 'from-purple-500 to-purple-600' },
    { name: 'David Kim', email: 'david@company.com', role: 'Viewer', avatar: 'DK', color: 'from-orange-500 to-orange-600' },
  ];

  const roleInfo = [
    {
      role: 'Admin',
      icon: Crown,
      color: 'text-yellow-600 bg-yellow-100',
      description: 'Full access to all features, can manage team members and settings',
    },
    {
      role: 'Editor',
      icon: Edit,
      color: 'text-blue-600 bg-blue-100',
      description: 'Can create, edit, and schedule posts but cannot manage team',
    },
    {
      role: 'Viewer',
      icon: Shield,
      color: 'text-gray-600 bg-gray-100',
      description: 'Can view posts and analytics but cannot make changes',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Team & Roles</h1>
              <p className="text-gray-600">Manage your team members and permissions</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-500/30">
            <UserPlus className="w-5 h-5" />
            Invite Member
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {roleInfo.map((info) => {
          const Icon = info.icon;
          return (
            <div key={info.role} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className={`w-12 h-12 ${info.color} rounded-xl flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{info.role}</h3>
              <p className="text-sm text-gray-600">{info.description}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Team Members ({teamMembers.length})</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {teamMembers.map((member) => (
            <div key={member.email} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${member.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-sm">{member.avatar}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue={member.role}
                  >
                    <option>Admin</option>
                    <option>Editor</option>
                    <option>Viewer</option>
                  </select>
                  <button className="text-gray-400 hover:text-red-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">Collaboration Features</h3>
            <p className="text-sm text-gray-700 mb-3">
              Invite team members to collaborate on your social media content. Assign roles based on responsibilities and maintain control over your brand presence.
            </p>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Real-time collaboration on posts</li>
              <li>• Role-based access control</li>
              <li>• Activity tracking and audit logs</li>
              <li>• Team notifications and updates</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
