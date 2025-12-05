import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText, tool, convertToModelMessages, stepCountIs } from 'ai';
import { z } from 'zod';
import { createClient } from '@/utils/supabase/server';

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  console.log("Chat API called");
  const { messages } = await req.json();
  console.log("Messages received:", messages?.length);

  
  const modelMessages = convertToModelMessages(messages);


  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let isProvider = false;
  let providerId: string | null = null;
  
  if (user) {
    const { data: providerData } = await supabase
      .from('providers')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();
    
    if (providerData) {
      isProvider = true;
      providerId = user.id;
    }
  }

  const result = streamText({
    model: openrouter('z-ai/glm-4.5-air:free'),
    messages: modelMessages,
    system: `
    
    Today is ${new Date().toDateString()}.
    
    You are a helpful home service assistant for HomeFix. 
    You help users find service providers based on their needs.
    You can filter by category, price, location, availability, and verification status.
    Always be polite and concise.
    If you find providers, list them with their name, category, price, and rating.
    If no providers are found, suggest broadening the search.
    
    ${isProvider ? 'The current user is a logged-in provider. You can also help them check their schedule and bookings.' : ''}`,
    stopWhen: stepCountIs(5),
    tools: {
      getProviders: tool({
        description: 'Get a list of service providers based on filters',
        inputSchema: z.object({
          category: z.string().optional().describe('The category of service ( Must be one of these: locksmith, hvac, plumbing, electrical)'),
          maxPrice: z.number().optional().describe('The maximum starting price'),
          location: z.string().optional().describe('The location or city'),
          isVerified: z.boolean().optional().describe('Whether the provider is verified/approved'),
        }),
        execute: async ({ category, maxPrice, location, isVerified }) => {
          const supabase = await createClient();
          let query = supabase.from('providers').select('*');

          if (category) {
            query = query.ilike('category', `%${category}%`);
          }
          if (maxPrice) {
            query = query.lte('starting_price', maxPrice);
          }
          if (location) {
            query = query.ilike('location', `%${location}%`);
          }
          if (isVerified !== undefined) {
            query = query.eq('approved', isVerified);
          }
        
          query = query.eq('active', true);

          const { data, error } = await query.limit(5);

          if (error) {
            console.error('Error fetching providers:', error);
            return [];
          }
          
          return data;
        },
      }),
      getProviderSchedule: tool({
        description: 'Get the provider\'s bookings and schedule. Use this when a provider asks about their jobs, bookings, schedule, or appointments. Can filter by date and status.',
        inputSchema: z.object({
          date: z.string().optional().describe('Specific date in YYYY-MM-DD format. Parse natural language dates like "this Friday", "tomorrow", "next Monday" into this format.'),
          status: z.array(z.enum(['pending', 'confirmed', 'rejected', 'completed'])).optional().describe('Filter by booking status. Can be one or more of: pending, confirmed, rejected, completed'),
          dateRange: z.enum(['today', 'this_week', 'this_month', 'upcoming']).optional().describe('Date range filter: today, this_week, this_month, or upcoming (future bookings)'),
        }),
        execute: async ({ date, status, dateRange }) => {
        
          if (!isProvider || !providerId) {
            return {
              error: 'You must be logged in as a provider to view your schedule. Please log in to your provider account.',
              bookings: []
            };
          }

          const supabase = await createClient();
          let query = supabase
            .from('bookings')
            .select(`
              id,
              date,
              time,
              status,
              notes,
              created_at,
              clients:client_id (
                first_name,
                last_name,
                email,
                phone,
                address
              )
            `)
            .eq('provider_id', providerId)
            .order('date', { ascending: true });

      
          if (date) {
            query = query.eq('date', date);
          } else if (dateRange) {
            const today = new Date().toISOString().split('T')[0];
            
            switch (dateRange) {
              case 'today': {
                query = query.eq('date', today);
                break;
              }
              case 'this_week': {
                const startOfWeek = new Date();
                startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
                const endOfWeek = new Date(startOfWeek);
                endOfWeek.setDate(endOfWeek.getDate() + 6);
                query = query.gte('date', startOfWeek.toISOString().split('T')[0])
                           .lte('date', endOfWeek.toISOString().split('T')[0]);
                break;
              }
              case 'this_month': {
                const startOfMonth = new Date();
                startOfMonth.setDate(1);
                const endOfMonth = new Date(startOfMonth);
                endOfMonth.setMonth(endOfMonth.getMonth() + 1);
                endOfMonth.setDate(0);
                query = query.gte('date', startOfMonth.toISOString().split('T')[0])
                           .lte('date', endOfMonth.toISOString().split('T')[0]);
                break;
              }
              case 'upcoming': {
                query = query.gte('date', today);
                break;
              }
            }
          }

       
          if (status && status.length > 0) {
            query = query.in('status', status);
          }

          const { data, error } = await query;

          if (error) {
            console.error('Error fetching provider schedule:', error);
            return {
              error: 'Failed to fetch your schedule. Please try again.',
              bookings: []
            };
          }

          if (!data || data.length === 0) {
            return {
              message: 'No bookings found matching your criteria.',
              bookings: []
            };
          }

          return {
            bookings: data,
            count: data.length
          };
        },
      }),
    },
  });

  return result.toUIMessageStreamResponse();
}
