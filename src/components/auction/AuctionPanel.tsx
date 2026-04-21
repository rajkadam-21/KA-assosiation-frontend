import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAuctionByCycle,
  fetchAuctionBids,
  fetchAuctionLogs,
  createAuction,
  placeBid,
  finalizeAuction,
  directFinalizeAuction
} from "@/api/auction.api";
import { useState } from "react";
import { toast } from "sonner";

export default function AuctionPanel({ cycle, parties }: any) {
  const qc = useQueryClient();
  const [selectedParty, setSelectedParty] = useState("");
  const [discount, setDiscount] = useState("");

  const { data: auction } = useQuery({
    queryKey: ["auction", cycle.id],
    queryFn: () => fetchAuctionByCycle(cycle.id),
  });

  const { data: bids } = useQuery({
    queryKey: ["auction-bids", auction?.id],
    queryFn: () => fetchAuctionBids(auction.id),
    enabled: !!auction?.id,
  });

  const { data: logs } = useQuery({
    queryKey: ["auction-logs", auction?.id],
    queryFn: () => fetchAuctionLogs(auction.id),
    enabled: !!auction?.id,
  });

  const createMutation = useMutation({
    mutationFn: () => createAuction(cycle.id),
    onSuccess: () => {
      toast.success("Auction started");
      qc.invalidateQueries({ queryKey: ["auction", cycle.id] });
    },
  });

  const bidMutation = useMutation({
    mutationFn: placeBid,
    onSuccess: () => {
      toast.success("Bid placed");
      qc.invalidateQueries({ queryKey: ["auction-bids", auction?.id] });
    },
  });

  const finalizeMutation = useMutation({
    mutationFn: () => finalizeAuction(auction.id),
    onSuccess: () => {
      toast.success("Auction finalized");
      qc.invalidateQueries({ queryKey: ["auction", cycle.id] });
    },
  });

  const directFinalizeMutation = useMutation({
  mutationFn: directFinalizeAuction,
  onSuccess: () => {
    toast.success("Winner finalized directly");
    qc.invalidateQueries({ queryKey: ["auction", cycle.id] });
    qc.invalidateQueries({ queryKey: ["cycles", cycle.bc_group_id] });
  },
});

  return (
    <Card className="border-muted">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            {cycle.month} {cycle.year}
          </CardTitle>

          {auction && (
            <Badge
              className={
                auction.status === "running"
                  ? "bg-emerald-500 hover:bg-emerald-500"
                  : auction.status === "completed"
                  ? ""
                  : ""
              }
              variant={
                auction.status === "completed"
                  ? "secondary"
                  : "default"
              }
            >
              {auction.status}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {!auction && (
          <Button
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
          >
            Start Auction
          </Button>
        )}

{/* DIRECT FINALIZE SECTION */}
{!auction && (
  <div className="border rounded-lg p-4 space-y-3 bg-muted/40">
    <h4 className="font-medium">
      Direct Finalize Winner
    </h4>

    <div className="flex gap-2">
      <select
        value={selectedParty}
        onChange={(e) =>
          setSelectedParty(e.target.value)
        }
        className="input"
      >
        <option value="" className="dark:bg-black">
          Select Party
        </option>

        {parties?.map((p: any) => (
          <option
            key={p.id}
            value={p.id}
            disabled={p.has_received_prize}
            className="dark:bg-black"
          >
            Party #{p.id}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={discount}
        onChange={(e) =>
          setDiscount(e.target.value)
        }
        className="input"
        placeholder="Discount"
      />

      <button
        className="bg-emerald-600 text-white px-3 py-2 rounded"
        onClick={() =>
          directFinalizeMutation.mutate({
            cycle_id: cycle.id,
            party_id: Number(selectedParty),
            discount_amount:
              Number(discount) || 0,
          })
        }
      >
        Finalize
      </button>
    </div>
  </div>
)}

        {auction?.status === "running" && (
          <>
            <div className="grid md:grid-cols-3 gap-4">
              <Select
                value={selectedParty}
                onValueChange={setSelectedParty}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Party" />
                </SelectTrigger>
                <SelectContent>
                  {parties.map((p: any) => (
                    <SelectItem
                      key={p.id}
                      value={String(p.id)}
                      disabled={p.has_received_prize}
                    >
                      Party #{p.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Discount"
                value={discount}
                onChange={(e) =>
                  setDiscount(e.target.value)
                }
              />

              <Button
                disabled={!selectedParty || !discount}
                onClick={() =>
                  bidMutation.mutate({
                    auction_id: auction.id,
                    party_id: Number(selectedParty),
                    discount_amount: Number(discount),
                  })
                }
              >
                Place Bid
              </Button>
            </div>

            <Button
              variant="destructive"
              onClick={() => finalizeMutation.mutate()}
            >
              Finalize Auction
            </Button>
          </>
        )}

        {bids?.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                Bids
              </h4>

              {bids.map((bid: any) => (
                <div
                  key={bid.id}
                  className={`flex justify-between rounded-md px-3 py-2 text-sm ${
                    bid.status === "winner"
                      ? "bg-emerald-100 dark:bg-emerald-900"
                      : "bg-muted"
                  }`}
                >
                  <span>Party #{bid.party_id}</span>
                  <span className="font-medium">
                    ₹ {Number(bid.discount_amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        {auction?.status === "completed" && (
          <>
            <Separator />
            <div className="rounded-md bg-muted p-4 text-sm">
              <p className="font-medium text-emerald-600">
                Winner: Party #{auction.winning_party_id}
              </p>
              <p>
                Prize: ₹{" "}
                {Number(
                  auction.prize_amount
                ).toLocaleString()}
              </p>
            </div>
          </>
        )}

        {logs?.length > 0 && (
          <>
            <Separator />
            <div className="space-y-1 text-xs text-muted-foreground">
              {logs.map((log: any) => (
                <div key={log.id}>
                  {new Date(
                    log.created_at
                  ).toLocaleString()}{" "}
                  — {log.action}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}