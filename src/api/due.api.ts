import { api } from "../lib/axios";

// ✅ BC GROUP CYCLE DUES
export const fetchBCGroupCycleDues = async (
  bcGroupId: number,
  cycleId: number
) => {
  const res = await api.get(
    `/dues/bc-group/${bcGroupId}/cycle/${cycleId}`
  );
  return res.data.data;
};

// ✅ PARTY CYCLE DUE
export const fetchPartyDueByCycle = async (
  partyId: number,
  cycleId: number
) => {
  const res = await api.get(
    `/dues/party/${partyId}/cycle/${cycleId}`
  );
  return res.data.data;
};


export const fetchMemberOverallDue = async (memberId: number) => {
  const res = await api.get(`/dues/member/${memberId}/overall`);
  return res.data.data;
};
