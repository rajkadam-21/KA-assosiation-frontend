import { api } from "../lib/axios";

export const createAuction = async (cycleId: number) => {
  return api.post("/auction/create", { cycle_id: cycleId });
};

export const placeBid = async (payload: {
  auction_id: number;
  party_id: number;
  discount_amount: number;
}) => {
  return api.post("/auction/bid", payload);
};

export const finalizeAuction = async (auctionId: number) => {
  return api.post("/auction/finalize", { auction_id: auctionId });
};

export const fetchAuctionByCycle = async (cycleId: number) => {
  const res = await api.get(`/auction/cycle/${cycleId}`);
  return res.data.data;
};

export const fetchAuctionBids = async (auctionId: number) => {
  const res = await api.get(`/auction/bids/${auctionId}`);
  return res.data.data;
};

export const fetchAuctionLogs = async (auctionId: number) => {
  const res = await api.get(`/auction/logs/${auctionId}`);
  return res.data.data;
};

export const directFinalizeAuction = async (payload: {
  cycle_id: number;
  party_id: number;
  discount_amount: number;
}) => {
  return api.post("/auction/direct-finalize", payload);
};