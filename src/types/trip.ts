export interface TripParticipant {
  userId: string;
  name: string;
  rsvpStatus: 'pending' | 'going' | 'maybe' | 'declined';
  feedback?: 'success' | 'next_time' | null;
}

export interface TripPollOption {
  cafeId: string;
  cafeName: string;
  votes: string[];
}

export interface TripPoll {
  options: TripPollOption[];
  resolved: boolean;
}

export interface Trip {
  _id: string;
  creatorId: string;
  title: string;
  description?: string;
  eventDate: string;
  selectedCafeId: string | null;
  selectedCafeName: string | null;
  status: 'planning' | 'confirmed' | 'completed' | 'cancelled';
  shareableCode: string;
  participants: TripParticipant[];
  poll?: TripPoll;
  createdAt: string;
  updatedAt: string;
}
