'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  let supabase;
  try {
    supabase = await createClient()
  } catch (err: any) {
    redirect(`/login?error=${encodeURIComponent(err?.message || 'Database configuration error')}`)
  }

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  try {
    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
      if (error.message.toLowerCase().includes('fetch failed')) {
        redirect('/login?error=supabase_connection_failed')
      }
      // Supabase returns "Invalid login credentials" for wrong password OR unknown email
      if (error.message.toLowerCase().includes('invalid login credentials') ||
          error.message.toLowerCase().includes('invalid credentials')) {
        redirect('/login?error=incorrect_password')
      }
      redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }
  } catch (err: any) {
    if (err?.message?.includes('NEXT_REDIRECT')) throw err
    if (err?.message?.toLowerCase().includes('fetch failed')) {
      redirect('/login?error=supabase_connection_failed')
    }
    redirect(`/login?error=${encodeURIComponent(err?.message || 'Authentication failed')}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  let supabase;
  try {
    supabase = await createClient()
  } catch (err: any) {
    redirect(`/login?error=${encodeURIComponent(err?.message || 'Database configuration error')}`)
  }

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const firstName = (formData.get('firstName') as string) || ''
  const lastName = (formData.get('lastName') as string) || ''

  // Check if password meets minimum length
  if (password.length < 6) {
    redirect('/login?error=password_too_short')
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`.trim(),
        },
      },
    })

    if (error) {
      if (error.message.toLowerCase().includes('fetch failed')) {
        redirect('/login?error=supabase_connection_failed')
      }
      // Supabase returns this when the email is already registered
      if (error.message.toLowerCase().includes('already registered') ||
          error.message.toLowerCase().includes('user already registered')) {
        redirect('/login?error=email_exists')
      }
      redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    // If user already exists, Supabase may NOT return an error but returns
    // a user with identities=[] — check for that case too
    if (data?.user && data?.user?.identities && data.user.identities.length === 0) {
      redirect('/login?error=email_exists')
    }
  } catch (err: any) {
    if (err?.message?.includes('NEXT_REDIRECT')) throw err
    if (err?.message?.toLowerCase().includes('fetch failed')) {
      redirect('/login?error=supabase_connection_failed')
    }
    redirect(`/login?error=${encodeURIComponent(err?.message || 'Sign up failed')}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
