import { api } from "../lib/axios";


export type Cycle = {
  id: number;
  bc_group_id: number;
  cycle_number: number;
  status: "open" | "closed";
  start_date: string;
  end_date: string;
  year: number;
  month: string;
};

export const fetchCyclesByBCGroup = async (
  bcGroupId: number
): Promise<Cycle[]> => {
  const res = await api.get(`/cycleClose/bc-group/${bcGroupId}`);
  return res.data.data;
};


export const closeCycle = async (
  bcGroupId: number,
  cycleId: number,
  force = false
) => {
  const res = api.post(
    `/cycleClose/bc-group/${bcGroupId}/cycle/${cycleId}/close`,
    { force }
  );
  console.log(res)
   return res
};



export const setCycleContribution = async (
  cycleId: number,
  amount: number
) => {
  const res = await api.post(`/cycleClose/${cycleId}/contribution`, {
    amount,
  });
  return res.data;
};

export const getCycleContribution = async (cycleId: number) => {
  const res = await api.get(`/cycleClose/cycle/${cycleId}/contribution`);
  return res.data.data;
};
