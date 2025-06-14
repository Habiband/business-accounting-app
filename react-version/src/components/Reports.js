import React, { useState } from 'react';

function Reports() {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const reportData = {
    revenue: 45231.89,
    expenses: 12234.56,
    profit: 32997.33,
    transactions: 2350,
    growth: 20.1
  };

  const categoryBreakdown = [
    { name: 'Sales Revenue', amount: 35000, percentage: 77.6, type: 'income' },
    { name: 'Consulting', amount: 10231.89, percentage: 22.4, type: 'income' },
    { name: 'Office Supplies', amount: 2500, percentage: 20.4, type: 'expense' },
    { name: 'Marketing', amount: 4200, percentage: 34.3, type: 'expense' },
    { name: 'Travel', amount: 1800, percentage: 14.7, type: 'expense' },
    { name: 'Software', amount: 3734.56, percentage: 30.5, type: 'expense' }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Reports</h1>
          <p className="text-gray-600">Comprehensive financial analysis and insights</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            📄 Export PDF
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
            📊 Export Excel
          </button>
        </div>
      </div>

      {/* Period Selection */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">Report Period</h3>
        <div className="flex space-x-4">
          {['weekly', 'monthly', 'quarterly', 'yearly'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded capitalize ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">${reportData.revenue.toLocaleString()}</p>
          <p className="text-xs text-green-600">+{reportData.growth}% from last period</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600">${reportData.expenses.toLocaleString()}</p>
          <p className="text-xs text-red-600">+4.3% from last period</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Net Profit</h3>
          <p className="text-2xl font-bold text-blue-600">${reportData.profit.toLocaleString()}</p>
          <p className="text-xs text-blue-600">+15.2% from last period</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-600">Transactions</h3>
          <p className="text-2xl font-bold">{reportData.transactions.toLocaleString()}</p>
          <p className="text-xs text-gray-500">+180 from last period</p>
        </div>
      </div>

      {/* Charts and Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Chart Placeholder */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
          <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-gray-600">Chart visualization would be here</p>
              <p className="text-sm text-gray-500">Using Chart.js or Recharts</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Category Breakdown</h3>
          <div className="space-y-4">
            {categoryBreakdown.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    category.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <div className="text-right">
                  <div className={`font-bold ${
                    category.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    ${category.amount.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">{category.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profit & Loss Statement */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Profit & Loss Statement</h3>
        <div className="space-y-6">
          <div className="border-b pb-4">
            <h4 className="font-semibold text-green-600 mb-2">INCOME</h4>
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
            <h4 className="font-semibold text-red-600 mb-2">EXPENSES</h4>
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

          <div>
            <div className="flex justify-between text-lg font-bold text-blue-600">
              <span>NET PROFIT</span>
              <span>$32,997.33</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Reports;
