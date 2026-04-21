import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../../components/ui/select";
import {
  useForm,
  useFieldArray,
  useWatch,
} from "react-hook-form";
import { createParty } from "../../api/party.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function AddPartyModal({
  bcGroupId,

  open,
  onClose,
}: {
  bcGroupId: number;

  open: boolean;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [error, setError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      type: "single",
      ticket_no: "",
      members: [
        {
          name: "",
          mobile_no: "",
        },
      ],
      agent: {
        name: "",
        phone: "",
        address: "",
      },
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "members",
  });

  const type = useWatch({
    control,
    name: "type",
  });

  const members = useWatch({
    control,
    name: "members",
  });



  const mutation = useMutation({
    mutationFn: createParty,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["parties", bcGroupId] });
      onClose();
    },
  });

  const onSubmit = (data: any) => {
    

    setError("");

    mutation.mutate({
      bc_group_id: bcGroupId,
      ticket_no: data.ticket_no,
      type: data.type,
      members: data.members,
      agent: data.agent?.phone
        ? data.agent
        : undefined, // ✅ send only if filled
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Party</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >

          <div>
  <Label>Ticket Number</Label>
  <Input
    type="number"
    placeholder="Enter Ticket No"
    {...register("ticket_no", {
      required: true,
      valueAsNumber: true,
    })}
  />
</div>

          {/* PARTY TYPE */}
          <div>
            <Label>Party Type</Label>
            <Select
              value={type}
              onValueChange={(val) =>
                setValue("type", val)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">
                  Single
                </SelectItem>
                <SelectItem value="multiple">
                  Multiple
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />


          {/* MEMBERS */}
          <div className="space-y-4">
            <Label>Members</Label>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-12 gap-3 items-end"
              >
                {/* NAME */}
                <div className="col-span-4">
                  <Input
                    placeholder="Member Name"
                    {...register(
                      `members.${index}.name`,
                      { required: true }
                    )}
                  />
                </div>

                {/* MOBILE (STRING) */}
                <div className="col-span-4">
                  <Input
                    type="tel"
                    placeholder="Mobile No."
                    {...register(
                      `members.${index}.mobile_no`,
                      {
                        required: true,
                      }
                    )}
                  />
                </div>

                {/* AMOUNT */}
             
             

                {/* REMOVE */}
                <div className="col-span-1">
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              </div>
            ))}

            {type === "multiple" && (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    name: "",
                    mobile_no: "",
                
                  })
                }
              >
                + Add Member
              </Button>
            )}
          </div>

          <Separator />

          <div className="space-y-4">
            <Label>Agent Details (Optional)</Label>

            <div className="grid grid-cols-3 gap-3">
              <Input
                placeholder="Agent Name"
                {...register("agent.name")}
              />

              <Input
                placeholder="Agent Phone"
                {...register("agent.phone")}
              />

              <Input
                placeholder="Agent Address"
                {...register("agent.address")}
              />
            </div>
          </div>
          <Separator />

          {/* SUMMARY */}
         
          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? "Creating..."
              : "Create Party"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}