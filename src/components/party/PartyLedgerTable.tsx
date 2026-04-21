import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import PartyPaymentHistory from "./PartyPaymentHistory";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PartyLedgerPDF from "../../utils/PartyLedgerPDF";
import { useQuery } from "@tanstack/react-query";
import { fetchMemberOverallDue } from "@/api/due.api";

export default function PartyLedgerTable({
  bcGroupName,
  parties,
}: any) {

  const [expandedParty, setExpandedParty] = useState<number | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [dueFilter, setDueFilter] = useState<string>("all");



  // ✅ STEP 1 — CREATE ROWS
 const rows =
  parties?.flatMap((party: any) =>
    party.PartyMembers?.map((member: any) => {
      const { data } = useQuery({
        queryKey: ["member-overall-due", member.id],
        queryFn: () => fetchMemberOverallDue(member.id),
      });

      const paid = data?.paid ?? 0;
      const remaining = data?.remaining ?? 0;

      return {
        groupName: bcGroupName,
        partyId: party.id,
        ticket_no: party.ticket_no,
        partyName: party.name || `Party ${party.id}`,
        memberName: member.name,
        mobile: member.mobile_no,
        appliedDate: member.created_at,
        due: remaining > 0 ? remaining : 0,
        status: party.has_received_prize ? "Winner" : "Active",
        paid,
        remaining,
        agentName: party.Agent?.name || "-",
        memberId: member.id,
      };
    })
  ) ?? [];
  console.log(rows.due);
  // ✅ STEP 2 — UNIQUE AGENTS
  const agents = [
    "all",
    ...Array.from(
      new Set(
        rows
          .map((r: any) => r.agentName)
          .filter((a: string) => a && a !== "-")
      )
    ),
  ];

  // ✅ STEP 3 — FILTER LOGIC
  const filteredRows = rows
    // Agent filter
    .filter((r: any) =>
      selectedAgent === "all"
        ? true
        : r.agentName === selectedAgent
    )

    // 🔥 NEW — Due filter
    .filter((r: any) => {
      if (dueFilter === "pending") return r.due > 0;
      if (dueFilter === "paid") return r.due === 0;
      return true;
    })

    // Search filter
    .filter((r: any) => {
      const searchText = search.toLowerCase();

      return (
        r.memberName?.toLowerCase().includes(searchText) ||
        r.mobile?.includes(searchText) ||
        String(r.partyId).includes(searchText) ||
        r.agentName?.toLowerCase().includes(searchText)
      );
    });

  const printRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Party Ledger",
  });


  return (
    <Card className="p-0 overflow-hidden">
      <div className="overflow-x-auto">

        {/* ✅ FILTER UI */}
        <div className="p-4 flex gap-4 justify-between">
          <select
            className="border rounded-md px-5 py-2  text-sm dark:bg-black dark:text-white"
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
          >
            {(agents as string[]).map((agent: string) => (
              <option key={agent} value={agent}>
                {agent === "all" ? "All Agents" : agent}
              </option>
            ))}
          </select>

          <select
            className="border rounded-md px-5 py-2 text-sm dark:bg-black dark:text-white"
            value={dueFilter}
            onChange={(e) => setDueFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Due Pending</option>
            <option value="paid">Fully Paid</option>
          </select>


          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm 
  bg-background text-foreground border-border 
  focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button onClick={handlePrint}>
          Export PDF
        </Button>


        {/* ✅ TABLE */}
        <table className="w-full text-sm">
          <thead className="bg-muted border-b sticky top-0">
            <tr className="text-left">
              <th className="p-3">Group No</th>
              <th>Ticket No.</th>
              <th>Member Name</th>
              <th>Mobile</th>
              <th>Applied Date</th>
              <th>Due</th>
              <th>Status</th>
              <th>Cust Share Paid</th>
              <th>Remaining</th>
              <th>Agent</th>
            </tr>
          </thead>

          <tbody>
            {filteredRows.map((row: any, index: number) => (
              <React.Fragment key={index}>

                {/* MAIN ROW */}
                <tr
                  onClick={() =>
                    setExpandedParty(
                      expandedParty === row.partyId
                        ? null
                        : row.partyId
                    )
                  }
                  className="border-b hover:bg-muted/40 cursor-pointer transition"
                >
                  <td className="p-3 font-medium">
                    {row.groupName}
                  </td>

                  <td>
                    {row.ticket_no}
                  </td>

                  <td>{row.memberName}</td>

                  <td>
                    <a
                      href={`tel:${row.mobile}`}
                      className="text-blue-600 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {row.mobile}
                    </a>
                  </td>

                  <td>
                    {row.appliedDate
                      ? new Date(row.appliedDate).toLocaleDateString()
                      : "-"}
                  </td>

                  <td
                    className={cn(
                      "font-medium",
                      row.due > 0
                        ? "text-red-600"
                        : "text-emerald-600"
                    )}
                  >
                    ₹ {row.due.toLocaleString()}
                  </td>

                  <td>
                    {row.status === "Winner" ? (
                      <Badge className="bg-emerald-500">
                        Prized
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        Non Prize
                      </Badge>
                    )}
                  </td>

                  <td className="font-medium text-emerald-600">
                    ₹ {row.paid.toLocaleString()}
                  </td>

                  <td
                    className={cn(
                      "font-semibold",
                      row.remaining > 0
                        ? "text-red-600"
                        : "text-emerald-600"
                    )}
                  >
                    ₹ {row.remaining.toLocaleString()}
                  </td>

                  <td>{row.agentName}</td>
                </tr>

                {/* EXPANDED ROW */}
                {expandedParty === row.partyId && (
                  <tr>
                    <td colSpan={10} className="bg-muted/30">
                      <PartyPaymentHistory partyId={row.partyId} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {filteredRows.length === 0 && (
              <tr>
                <td
                  colSpan={10}
                  className="p-6 text-center text-muted-foreground"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="hidden">
        <PartyLedgerPDF ref={printRef} rows={filteredRows} />
      </div>
    </Card>
  );
}