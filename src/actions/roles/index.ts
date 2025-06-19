'use server'

import { protectedClient } from '@/lib/safe-action'

export const getRolesAction = protectedClient
  .metadata({
    actionName: 'getRolesAction',
  })
  .action(async ({ ctx }) => {
    const {
      userTenant: { tenant },
      payload,
    } = ctx

    const { docs: roles } = await payload.find({
      collection: 'roles',
      where: {
        and: [
          {
            'tenant.slug': {
              equals: tenant.slug,
            },
          },
        ],
      },
    })

    return roles
  })
