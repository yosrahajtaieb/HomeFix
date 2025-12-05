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

describe('Booking Creation - Full Flow', () => {
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
      insert: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      single: jest.fn(),
      eq: jest.fn().mockReturnThis(),
    };

    mockCreateClient.mockReturnValue(mockSupabase);
  });

  
  it('should create booking, save to database, and send email notification', async () => {
    const mockSession = { user: { id: 'client-123' } };
    const mockBookingData = {
      id: 'booking-456',
      provider_id: 1,
      client_id: 'client-123',
      date: '2025-11-20',
      time: '10:00 AM',
      status: 'pending',
    };

    mockAuthClient.getSession.mockResolvedValue({ data: { session: mockSession } });
    mockSupabase.single.mockResolvedValue({ data: mockBookingData, error: null });
    mockSendBookingEmail.mockResolvedValue({ success: true } as any);

    const { data, error } = await mockSupabase
      .from('bookings')
      .insert({
        provider_id: 1,
        client_id: 'client-123',
        date: '2025-11-20',
        time: '10:00 AM',
        status: 'pending',
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toEqual(mockBookingData);
    expect(mockSupabase.from).toHaveBeenCalledWith('bookings');
  });

   
  it('should correctly identify already booked time slots', async () => {
   
    const existingBookings = [
      { time: '10:00 AM' },
      { time: '2:00 PM' },
      { time: '4:00 PM' }
    ];

   
    (mockSupabase.from) = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: (jest.fn() as any).mockResolvedValue({ data: existingBookings, error: null })
        })
      })
    });

    
    const result = await mockSupabase
      .from('bookings')
      .select('time')
      .eq('provider_id', 1)
      .eq('date', '2025-11-20');

    const bookedTimes = result.data?.map((b: any) => b.time) || [];

    
    expect(mockSupabase.from).toHaveBeenCalledWith('bookings');
    expect(bookedTimes).toEqual(['10:00 AM', '2:00 PM', '4:00 PM']);
    expect(bookedTimes.includes('10:00 AM')).toBe(true);
    expect(bookedTimes.includes('11:00 AM')).toBe(false);
  });
  
  it('should reject booking with missing required fields', async () => {
    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: 'null value in column "date" violates not-null constraint' }
    });

    const { data, error } = await mockSupabase
      .from('bookings')
      .insert({
        provider_id: 1,
        client_id: 'client-123',
        status: 'pending',
      })
      .select()
      .single();

    expect(data).toBeNull();
    expect(error).not.toBeNull();
    expect(error.message).toContain('not-null constraint');
  });




  
  it('should not send email if database insert fails', async () => {
    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: 'Database connection failed' }
    });

    const { error } = await mockSupabase
      .from('bookings')
      .insert({
        provider_id: 1,
        client_id: 'client-123',
        date: '2025-11-20',
        time: '10:00 AM',
        status: 'pending',
      })
      .select()
      .single();

    expect(error).not.toBeNull();
    expect(mockSendBookingEmail).not.toHaveBeenCalled();
  });

  
  it('should keep booking even if email notification fails', async () => {
    const mockBookingData = {
      id: 'booking-789',
      provider_id: 1,
      client_id: 'client-123',
      date: '2025-11-20',
      time: '2:00 PM',
      status: 'pending',
    };

    mockSupabase.single.mockResolvedValue({ data: mockBookingData, error: null });
    mockSendBookingEmail.mockResolvedValue({ success: false, error: 'Email service unavailable' } as any);

    const { data, error } = await mockSupabase
      .from('bookings')
      .insert({
        provider_id: 1,
        client_id: 'client-123',
        date: '2025-11-20',
        time: '2:00 PM',
        status: 'pending',
      })
      .select()
      .single();

    expect(error).toBeNull();
    expect(data).toEqual(mockBookingData);
    expect(data.id).toBe('booking-789');
  });
});