'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ReportsPage() {
  const { user, profile } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState('monthly')

  // Mock data for reports
  const monthlyData = {
    revenue: 45231.89,
    expenses: 12234.56,
    profit: 32997.33,
    transactions: 2350,
    growth: 20.1
  }

  const categoryBreakdown = [
    { name: 'Sales Revenue', amount: 35000, percentage: 77.6 },
    { name: 'Consulting', amount: 10231.89, percentage: 22.4 },
    { name: 'Office Supplies', amount: -2500, percentage: 20.4 },
    { name: 'Marketing', amount: -4200, percentage: 34.3 },
    { name: 'Travel', amount: -1800, percentage: 14.7 },
    { name: 'Software', amount: -3734.56, percentage: 30.5 }
  ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to view reports</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/auth/signin'}>
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const exportToPDF = () => {
    alert('PDF export functionality would be implemented here')
  }

  const exportToExcel = () => {
    alert('Excel export functionality would be implemented here')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
              <p className="text-sm text-gray-600">Comprehensive financial analysis and insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => window.location.href = '/'} variant="outline">
                Dashboard
              </Button>
              <Button onClick={exportToPDF} variant="outline">
                📄 Export PDF
              </Button>
              <Button onClick={exportToExcel} variant="outline">
                📊 Export Excel
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Period Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Report Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              {['weekly', 'monthly', 'quarterly', 'yearly'].map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  onClick={() => setSelectedPeriod(period)}
                  className="capitalize"
                >
                  {period}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${monthlyData.revenue.toLocaleString()}</div>
              <p className="text-xs text-green-600">+{monthlyData.growth}% from last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${monthlyData.expenses.toLocaleString()}</div>
              <p className="text-xs text-red-600">+4.3% from last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">${monthlyData.profit.toLocaleString()}</div>
              <p className="text-xs text-blue-600">+15.2% from last period</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{monthlyData.transactions.toLocaleString()}</div>
              <p className="text-xs text-gray-500">+180 from last period</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue vs Expenses Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Expenses</CardTitle>
              <CardDescription>Monthly comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-100 rounded">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-gray-600">Chart visualization would be here</p>
                  <p className="text-sm text-gray-500">Using Recharts or Chart.js</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Income and expense categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryBreakdown.map((category, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${
                        category.amount > 0 ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${
                        category.amount > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${Math.abs(category.amount).toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-500">{category.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profit & Loss Statement */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profit & Loss Statement</CardTitle>
            <CardDescription>Detailed financial breakdown for {selectedPeriod} period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-green-600 mb-2">INCOME</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sales Revenue</span>
                    <span className="font-medium">$35,000.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Consulting Revenue</span>
                    <span className="font-medium">$10,231.89</span>
                  </div>
                  <div className="flex justify-between font-bold text-green-600 pt-2 border-t">
                    <span>Total Income</span>
                    <span>$45,231.89</span>
                  </div>
                </div>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-semibold text-red-600 mb-2">EXPENSES</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Office Supplies</span>
                    <span className="font-medium">$2,500.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Marketing</span>
                    <span className="font-medium">$4,200.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Travel</span>
                    <span className="font-medium">$1,800.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Software</span>
                    <span className="font-medium">$3,734.56</span>
                  </div>
                  <div className="flex justify-between font-bold text-red-600 pt-2 border-t">
                    <span>Total Expenses</span>
                    <span>$12,234.56</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="flex justify-between text-lg font-bold text-blue-600">
                  <span>NET PROFIT</span>
                  <span>$32,997.33</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Summary</CardTitle>
            <CardDescription>Monthly cash flow analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">$45,231.89</div>
                <p className="text-sm text-gray-600">Cash Inflow</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">$12,234.56</div>
                <p className="text-sm text-gray-600">Cash Outflow</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">$32,997.33</div>
                <p className="text-sm text-gray-600">Net Cash Flow</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
