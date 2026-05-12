export type BCGroup = {
  id: number;
  name: string;
  total_amount: number;
  months: number;
  party_limit: number;
  monthly_party_amount: number;

  start_month:
    | "january"
    | "february"
    | "march"
    | "april"
    | "may"
    | "june"
    | "july"
    | "august"
    | "september"
    | "october"
    | "november"
    | "december";

  start_year: number;

  status: "active" | "completed" | "cancelled";
};