'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// In your login function:

export async function login(formData: FormData) {
    const supabase = await createClient()
  
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }
  
    console.log("Attempting login with:", data.email);
    
    const { data: authData, error } = await supabase.auth.signInWithPassword(data)
  
    console.log("Auth response:", error ? "Error" : "Success", error?.message);
    
    if (error) {
      return { 
        success: false, 
        error: error.message 
      }
    }
  
    // Log the user data to see if we got a session
    console.log("User authenticated:", !!authData.session);
  
    revalidatePath('/', 'layout')
    return { success: true }
  }

export async function signup(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { 
      success: false, 
      error: error.message 
    }
  }

  revalidatePath('/', 'layout')
  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    return { 
      success: false, 
      error: error.message 
    }
  }
  
  revalidatePath('/', 'layout')
  return { success: true }
}