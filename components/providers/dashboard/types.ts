export type Provider = {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  category: string;
  starting_price?: number;
  available_from?: string;
  rating?: number;
  reviewCount?: number;
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
  clients?: {
    first_name: string;
    last_name: string;
    address: string;
  };
};

export type Review = {
  id: string;
  provider_id: string;
  client_id: string;
  rating: number;
  date: string;
  comment: string;
  clients?: {
    first_name: string;
    last_name: string;
  };
};