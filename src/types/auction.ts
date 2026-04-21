export type Auction = {
  id: number;
  bc_group_id: number;
  cycle_id: number;
  status: "pending" | "running" | "completed" | "cancelled";
  winning_party_id?: number;
  winning_discount?: number;
  prize_amount?: number;
};

export type AuctionBid = {
  id: number;
  auction_id: number;
  party_id: number;
  discount_amount: number;
  status: "active" | "rejected" | "winner";
  created_at: string;
};

export type AuctionLog = {
  id: number;
  auction_id: number;
  action: string;
  description?: string;
  created_at: string;
};