'use client'

import { useAction } from 'next-safe-action/hooks'
import { useEffect } from 'react'

import { getRolesAction } from '@/actions/roles'

const Roles = () => {
  const { execute: getRoles, result: roles } = useAction(getRolesAction)
  console.log('getRoles', roles)
  useEffect(() => {
    getRoles()
  }, [])
  return <div>Roles</div>
}

export default Roles
