'use client'

/**
 * Auth Context
 * Single Responsibility: 인증 상태 관리만 담당
 * Type Single Source of Truth: User 타입은 types/api.ts에서 import
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiClient } from '@/lib/api'
import type { User } from '@/types/api'

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // ✅ 수정: 'token' -> 'access_token' (API Client와 통일)
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        const currentTime = Date.now() / 1000

        if (payload.exp > currentTime) {
          setUser({
            id: payload.sub,
            username: payload.username,
            email: payload.email || '',
            createdAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : '',
            updatedAt: payload.iat ? new Date(payload.iat * 1000).toISOString() : '',
          })
        } else {
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
        }
      } catch (error) {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // ✅ 수정: API Client 사용 (중복 코드 제거)
      const response = await apiClient.login({ username, password })

      if (response.success && response.data) {
        setUser(response.data.user)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    // ✅ 수정: API Client의 logout 사용
    apiClient.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
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