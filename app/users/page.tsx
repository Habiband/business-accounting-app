'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

type User = {
  id: string
  email: string
  fullName: string
  role: 'admin' | 'accountant' | 'employee' | 'shareholder'
  department: string
  status: 'active' | 'inactive'
  lastLogin: string
}

export default function UsersPage() {
  const { user, profile } = useAuth()
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      email: 'admin@example.com',
      fullName: 'Admin User',
      role: 'admin',
      department: 'Management',
      status: 'active',
      lastLogin: '2025-06-14'
    },
    {
      id: '2',
      email: 'john.accountant@example.com',
      fullName: 'John Smith',
      role: 'accountant',
      department: 'Finance',
      status: 'active',
      lastLogin: '2025-06-13'
    },
    {
      id: '3',
      email: 'jane.employee@example.com',
      fullName: 'Jane Doe',
      role: 'employee',
      department: 'Sales',
      status: 'active',
      lastLogin: '2025-06-12'
    },
    {
      id: '4',
      email: 'investor@example.com',
      fullName: 'Robert Johnson',
      role: 'shareholder',
      department: 'Investment',
      status: 'active',
      lastLogin: '2025-06-10'
    }
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [newUser, setNewUser] = useState({
    email: '',
    fullName: '',
    role: 'employee' as User['role'],
    department: ''
  })

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to view users</CardDescription>
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

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Only administrators can manage users</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.href = '/'}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleAddUser = () => {
    if (!newUser.email || !newUser.fullName || !newUser.department) {
      alert('Please fill in all fields')
      return
    }

    const user: User = {
      id: Date.now().toString(),
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      department: newUser.department,
      status: 'active',
      lastLogin: 'Never'
    }

    setUsers([...users, user])
    setNewUser({
      email: '',
      fullName: '',
      role: 'employee',
      department: ''
    })
    setShowAddForm(false)
  }

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ))
  }

  const deleteUser = (userId: string) => {
    const userToDelete = users.find(user => user.id === userId)
    if (!userToDelete) return

    if (userToDelete.id === '1') {
      alert('Cannot delete the main admin user!')
      return
    }

    if (confirm(`Are you sure you want to delete ${userToDelete.fullName}? This action cannot be undone.`)) {
      setUsers(users.filter(user => user.id !== userId))
      alert('User deleted successfully!')
    }
  }

  const editUser = (userId: string) => {
    const userToEdit = users.find(user => user.id === userId)
    if (!userToEdit) return

    const newName = prompt('Enter new name:', userToEdit.fullName)
    const newDepartment = prompt('Enter new department:', userToEdit.department)
    const newRole = prompt('Enter new role (admin/accountant/employee/shareholder):', userToEdit.role)

    if (newName && newDepartment && newRole) {
      setUsers(users.map(user =>
        user.id === userId
          ? {
              ...user,
              fullName: newName,
              department: newDepartment,
              role: newRole as User['role']
            }
          : user
      ))
      alert('User updated successfully!')
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'accountant': return 'bg-blue-100 text-blue-800'
      case 'employee': return 'bg-green-100 text-green-800'
      case 'shareholder': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="text-sm text-gray-600">Manage users, roles, and permissions</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={() => window.location.href = '/'} variant="outline">
                Dashboard
              </Button>
              <Button onClick={() => setShowAddForm(true)}>
                Add User
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === 'active').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Admins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.role === 'admin').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.role === 'employee').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add User Form */}
        {showAddForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input
                    type="email"
                    placeholder="user@example.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <Input
                    placeholder="John Doe"
                    value={newUser.fullName}
                    onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value as User['role']})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="employee">Employee</option>
                    <option value="accountant">Accountant</option>
                    <option value="admin">Admin</option>
                    <option value="shareholder">Shareholder</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <Input
                    placeholder="Sales, Finance, etc."
                    value={newUser.department}
                    onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>
                  Add User
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users List */}
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                      user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`}>
                      {user.fullName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{user.fullName}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-500">{user.department}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                    
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                    
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => editUser(user.id)}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleUserStatus(user.id)}
                      >
                        {user.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>

                      {user.id !== '1' && ( // Don't allow deleting the main admin
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
