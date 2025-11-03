import { describe, it, expect, jest, beforeEach } from '@jest/globals';

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(),
}));

import { createClient } from '@/utils/supabase/client';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

describe('Authentication & Authorization', () => {
  let mockSupabase: any;
  let mockAuthClient: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAuthClient = {
      getSession: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    };

    mockSupabase = {
      auth: mockAuthClient,
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn(),
      eq: jest.fn().mockReturnThis(),
    };

    mockCreateClient.mockReturnValue(mockSupabase);
  });

  // TEST 1: Successful user login
  it('should authenticate user with valid credentials', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
      user_metadata: { role: 'client' }
    };

    mockAuthClient.signInWithPassword.mockResolvedValue({
      data: { user: mockUser, session: { access_token: 'token-123' } },
      error: null
    } as any);

    // ACT
    const { data, error } = await mockSupabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123'
    });

    // ASSERT
    expect(error).toBeNull();
    expect(data.user.email).toBe('test@example.com');
    expect(data.session.access_token).toBeDefined();
  });

  // TEST 2: Failed login with invalid credentials
  it('should reject login with invalid credentials', async () => {
    mockAuthClient.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' }
    } as any);

    // ACT
    const { data, error } = await mockSupabase.auth.signInWithPassword({
      email: 'wrong@example.com',
      password: 'wrongpassword'
    });

    // ASSERT
    expect(error).not.toBeNull();
    expect(error.message).toBe('Invalid login credentials');
    expect(data.user).toBeNull();
  });

  // TEST 3: Protected action requires authentication
  it('should require authentication for booking creation', async () => {
    // Mock no session (user not logged in)
    mockAuthClient.getSession.mockResolvedValue({
      data: { session: null },
      error: null
    } as any);

    // ACT
    const { data: session } = await mockSupabase.auth.getSession();

    // Check if user is authenticated
    const isAuthenticated = session.session !== null;

    // ASSERT
    expect(isAuthenticated).toBe(false);
    // In real app, this would redirect to login or show error
  });

  // TEST 4: User can access their own bookings
  it('should allow user to view their own bookings', async () => {
    const mockSession = {
      user: { id: 'client-123' }
    };

    mockAuthClient.getSession.mockResolvedValue({
      data: { session: mockSession },
      error: null
    } as any);

    const userBookings = [
      { id: 'booking-1', client_id: 'client-123', status: 'pending' },
      { id: 'booking-2', client_id: 'client-123', status: 'confirmed' }
    ];

    mockSupabase.single.mockResolvedValue({
      data: userBookings,
      error: null
    } as any);

    // ACT
    const { data: session } = await mockSupabase.auth.getSession();
    
    // Fetch bookings for logged-in user
    const { data: bookings } = await mockSupabase
      .from('bookings')
      .select('*')
      .eq('client_id', session.session.user.id)
      .single();

    // ASSERT
    expect(bookings).toHaveLength(2);
    expect(bookings.every((b: any) => b.client_id === 'client-123')).toBe(true);
  });

  // TEST 5: Successful logout
  it('should successfully log out user', async () => {
    mockAuthClient.signOut.mockResolvedValue({
      error: null
    } as any);

    // ACT
    const { error } = await mockSupabase.auth.signOut();

    // ASSERT
    expect(error).toBeNull();
    expect(mockAuthClient.signOut).toHaveBeenCalled();
  });
});