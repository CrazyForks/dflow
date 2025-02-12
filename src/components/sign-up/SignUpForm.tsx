'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useAction } from 'next-safe-action/hooks'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { signUpAction } from '@/actions/auth'
import { signUpSchema } from '@/actions/auth/validator'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const SignUpForm: React.FC = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const { handleSubmit } = form
  const { execute, isPending } = useAction(signUpAction, {
    onSuccess: ({ data }) => {
      if (data) {
        toast.success('Account created successfully!')
        router.push('/sign-in')
      }
    },
    onError: ({ error }) => {
      toast.error(`Failed to create account: ${error.serverError}`)
    },
  })

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    execute(data)
  }

  return (
    <div className='flex min-h-screen w-full items-center justify-center'>
      <div className='w-full max-w-md p-6'>
        <h1 className='mb-6 text-3xl font-semibold'>Sign Up</h1>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name={'email'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      placeholder='johndeo@gmail.com'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'password'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

                  <FormControl>
                    <Input {...field} type='password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={'confirmPassword'}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>

                  <FormControl>
                    <Input {...field} type='password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>
        </Form>

        <div className='text-base-content/70 mt-4 text-center text-sm'>
          <p>
            Already have an account?{' '}
            <Link href='/sign-in' className='text-primary underline'>
              SignIn
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUpForm
