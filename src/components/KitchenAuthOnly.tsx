import React from 'react'
import type { User } from '../types'

interface Props {
  children: React.ReactNode
  user: User
}

export default function KitchenAuthOnly({ user, children }: Props) {
  if (user.auth === 'kitchen' || user.auth === 'admin') {
    return <>{children}</>
  }
  return null
}
