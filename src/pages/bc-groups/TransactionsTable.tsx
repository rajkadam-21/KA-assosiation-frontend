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
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import ReceiptPDF from "../../utils/ReceiptPDF";


export default function TransactionsTable({ transactions }: any) {

  const printRef = useRef(null);
  const [selectedTxn, setSelectedTxn] = useState<any>(null);
  const [search, setSearch] = useState("");
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Receipt",
  });

const filteredTransactions = (transactions || []).filter((t: any) => {
  const text = search.toLowerCase();

  return (
    t.PartyMember?.name?.toLowerCase().includes(text) ||
    String(t.party_id || "").includes(text)
  );
});



  return (
    <Card>
      <div className="p-4 flex justify-end">
  <input
    type="text"
    placeholder="Search by member or party..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border rounded-md px-3 py-2 text-sm 
    bg-background text-foreground border-border 
    focus:outline-none focus:ring-2 focus:ring-primary w-72"
  />
</div>

      <CardHeader>
        <CardTitle>Transaction Ledger</CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Party</TableHead>
              <TableHead>Member</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Direction</TableHead>
              <TableHead className="text-right">Receipt</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredTransactions?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  No transactions recorded.
                </TableCell>
              </TableRow>
            )}

            {filteredTransactions?.map((t: any) => (
              <TableRow
                key={t.id}
                className="group hover:bg-muted/50 transition cursor-pointer"
              >
                <TableCell className="text-muted-foreground">
                  {new Date(t.transaction_date).toLocaleDateString()}
                </TableCell>

                <TableCell className="capitalize">
                  {t.type.replaceAll("_", " ")}
                </TableCell>

                <TableCell>
                  {t.party_id ? `Party #${t.party_id}` : "-"}
                </TableCell>

                <TableCell>
                  {t.PartyMember?.name}
                </TableCell>

                <TableCell
                  className={`text-right font-semibold ${t.direction === "in"
                    ? "text-emerald-600"
                    : "text-red-600"
                    }`}
                >
                  ₹ {Number(t.amount).toLocaleString()}
                </TableCell>

                <TableCell className="text-center">
                  {t.direction === "in" ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-500">
                      Inflow
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      Outflow
                    </Badge>
                  )}

                </TableCell>

                <TableCell className="text-right">
                  <Button
                    size="icon"
                    variant="ghost"
                    className=" transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTxn(t);

                      setTimeout(() => {
                        handlePrint();
                      }, 100);
                    }}
                  >
                    <Printer size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <div className="hidden">
        {selectedTxn && (
          <ReceiptPDF ref={printRef} data={selectedTxn} />
        )}
      </div>

    </Card>
  );
}