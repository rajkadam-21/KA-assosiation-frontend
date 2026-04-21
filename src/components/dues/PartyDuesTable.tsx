import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import {
  fetchPartyDueByCycle,
} from "@/api/due.api";

export default function PartyDuesTable({
  parties,
  duesMode,
  cycleId,
}: any) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Party Dues</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Party</TableHead>
              <TableHead className="text-right">
                Expected
              </TableHead>
              <TableHead className="text-right">
                Paid
              </TableHead>
              <TableHead className="text-right">
                Remaining
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {parties.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-6 text-muted-foreground"
                >
                  No parties found.
                </TableCell>
              </TableRow>
            )}

            {parties.map((party: any) => (
              <PartyDueRow
                key={party.id}
                party={party}
                duesMode={duesMode}
                cycleId={cycleId}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PartyDueRow({ party, cycleId }: any) {
  const { data } = useQuery({
    queryKey: ["party-due", party.id, cycleId],
    queryFn: () =>
      fetchPartyDueByCycle(party.id, cycleId),
    enabled: !!cycleId, // 🚨 IMPORTANT
  });

  if (!cycleId) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-center">
          Select a cycle
        </TableCell>
      </TableRow>
    );
  }

  const remaining = data?.remaining ?? 0;

  return (
    <TableRow>
      <TableCell>Party #{party.id}</TableCell>

      <TableCell className="text-right">
        ₹ {Number(data?.expected ?? 0).toLocaleString()}
      </TableCell>

      <TableCell className="text-right text-emerald-600">
        ₹ {Number(data?.paid ?? 0).toLocaleString()}
      </TableCell>

      <TableCell className="text-right">
        {remaining > 0 ? (
          <Badge variant="destructive">
            ₹ {remaining.toLocaleString()}
          </Badge>
        ) : (
          <Badge className="bg-emerald-500">
            Cleared
          </Badge>
        )}
      </TableCell>
    </TableRow>
  );
}