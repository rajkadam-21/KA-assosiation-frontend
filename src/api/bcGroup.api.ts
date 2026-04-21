import { api } from "../lib/axios";
import type { BCGroup } from "../types/bcGroup";

export const fetchBCGroups = async (): Promise<BCGroup[]> => {
  const res = await api.get("/bc-groups/");
  console.log(res.data)
  return res.data.data;
};

export const createBCGroup = async (payload: {
  name: string;
  total_amount: number;
  months: number;
  party_limit: number;
  monthly_party_amount: number;
}) => {
    const res = await api.post("/bc-groups/", payload);
    console.log(res)
  return res
};

export const fetchBCGroupById = async (id: number) => {
  const res = await api.get(`/bc-groups/${id}`);
  return res.data.data;
};

