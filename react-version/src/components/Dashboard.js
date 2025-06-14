import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  const stats = [
    { title: 'Total Revenue', value: '$45,231.89', change: '+20.1%', icon: '💰', color: 'text-green-600' },
    { title: 'Total Expenses', value: '$12,234.56', change: '+4.3%', icon: '💸', color: 'text-red-600' },
    { title: 'Net Profit', value: '$32,997.33', change: '+15.2%', icon: '📊', color: 'text-blue-600' },
    { title: 'Transactions', value: '2,350', change: '+180', icon: '📄', color: 'text-gray-900' }
  ];

  const quickActions = [
    { title: 'Add Transaction', description: 'Record income or expense', icon: '📝', link: '/transactions' },
    { title: 'View Reports', description: 'Financial analytics', icon: '📊', link: '/reports' },
    { title: 'Manage Users', description: 'Team management', icon: '👥', link: '/users' }
  ];

  const recentActivity = [
    { type: 'success', title: 'New sale recorded', description: '$1,234.56 - Office supplies', time: '2 hours ago' },
    { type: 'info', title: 'Expense approved', description: '$567.89 - Marketing campaign', time: '4 hours ago' },
    { type: 'warning', title: 'New user registered', description: 'john.doe@company.com', time: '6 hours ago' }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your business overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
              </div>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className={`text-xs mt-2 ${stat.color}`}>
              📈 {stat.change} from last month
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">{action.icon}</span>
              <div>
                <h3 className="text-lg font-semibold">{action.title}</h3>
                <p className="text-gray-600">{action.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <p className="text-gray-600">Latest transactions and updates</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'info' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`}></div>
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
