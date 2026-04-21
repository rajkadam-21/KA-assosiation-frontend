import { api } from "../lib/axios";
import type { TransactionPayload } from "../types/transaction";

export const createTransaction = async (payload: TransactionPayload) => {
  console.log(payload)
  return api.post("/transactions", payload);
};


export const fetchTransactionsByBCGroup = async (bcGroupId: number) => {
  const res = await api.get(`/transactions/bc-group/${bcGroupId}`);
  return res.data.data;
};

export const fetchTransactionsByParty = async (partyId: number) => {
  const res = await api.get(`/transactions/party/${partyId}`);
  return res.data.data;
};

export const fetchBCGroupSummary = async (bcGroupId: number) => {
  const res = await api.get(`/transactions/bc-group/${bcGroupId}/summary`);
  return res.data;
};