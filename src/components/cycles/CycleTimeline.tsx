import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Cycle = {
  id: number;
  cycle_number: number;
  status: "open" | "closed";
  month: string;
  year: number;
};

export default function CycleTimeline({
  cycles,
  onClose,
  bcGroupId,
}: {
  cycles: Cycle[];
  onClose: (bcGroupId: number, cycleId: number, force: boolean) => void;
  bcGroupId: number;
}) {
  return (
    <div className="space-y-4">
      {cycles.map((cycle) => (
        <Card
          key={cycle.id}
          className="p-4 hover:shadow-sm transition"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">
                  {cycle.month} {cycle.year}
                </p>

                {cycle.status === "open" ? (
                  <Badge className="bg-emerald-500 hover:bg-emerald-500">
                    Open
                  </Badge>
                ) : (
                  <Badge variant="secondary">
                    Closed
                  </Badge>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-1">
                Installment {cycle.cycle_number}
              </p>
            </div>

            {cycle.status === "open" && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onClose(bcGroupId, cycle.id, false)
                  }
                >
                  Close
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() =>
                    onClose(bcGroupId, cycle.id, true)
                  }
                >
                  Force Close
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}