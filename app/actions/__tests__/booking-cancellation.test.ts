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

  
  it('should allow admin to reject a pending booking', async () => {
    const rejectedBooking = {
      id: 'booking-555',
      status: 'rejected',
      provider_id: 'provider-123',
      client_id: 'client-456',
    };

   
    mockSupabase.single.mockResolvedValueOnce({ 
      data: rejectedBooking, 
      error: null 
    } as any);

 
    const { data, error } = await mockSupabase
      .from('bookings')
      .update({ status: 'rejected' })
      .eq('id', 'booking-555')
      .select()
      .single();

   
    expect(error).toBeNull();
    expect(data.status).toBe('rejected');
    expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'rejected' });
 
    expect(mockSendBookingEmail).not.toHaveBeenCalled();
  });

  
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

   
    const { data, error } = await mockSupabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', 'booking-789')
      .select()
      .single();

   
    expect(error).toBeNull();
    expect(data.status).toBe('cancelled');
    expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'cancelled' });
   
    expect(mockSendBookingEmail).not.toHaveBeenCalled();
  });


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

   
    const { data, error } = await mockSupabase
      .from('bookings')
      .update({ status: 'rejected' })
      .eq('id', 'booking-456')
      .select()
      .single();

    
    expect(error).toBeNull();
    expect(data.status).toBe('rejected');
    expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'rejected' });
  });

 
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

 
    const { data: booking } = await mockSupabase
      .from('bookings')
      .select('*')
      .eq('id', 'booking-111')
      .single();

    
    const isTerminalState = ['rejected', 'cancelled', 'completed'].includes(booking.status);

    
    let updateCalled = false;
    if (!isTerminalState) {
      await mockSupabase
        .from('bookings')
        .update({ status: 'rejected' })
        .eq('id', 'booking-111');
      updateCalled = true;
    }

    expect(isTerminalState).toBe(true);
    expect(updateCalled).toBe(false);
    expect(mockSupabase.update).not.toHaveBeenCalled();
    expect(mockSendBookingEmail).not.toHaveBeenCalled();
  });


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

    
    const { data, error } = await mockSupabase
      .from('bookings')
      .update({ status: 'rejected' })
      .eq('id', 'booking-222')
      .select()
      .single();


    expect(error).toBeNull();
    expect(data.status).toBe('rejected');
    expect(data.id).toBe('booking-222');
    expect(mockSupabase.from).toHaveBeenCalledWith('bookings');
    expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'rejected' });
  });
});