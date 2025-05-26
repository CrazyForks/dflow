'use client'

import { Check, Copy, LogOut, UserPlus } from 'lucide-react'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { logoutAction } from '@/actions/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { Tenant, User } from '@/payload-types'

export function NavUser({ user }: { user: User }) {
  const { execute } = useAction(logoutAction)
  const initial = user.email.slice(0, 1)
  const params = useParams()

  const [open, setOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState('tenant-user')
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null)
  const [inviteLink, setInviteLink] = useState('')

  const generateInviteLink = () => {
    if (!selectedTenant) return
    const payload = {
      tenant: selectedTenant.id,
      roles: [selectedRole],
    }
    const token = btoa(JSON.stringify(payload))
    const url = `${window.location.origin}/accept-invite?token=${token}`
    setInviteLink(url)
    console.log(inviteLink, 'Generated invite link')
  }

  const handleCopy = async () => {
    if (inviteLink) {
      await navigator.clipboard.writeText(inviteLink)
      toast('Invite link copied to clipboard')
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className='h-8 w-8 cursor-pointer rounded-lg'>
              <AvatarFallback className='rounded-lg uppercase'>
                {initial}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className='w-64 rounded-lg'
            side='bottom'
            align='end'>
            <DropdownMenuLabel>
              <div className='grid flex-1 text-left text-sm leading-tight'>
                <span className='truncate font-semibold'>Account</span>
                <span className='truncate text-xs text-muted-foreground'>
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuLabel className='font-normal text-muted-foreground'>
                Team
              </DropdownMenuLabel>

              {user?.tenants?.map(tenant => {
                const t = tenant.tenant as Tenant
                return (
                  <DropdownMenuItem className='group' key={tenant.id}>
                    <Link
                      href={`/${t?.slug}/dashboard`}
                      className='flex h-full w-full items-center justify-between gap-2 text-sm'>
                      <div className='inline-flex items-center gap-x-2'>
                        <Avatar className='h-6 w-6 rounded-lg'>
                          <AvatarFallback className='rounded-lg uppercase group-hover:text-accent'>
                            {t?.name?.slice(0, 1)}
                          </AvatarFallback>
                        </Avatar>
                        <div className='inline-flex items-center gap-x-1'>
                          <p className='line-clamp-1 break-all'>{t?.name}</p>
                          <span className='text-muted-foreground group-hover:text-accent-foreground'>
                            {user.username === t?.slug && '(you)'}
                          </span>
                        </div>
                      </div>
                      {params.organisation === t?.slug && (
                        <Check size={20} className='text-primary' />
                      )}
                    </Link>
                  </DropdownMenuItem>
                )
              })}

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={e => e.preventDefault()}>
                    <UserPlus className='mr-2 h-4 w-4' />
                    Invite Member
                  </DropdownMenuItem>
                </DialogTrigger>

                <DialogContent className='sm:max-w-md'>
                  <DialogHeader>
                    <DialogTitle>Invite to tenant</DialogTitle>
                    <DialogDescription>
                      Select a tenant and role to generate an invite link.
                    </DialogDescription>
                  </DialogHeader>

                  <div className='grid gap-4 py-4'>
                    <div className='grid gap-2'>
                      <Label htmlFor='tenant'>Tenant</Label>
                      <Select
                        value={selectedTenant?.id}
                        onValueChange={val => {
                          const found = user.tenants?.find(
                            t => (t.tenant as Tenant).id === val,
                          )
                          if (found) setSelectedTenant(found.tenant as Tenant)
                        }}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select tenant' />
                        </SelectTrigger>
                        <SelectContent>
                          {user.tenants?.map(t => {
                            const tenant = t.tenant as Tenant
                            return (
                              <SelectItem key={tenant.id} value={tenant.id}>
                                {tenant.name}
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='grid gap-2'>
                      <Label htmlFor='role'>Role</Label>
                      <Select
                        value={selectedRole}
                        onValueChange={setSelectedRole}>
                        <SelectTrigger>
                          <SelectValue placeholder='Select role' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='tenant-user'>
                            Tenant User
                          </SelectItem>
                          <SelectItem value='tenant-admin'>
                            Tenant Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='grid gap-2'>
                      <Label htmlFor='link'>Invite Link</Label>
                      <div className='flex gap-2'>
                        <Input id='link' value={inviteLink} readOnly />
                        <Button
                          type='button'
                          variant='outline'
                          size='icon'
                          onClick={handleCopy}>
                          <Copy className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button type='button' onClick={generateInviteLink}>
                      Generate Link
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => execute()}>
              <LogOut className='mr-2 h-4 w-4' />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
