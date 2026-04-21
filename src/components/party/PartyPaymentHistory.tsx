import { useQuery } from "@tanstack/react-query";
import { fetchTransactionsByParty } from "@/api/transaction.api";
import { Badge } from "@/components/ui/badge";

export default function PartyPaymentHistory({
  partyId,
}: {
  partyId: number;
}) {
  const { data, isLoading } = useQuery({
    queryKey: ["party-transactions", partyId],
    queryFn: () => fetchTransactionsByParty(partyId),
  });

  if (isLoading)
    return (
      <div className="p-4 text-sm text-muted-foreground">
        Loading history...
      </div>
    );

  if (!data?.length)
    return (
      <div className="p-4 text-sm text-muted-foreground">
        No transactions found.
      </div>
    );

  return (
    <div className="bg-muted/40 p-4">
      <table className="w-full text-sm">
        <thead className="border-b">
          <tr className="text-left">
            <th className="py-2">Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Direction</th>
          </tr>
        </thead>

        <tbody>
          {data.map((t: any) => (
            <tr key={t.id} className="border-b">
              <td className="py-2">
                {new Date(t.transaction_date).toLocaleDateString()}
              </td>

              <td className="capitalize">
                {t.type.replace("_", " ")}
              </td>

              <td className="font-medium">
                ₹ {Number(t.amount).toLocaleString()}
              </td>

              <td>
                {t.direction === "in" ? (
                  <Badge className="bg-emerald-500">
                    In
                  </Badge>
                ) : (
                  <Badge variant="destructive">
                    Out
                  </Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}