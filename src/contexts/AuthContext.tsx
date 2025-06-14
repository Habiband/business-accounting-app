'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type User = {
  id: string
  email: string
}

type Profile = {
  id: string
  email: string
  full_name: string | null
  role: 'admin' | 'accountant' | 'employee' | 'shareholder'
  department: string | null
  created_at: string
  updated_at: string
}

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('user')
    const savedProfile = localStorage.getItem('profile')

    if (savedUser && savedProfile) {
      setUser(JSON.parse(savedUser))
      setProfile(JSON.parse(savedProfile))
    }

    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock authentication - in real app, this would call your backend
    if (email === 'admin@example.com' && password === 'password') {
      const mockUser: User = { id: '1', email }
      const mockProfile: Profile = {
        id: '1',
        email,
        full_name: 'Admin User',
        role: 'admin',
        department: 'Management',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      setUser(mockUser)
      setProfile(mockProfile)
      localStorage.setItem('user', JSON.stringify(mockUser))
      localStorage.setItem('profile', JSON.stringify(mockProfile))

      return { error: null }
    }

    return { error: { message: 'Invalid credentials' } }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    // Mock signup
    const mockUser: User = { id: Date.now().toString(), email }
    const mockProfile: Profile = {
      id: Date.now().toString(),
      email,
      full_name: fullName,
      role: 'employee',
      department: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    setUser(mockUser)
    setProfile(mockProfile)
    localStorage.setItem('user', JSON.stringify(mockUser))
    localStorage.setItem('profile', JSON.stringify(mockProfile))

    return { error: null }
  }

  const signOut = async () => {
    setUser(null)
    setProfile(null)
    localStorage.removeItem('user')
    localStorage.removeItem('profile')
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) {
      return { error: new Error('No user logged in') }
    }

    const updatedProfile = { ...profile, ...updates }
    setProfile(updatedProfile)
    localStorage.setItem('profile', JSON.stringify(updatedProfile))

    return { error: null }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useRequireAuth() {
  const auth = useAuth()
  
  useEffect(() => {
    if (!auth.loading && !auth.user) {
      window.location.href = '/auth/signin'
    }
  }, [auth.loading, auth.user])
  
  return auth
}

export function useRequireRole(allowedRoles: Profile['role'][]) {
  const auth = useAuth()
  
  useEffect(() => {
    if (!auth.loading && (!auth.profile || !allowedRoles.includes(auth.profile.role))) {
      window.location.href = '/unauthorized'
    }
  }, [auth.loading, auth.profile, allowedRoles])
  
  return auth
}
