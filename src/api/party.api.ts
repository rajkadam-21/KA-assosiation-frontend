import { api } from "../lib/axios";

export const fetchPartiesByBCGroup = async (bcGroupId: number) => {
  const res = await api.get(`/parties/bc-group/${bcGroupId}`);
  console.log("parties :",res)
  return res.data.data;
};


export const createParty = async (payload: {
  bc_group_id: number;
  type: "single" | "multiple";
  ticket_no: number;
  members: {
    name: string;
    mobile_no: string;
    monthly_contribution: number;
    ticket_no: number,
  }[];
  agent?: {
    name: string;
    phone: string;
    address?: string;
  };
}) => {
  return api.post("/parties/", payload);
};