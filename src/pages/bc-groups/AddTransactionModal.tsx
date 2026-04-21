import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { createTransaction } from "@/api/transaction.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

export default function AddTransactionModal({
  bcGroupId,
  cycles,
  parties,
  open,
  onClose,
}: any) {
  const qc = useQueryClient();

  const { watch, handleSubmit, setValue, register } = useForm({
    defaultValues: {
      type: "",
      cycle_id: "",
      party_id: "",
      party_member_id: "",
      amount: "",
      note: "",
      transaction_date: "",
    },
  });

  const type = watch("type");
  const partyId = watch("party_id");

  const direction = useMemo(() => {
    switch (type) {
      case "member_contribution":
      case "penalty":
        return "in";
      case "party_payout":
        return "out";
      case "adjustment":
        return "in";
      case "personal_use":
        return "out";
      default:
        return null;
    }
  }, [type]);

  const mutation = useMutation({
    mutationFn: createTransaction,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bc-balance", bcGroupId] });
      qc.invalidateQueries({ queryKey: ["transactions", bcGroupId] });
      qc.invalidateQueries({ queryKey: ["cycles", bcGroupId] });
      qc.invalidateQueries({ queryKey: ["parties", bcGroupId] });
      onClose();
    },
  });

  const onSubmit = (data: any) => {
    if (!direction) return;

    mutation.mutate({
      ...data,
      bc_group_id: bcGroupId,
      cycle_id: data.cycle_id
        ? Number(data.cycle_id)
        : undefined,
      party_id: data.party_id
        ? Number(data.party_id)
        : undefined,
      party_member_id: data.party_member_id
        ? Number(data.party_member_id)
        : undefined,
      amount: Number(data.amount),
      direction,
    });
  };

  const selectedParty = parties?.find(
    (p: any) => String(p.id) === partyId
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl max-h-lvh overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* TYPE */}
          <div>
            <Label>Transaction Type</Label>
            <Select
              value={type}
              onValueChange={(val: any) =>
                setValue("type", val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member_contribution">
                  Member Contribution
                </SelectItem>
                <SelectItem value="party_payout">
                  Party Payout
                </SelectItem>
                <SelectItem value="penalty">
                  Penalty
                </SelectItem>
                <SelectItem value="adjustment">
                  Adjustment
                </SelectItem>
                <SelectItem value="personal_use">
                Personal Use
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {direction && (
            <div>
              <Badge
                className={
                  direction === "in"
                    ? "bg-emerald-500 hover:bg-emerald-500"
                    : ""
                }
                variant={
                  direction === "out"
                    ? "destructive"
                    : "default"
                }
              >
                {direction === "in"
                  ? "Inflow"
                  : "Outflow"}
              </Badge>
            </div>
          )}

          <Separator />

          {/* CYCLE */}
          <div>
            <Label>Cycle (Optional)</Label>
            <Select
              onValueChange={(val:any) =>
                setValue("cycle_id", val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Inst" />
              </SelectTrigger>
              <SelectContent>
                {cycles
                  ?.filter(
                    (c: any) => c.status === "open"
                  )
                  .map((c: any) => (
                    <SelectItem
                      key={c.id}
                      value={String(c.id)}
                    >
                      {c.month} {c.year} (Installment{" "}
                      {c.cycle_number})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* PARTY */}
          {(type === "member_contribution" ||
            type === "party_payout") && (
            <div>
              <Label>Party</Label>
              <Select
                onValueChange={(val:any) =>
                  setValue("party_id", val)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Party" />
                </SelectTrigger>
                <SelectContent>
                  {parties?.map((p: any) => (
                    <SelectItem
                      key={p.id}
                      value={String(p.id)}
                    >
                      Party #{p.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* MEMBER */}
          {type === "member_contribution" && (
            <div>
              <Label>Member</Label>
              <Select
                disabled={!partyId}
                onValueChange={(val:any) =>
                  setValue("party_member_id", val)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Member" />
                </SelectTrigger>
                <SelectContent>
                  {selectedParty?.PartyMembers?.map(
                    (m: any) => (
                      <SelectItem
                        key={m.id}
                        value={String(m.id)}
                      >
                        {m.name}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          {/* AMOUNT */}
          <div>
            <Label>Amount</Label>
            <Input
              type="number"
              onChange={(e) =>
                setValue("amount", e.target.value)
              }
            />
          </div>

          <div>
  <Label>Transaction Date</Label>
  <Input
    type="date"
    {...register("transaction_date", { required: true })}
  />
</div>

          {/* NOTE */}
          <div>
            <Label>Note (Optional)</Label>
            <Input
              onChange={(e) =>
                setValue("note", e.target.value)
              }
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!type || !direction || mutation.isPending}
          >
            {mutation.isPending
              ? "Saving..."
              : "Save Transaction"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}