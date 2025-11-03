import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// Mock Supabase before importing the action
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));

// Mock email service
jest.mock('@/lib/email-service', () => ({
  sendBookingEmail: jest.fn(),
}));

import { sendProviderBookingNotification } from '../booking-actions';
import { createClient } from '@/utils/supabase/server';
import { sendBookingEmail } from '@/lib/email-service';

// Add type assertions for mocked functions
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;
const mockSendBookingEmail = sendBookingEmail as jest.MockedFunction<typeof sendBookingEmail>;

describe('Booking Actions - sendProviderBookingNotification', () => {
  let mockSupabase: any;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create mock Supabase client
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };

    // Make createClient return our mock
    mockCreateClient.mockResolvedValue(mockSupabase);
  });

  // TEST 1: Successfully sends booking notification
  it('should send provider notification email when booking is created', async () => {
    // ARRANGE: Set up test data
    const mockBooking = {
      id: 'booking-123',
      date: '2025-11-15',
      time: '10:00 AM',
      clients: {
        first_name: 'John',
        last_name: 'Doe',
        address: '123 Main St, City',
      },
      providers: {
        name: 'Mike the Plumber',
        email: 'mike@plumber.com',
        category: 'Plumbing',
      },
    };

    // Mock Supabase to return our test booking
    mockSupabase.single.mockResolvedValue({ data: mockBooking });

    // Mock email service to succeed
    mockSendBookingEmail.mockResolvedValue({ 
      success: true 
    } as any);

    // ACT: Call the function
    const result = await sendProviderBookingNotification('booking-123');

    // ASSERT: Verify behavior
    
    // 1. Check Supabase was queried correctly
    expect(mockSupabase.from).toHaveBeenCalledWith('bookings');
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'booking-123');
    
    // 2. Check email was sent with correct data
    expect(mockSendBookingEmail).toHaveBeenCalledWith(
      'providerNewBooking',
      'mike@plumber.com',
      expect.objectContaining({
        providerName: 'Mike the Plumber',
        clientName: 'John Doe',
        service: 'Plumbing',
        time: '10:00 AM',
        address: '123 Main St, City',
      })
    );

    // 3. Check function returned success
    expect(result).toEqual({ success: true });
  });

  // TEST 2: Handles missing booking gracefully
  it('should return error when booking does not exist', async () => {
    // ARRANGE: Mock Supabase to return null (booking not found)
    mockSupabase.single.mockResolvedValue({ data: null });

    // ACT: Call the function
    const result = await sendProviderBookingNotification('invalid-id');

    // ASSERT: Verify error handling
    
    // 1. Email should NOT be sent
    expect(mockSendBookingEmail).not.toHaveBeenCalled();
    
    // 2. Should return error
    expect(result).toEqual({
      success: false,
      error: 'Booking not found',
    });
  });

  // TEST 3: Handles missing client data
  it('should return error when client data is missing', async () => {
    // ARRANGE: Mock booking without client
    const incompleteBooking = {
      id: 'booking-123',
      date: '2025-11-15',
      time: '10:00 AM',
      clients: null, // ← Missing client
      providers: {
        name: 'Mike the Plumber',
        email: 'mike@plumber.com',
        category: 'Plumbing',
      },
    };

    mockSupabase.single.mockResolvedValue({ data: incompleteBooking });

    // ACT
    const result = await sendProviderBookingNotification('booking-123');

    // ASSERT
    expect(mockSendBookingEmail).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: 'Booking not found',
    });
  });

  // TEST 4: Handles email service failure
  it('should handle email service failure gracefully', async () => {
    // ARRANGE
    const mockBooking = {
      id: 'booking-123',
      date: '2025-11-15',
      time: '10:00 AM',
      clients: {
        first_name: 'John',
        last_name: 'Doe',
        address: '123 Main St',
      },
      providers: {
        name: 'Mike',
        email: 'mike@plumber.com',
        category: 'Plumbing',
      },
    };

    mockSupabase.single.mockResolvedValue({ data: mockBooking });

    // Mock email service to fail
    mockSendBookingEmail.mockResolvedValue({
      success: false,
      error: 'Email delivery failed',
    } as any);

    // ACT
    const result = await sendProviderBookingNotification('booking-123');

    // ASSERT: Should propagate the error
    expect(result).toEqual({
      success: false,
      error: 'Email delivery failed',
    });
  });

  // TEST 5: Formats date correctly
  it('should format booking date in human-readable format', async () => {
    // ARRANGE
    const mockBooking = {
      id: 'booking-123',
      date: '2025-11-15', // ← Raw ISO date
      time: '10:00 AM',
      clients: {
        first_name: 'John',
        last_name: 'Doe',
        address: '123 Main St',
      },
      providers: {
        name: 'Mike',
        email: 'mike@plumber.com',
        category: 'Plumbing',
      },
    };

    mockSupabase.single.mockResolvedValue({ data: mockBooking });
    mockSendBookingEmail.mockResolvedValue({ success: true } as any);

    // ACT
    await sendProviderBookingNotification('booking-123');

    // ASSERT: Check email received formatted date
    expect(mockSendBookingEmail).toHaveBeenCalledWith(
      'providerNewBooking',
      'mike@plumber.com',
      expect.objectContaining({
        date: 'Saturday, November 15, 2025', // Should include day name
      })
    );
  });
});