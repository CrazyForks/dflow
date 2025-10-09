import { env } from 'env'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getAuthConfigAction } from '@/actions/pages/auth'
import SignInForm from '@/components/sign-in/SignInForm'
import { DFLOW_CONFIG } from '@/lib/constants'
import { AuthConfig } from '@/payload-types'

const SignInPage = async () => {
  const headersList = await headers()
  const host = headersList.get('host') || ''
  const redirectionURL = DFLOW_CONFIG.URL
  if (host === 'app.dflow.sh') {
    redirect(`${redirectionURL}/sign-in`)
  }

  const result = await getAuthConfigAction()
  const authMethod = (result?.data?.authConfig.authMethod ||
    'both') as AuthConfig['authMethod']

  const resendEnvExist = !!(
    env?.RESEND_API_KEY &&
    env?.RESEND_SENDER_EMAIL &&
    env?.RESEND_SENDER_NAME
  )

  return <SignInForm resendEnvExist={resendEnvExist} authMethod={authMethod} />
}

export default SignInPage
