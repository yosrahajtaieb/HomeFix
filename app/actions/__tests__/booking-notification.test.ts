import { describe, it, expect, jest, beforeEach } from '@jest/globals';


jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(),
}));


jest.mock('@/lib/email-service', () => ({
  sendBookingEmail: jest.fn(),
}));

import { sendProviderBookingNotification } from '../booking-actions';
import { createClient } from '@/utils/supabase/server';
import { sendBookingEmail } from '@/lib/email-service';


const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;
const mockSendBookingEmail = sendBookingEmail as jest.MockedFunction<typeof sendBookingEmail>;

describe('Booking Actions - sendProviderBookingNotification', () => {
  let mockSupabase: any;

  beforeEach(() => {

    jest.clearAllMocks();

  
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };

   
    mockCreateClient.mockResolvedValue(mockSupabase);
  });

  
  it('should send provider notification email when booking is created', async () => {

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


    mockSupabase.single.mockResolvedValue({ data: mockBooking });

   
    mockSendBookingEmail.mockResolvedValue({ 
      success: true 
    } as any);

   
    const result = await sendProviderBookingNotification('booking-123');

    
    expect(mockSupabase.from).toHaveBeenCalledWith('bookings');
    expect(mockSupabase.eq).toHaveBeenCalledWith('id', 'booking-123');
    
   
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

    
    expect(result).toEqual({ success: true });
  });

 
  it('should return error when booking does not exist', async () => {
    
    mockSupabase.single.mockResolvedValue({ data: null });

    
    const result = await sendProviderBookingNotification('invalid-id');

    
    
   
    expect(mockSendBookingEmail).not.toHaveBeenCalled();
    
    
    expect(result).toEqual({
      success: false,
      error: 'Booking not found',
    });
  });

  
  it('should return error when client data is missing', async () => {
   
    const incompleteBooking = {
      id: 'booking-123',
      date: '2025-11-15',
      time: '10:00 AM',
      clients: null, 
      providers: {
        name: 'Mike the Plumber',
        email: 'mike@plumber.com',
        category: 'Plumbing',
      },
    };

    mockSupabase.single.mockResolvedValue({ data: incompleteBooking });

  
    const result = await sendProviderBookingNotification('booking-123');

    
    expect(mockSendBookingEmail).not.toHaveBeenCalled();
    expect(result).toEqual({
      success: false,
      error: 'Booking not found',
    });
  });

  
  it('should handle email service failure gracefully', async () => {
   
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

    
    mockSendBookingEmail.mockResolvedValue({
      success: false,
      error: 'Email delivery failed',
    } as any);

    
    const result = await sendProviderBookingNotification('booking-123');

    
    expect(result).toEqual({
      success: false,
      error: 'Email delivery failed',
    });
  });

  
  it('should format booking date in human-readable format', async () => {
    
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
    mockSendBookingEmail.mockResolvedValue({ success: true } as any);


    await sendProviderBookingNotification('booking-123');

   
    expect(mockSendBookingEmail).toHaveBeenCalledWith(
      'providerNewBooking',
      'mike@plumber.com',
      expect.objectContaining({
        date: 'Saturday, November 15, 2025',
      })
    );
  });
});