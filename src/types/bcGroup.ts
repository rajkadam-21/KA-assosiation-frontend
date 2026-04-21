export type BCGroup = {
  id: number;
  name: string;
  total_amount: number;
  months: number;
  party_limit: number;
  monthly_party_amount: number;
  status: "active" | "completed" | "cancelled";
};
