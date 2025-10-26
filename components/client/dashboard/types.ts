export type Client = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
};

export type Booking = {
  id: string;
  date: string;
  time: string;
  status: "pending" | "confirmed" | "rejected" | "completed";
  notes: string | null; 
  provider_id: string;
  client_id: string;
  completed_at?: string;
  providers?: {
    name: string;
    category?: string;
  };
};