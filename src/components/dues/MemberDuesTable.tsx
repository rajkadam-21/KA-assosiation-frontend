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
  fetchBCGroupCycleDues,
  fetchMemberOverallDue,
} from "@/api/due.api";

export default function MemberDuesTable({
  bcGroupId,
  parties,
  cycleId,
}: any) {

  // 🔹 Cycle based data
  const { data: cycleData, isLoading: cycleLoading } = useQuery({
    queryKey: ["bc-cycle-dues-members", bcGroupId, cycleId],
    queryFn: () => fetchBCGroupCycleDues(bcGroupId, cycleId),
    enabled: !!cycleId,
  });

  // 🔹 All members (for overall mode)
  const members =
    parties?.flatMap((p: any) => p.PartyMembers || []) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Dues</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead className="text-right">Expected</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Remaining</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>

            {/* ========================= */}
            {/* ✅ CYCLE MODE */}
            {/* ========================= */}
            {cycleId && (
              <>
                {cycleLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      Loading...
                    </TableCell>
                  </TableRow>
                )}

                {!cycleLoading &&
                  cycleData?.members?.map((m: any) => (
                    <TableRow key={m.member_id}>
                      <TableCell>{m.name}</TableCell>

                      <TableCell className="text-right">
                        ₹ {m.expected.toLocaleString()}
                      </TableCell>

                      <TableCell className="text-right text-emerald-600">
                        ₹ {m.paid.toLocaleString()}
                      </TableCell>

                      <TableCell className="text-right">
                        {m.remaining > 0 ? (
                          <Badge variant="destructive">
                            ₹ {m.remaining.toLocaleString()}
                          </Badge>
                        ) : (
                          <Badge className="bg-emerald-500">
                            Cleared
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            )}

            {/* ========================= */}
            {/* ✅ OVERALL MODE */}
            {/* ========================= */}
            {!cycleId &&
              members.map((member: any) => (
                <MemberOverallRow key={member.id} member={member} />
              ))}

          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

/* ========================= */
/* ✅ MEMBER OVERALL ROW */
/* ========================= */

function MemberOverallRow({ member }: any) {
  const { data, isLoading } = useQuery({
    queryKey: ["member-overall-due", member.id],
    queryFn: () => fetchMemberOverallDue(member.id),
  });

  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={4} className="text-center py-4">
          Loading...
        </TableCell>
      </TableRow>
    );
  }

  const expected = data?.expected ?? 0;
  const paid = data?.paid ?? 0;
  const remaining = data?.remaining ?? 0;

  return (
    <TableRow>
      <TableCell>{member.name}</TableCell>

      <TableCell className="text-right">
        ₹ {expected.toLocaleString()}
      </TableCell>

      <TableCell className="text-right text-emerald-600">
        ₹ {paid.toLocaleString()}
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