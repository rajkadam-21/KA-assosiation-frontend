export type TransactionType =
  | "member_contribution"
  | "penalty"
  | "party_payout"
  | "member_payout"
  | "adjustment";

export type Direction = "in" | "out";

export type TransactionPayload = {
  bc_group_id: number;
  cycle_id?: number;
  party_id?: number;
  party_member_id?: number;
  amount: number;
  direction: Direction;
  type: TransactionType;
  note?: string;
  transaction_date: string;
};
