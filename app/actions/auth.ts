'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

// In your login function:

export async function clientLogin(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { success: false, error: error.message }
  }

  // Check if user exists in clients table
  const { data: clientData } = await supabase
    .from('clients')
    .select('id')
    .eq('id', authData.user.id)
    .single()

  if (!clientData) {
    // Not a client, sign out and show error
    await supabase.auth.signOut()
    return { success: false, error: "This account is not registered as a client." }
  }

  return { success: true }
}

export async function providerLogin(formData: FormData) {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { success: false, error: error.message }
  }

  // Check if user exists in providers table
  const { data: providerData } = await supabase
    .from('providers')
    .select('id')
    .eq('id', authData.user.id)
    .single()

  if (!providerData) {
    // Not a provider, sign out and show error
    await supabase.auth.signOut()
    return { success: false, error: "This account is not registered as a provider." }
  }

  return { success: true }
}

  export async function clientSignup(formData: FormData) {
    const supabase = await createClient()
  
    // Parse form data
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const phone = formData.get('phone') as string
    const address = formData.get('address') as string
  
    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })
  
    if (authError) {
      console.error("Auth signup error:", authError.message)
      return { 
        success: false, 
        error: authError.message 
      }
    }
  
    // Insert user details into clients table
    const { error: insertError } = await supabase
      .from('clients')
      .insert({
        id: authData.user?.id,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address
      })
  
    if (insertError) {
      console.error("Client data insert error:", insertError.message)
      // You might want to delete the auth user if this fails
      return { 
        success: false, 
        error: "Failed to create client profile. Please try again." 
      }
    }
  
    revalidatePath('/', 'layout')
    return { success: true }
  }
  
  export async function providerSignup(formData: FormData) {
    const supabase = await createClient()
  
    // Parse form data
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const name = formData.get('name') as string
    const phone = formData.get('phone') as string
    const location = formData.get('location') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string
    const startingPrice = formData.get('startingPrice') as string
    const availability = formData.get('availability') as string
  
    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })
  
    if (authError) {
      console.error("Auth signup error:", authError.message)
      return { 
        success: false, 
        error: authError.message 
      }
    }
  
    // Insert user details into providers table
    const { error: insertError } = await supabase
      .from('providers')
      .insert({
        id: authData.user?.id,
        name,
        email,
        phone,
        location,
        category,
        description,
        starting_price: parseFloat(startingPrice),
        availability,
        approved: false // Providers start as unapproved
      })
  
    if (insertError) {
      console.error("Provider data insert error:", insertError.message)
      // You might want to delete the auth user if this fails
      return { 
        success: false, 
        error: "Failed to create provider profile. Please try again." 
      }
    }
  
    revalidatePath('/', 'layout')
    return { 
      success: true,
      needsApproval: true
    }
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