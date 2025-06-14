'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Welcome to Business Accounting</CardTitle>
            <CardDescription>
              A comprehensive accounting and sales management platform for your business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={() => window.location.href = '/auth/signin'}>
              Sign In
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/auth/signup'}>
              Create Account
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Business Accounting Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {profile?.full_name || user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500 capitalize">{profile?.role}</span>
              <Button variant="outline" onClick={() => window.location.href = '/transactions'}>
                Transactions
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/reports'}>
                Reports
              </Button>
              {profile?.role === 'admin' && (
                <Button variant="outline" onClick={() => window.location.href = '/users'}>
                  Users
                </Button>
              )}
              <Button variant="outline" onClick={() => window.location.href = '/profile'}>
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <span className="text-2xl">💰</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-gray-500">
                📈 +20.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expenses</CardTitle>
              <span className="text-2xl">💸</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,234.56</div>
              <p className="text-xs text-gray-500">
                +4.3% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
              <span className="text-2xl">📄</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2,350</div>
              <p className="text-xs text-gray-500">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <span className="text-2xl">👥</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-gray-500">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => window.location.href = '/transactions'}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-xl mr-2">📝</span>
                Add Transaction
              </CardTitle>
              <CardDescription>Record a new income or expense transaction</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => window.location.href = '/reports'}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-xl mr-2">📊</span>
                View Reports
              </CardTitle>
              <CardDescription>Generate and view financial reports</CardDescription>
            </CardHeader>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => window.location.href = '/users'}
          >
            <CardHeader>
              <CardTitle className="flex items-center">
                <span className="text-xl mr-2">👥</span>
                Manage Users
              </CardTitle>
              <CardDescription>Add and manage team members</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest transactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">New sale recorded</p>
                    <p className="text-sm text-gray-500">$1,234.56 - Office supplies</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">2 hours ago</span>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Expense approved</p>
                    <p className="text-sm text-gray-500">$567.89 - Marketing campaign</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">4 hours ago</span>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">New user registered</p>
                    <p className="text-sm text-gray-500">john.doe@company.com</p>
                  </div>
                </div>
                <span className="text-sm text-gray-500">6 hours ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
