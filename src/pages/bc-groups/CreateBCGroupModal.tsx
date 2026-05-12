import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { createBCGroup } from "@/api/bcGroup.api";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

export default function CreateBCGroupModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const qc = useQueryClient();

  const { register, handleSubmit, watch, reset } = useForm({
  defaultValues: {
  name: "",
  months: 0,
  party_limit: 0,
  monthly_party_amount: 0,

  start_month: "january",
  start_year: new Date().getFullYear(),
},
  });

  const months = watch("months");
  const monthly = watch("monthly_party_amount");

  const totalAmount = useMemo(() => {
    return Number(months || 0) * Number(monthly || 0);
  }, [months, monthly]);

  const mutation = useMutation({
    mutationFn: createBCGroup,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bc-groups"] });
      reset();
      onClose();
    },
  });

  const onSubmit = (data: any) => {
mutation.mutate({
  name: data.name,
  months: Number(data.months),
  party_limit: Number(data.party_limit),
  monthly_party_amount: Number(data.monthly_party_amount),
  total_amount: totalAmount,

  start_month: data.start_month, // ✅ NEW
  start_year: Number(data.start_year), // ✅ NEW
});
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create BC Group</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* BASIC INFO */}
          <div className="space-y-4">
            <div>
              <Label>Group Name</Label>
              <Input {...register("name")} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Months</Label>
                <Input
                  type="number"
                  {...register("months", { valueAsNumber: true })}
                />
              </div>

              <div>
                <Label>Party Limit</Label>
                <Input
                  type="number"
                  {...register("party_limit", {
                    valueAsNumber: true,
                  })}
                />
              </div>
            </div>

            <div>
              <Label>Monthly Party Amount</Label>
              <Input
                type="number"
                {...register("monthly_party_amount", {
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>

<div className="grid grid-cols-2 gap-4">
  <div>
    <Label>Start Month</Label>

    <select
      {...register("start_month")}
      className="w-full border rounded-md h-10 px-3 bg-background"
    >
      <option value="january">January</option>
      <option value="february">February</option>
      <option value="march">March</option>
      <option value="april">April</option>
      <option value="may">May</option>
      <option value="june">June</option>
      <option value="july">July</option>
      <option value="august">August</option>
      <option value="september">September</option>
      <option value="october">October</option>
      <option value="november">November</option>
      <option value="december">December</option>
    </select>
  </div>

  <div>
    <Label>Start Year</Label>

    <Input
      type="number"
      {...register("start_year", {
        valueAsNumber: true,
      })}
    />
  </div>
</div>

          <Separator />

          {/* CALCULATED TOTAL */}
          <div className="rounded-md bg-muted p-4 text-sm">
            <p className="text-muted-foreground">
              Calculated Total Amount
            </p>
            <p className="text-lg font-semibold mt-1">
              ₹ {totalAmount.toLocaleString()}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Creating..."
              : "Create Group"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}