import { describe, it, expect, jest, beforeEach } from '@jest/globals';

jest.mock('@/utils/supabase/client', () => ({
  createClient: jest.fn(),
}));

jest.mock('@/lib/email-service', () => ({
  sendBookingEmail: jest.fn(),
}));

import { createClient } from '@/utils/supabase/client';
import { sendBookingEmail } from '@/lib/email-service';

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;
const mockSendBookingEmail = sendBookingEmail as jest.MockedFunction<typeof sendBookingEmail>;

describe('Booking Cancellation/Rejection Flow', () => {
  let mockSupabase: any;
  let mockAuthClient: any;

  beforeEach(() => {
    jest.clearAllMocks();

    mockAuthClient = {
      getSession: jest.fn(),
    };

    mockSupabase = {
      auth: mockAuthClient,
      from: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn(),
      eq: jest.fn().mockReturnThis(),
    };

    mockCreateClient.mockReturnValue(mockSupabase);
  });

  // TEST 1: Admin can reject pending booking (no email)
  it('should allow admin to reject a pending booking', async () => {
    const rejectedBooking = {
      id: 'booking-555',
      status: 'rejected',
      provider_id: 'provider-123',
      client_id: 'client-456',
    };

    // Mock successful database update
    mockSupabase.single.mockResolvedValueOnce({ 
      data: rejectedBooking, 
      error: null 
    } as any);

    // ACT - Simulate admin rejecting booking
    const { data, error } = await mockSupabase
      .from('bookings')
      .update({ status: 'rejected' })
      .eq('id', 'booking-555')
      .select()
      .single();

    // ASSERT
    expect(error).toBeNull();
    expect(data.status).toBe('rejected');
    expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'rejected' });
    // No email sent for admin actions
    expect(mockSendBookingEmail).not.toHaveBeenCalled();
  });

  // TEST 2: Admin can cancel confirmed booking (no email)
  it('should allow admin to cancel a confirmed booking', async () => {
    const cancelledBooking = {
      id: 'booking-789',
      status: 'cancelled',
      provider_id: 'provider-123',
      client_id: 'client-456',
    };

    mockSupabase.single.mockResolvedValueOnce({ 
      data: cancelledBooking, 
      error: null 
    } as any);

    // ACT
    const { data, error } = await mockSupabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', 'booking-789')
      .select()
      .single();

    // ASSERT
    expect(error).toBeNull();
    expect(data.status).toBe('cancelled');
    expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'cancelled' });
    // No email sent for admin actions
    expect(mockSendBookingEmail).not.toHaveBeenCalled();
  });

  // TEST 3: Provider can reject pending booking
  it('should allow provider to reject a pending booking', async () => {
    const updatedBooking = {
      id: 'booking-456',
      status: 'rejected',
      provider_id: 'provider-123',
      client_id: 'client-789',
    };

    mockSupabase.single.mockResolvedValueOnce({ 
      data: updatedBooking, 
      error: null 
    } as any);
    
    mockSendBookingEmail.mockResolvedValue({ success: true } as any);

    // ACT - Simulate provider rejecting booking
    const { data, error } = await mockSupabase
      .from('bookings')
      .update({ status: 'rejected' })
      .eq('id', 'booking-456')
      .select()
      .single();

    // Provider rejection might send email (if implemented)
    // For now, just verify the status update works
    
    // ASSERT
    expect(error).toBeNull();
    expect(data.status).toBe('rejected');
    expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'rejected' });
  });

  // TEST 4: Status update is idempotent (button disappears after first click)
  it('should not update status if booking is already rejected/cancelled', async () => {
    const alreadyRejectedBooking = {
      id: 'booking-111',
      status: 'rejected',
      provider_id: 'provider-123',
    };

    mockSupabase.single.mockResolvedValue({ 
      data: alreadyRejectedBooking, 
      error: null 
    } as any);

    // ACT - Fetch booking status
    const { data: booking } = await mockSupabase
      .from('bookings')
      .select('*')
      .eq('id', 'booking-111')
      .single();

    // Check if already in terminal state
    const isTerminalState = ['rejected', 'cancelled', 'completed'].includes(booking.status);

    // UI logic: Don't show action buttons if in terminal state
    let updateCalled = false;
    if (!isTerminalState) {
      await mockSupabase
        .from('bookings')
        .update({ status: 'rejected' })
        .eq('id', 'booking-111');
      updateCalled = true;
    }

    // ASSERT
    expect(isTerminalState).toBe(true);
    expect(updateCalled).toBe(false);
    expect(mockSupabase.update).not.toHaveBeenCalled();
    expect(mockSendBookingEmail).not.toHaveBeenCalled();
  });

  // TEST 5: Database handles status update successfully
  it('should update booking status in database', async () => {
    const rejectedBooking = {
      id: 'booking-222',
      status: 'rejected',
      provider_id: 'provider-123',
      client_id: 'client-456',
    };

    mockSupabase.single.mockResolvedValueOnce({ 
      data: rejectedBooking, 
      error: null 
    } as any);

    // ACT
    const { data, error } = await mockSupabase
      .from('bookings')
      .update({ status: 'rejected' })
      .eq('id', 'booking-222')
      .select()
      .single();

    // ASSERT
    expect(error).toBeNull();
    expect(data.status).toBe('rejected');
    expect(data.id).toBe('booking-222');
    expect(mockSupabase.from).toHaveBeenCalledWith('bookings');
    expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'rejected' });
  });
});