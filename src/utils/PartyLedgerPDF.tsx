"use client";

import { forwardRef } from "react";

const PartyLedgerPDF = forwardRef(({ rows }: any, ref: any) => {
  return (
    <div ref={ref} className="p-6 bg-white text-black text-sm w-[210mm]">
      
      {/* 🔹 HEADER */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold">BC GROUP LEDGER</h1>
        <p className="text-xs">Aution List Report</p>
      </div>

      {/* 🔹 TABLE */}
      <table className="w-full border border-gray-400 text-xs">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Group</th>
            <th className="border p-2">Ticket</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Mobile</th>
            <th className="border p-2">App. Date</th>
            <th className="border p-2">Due</th>
            <th className="border p-2">Paid</th>
            <th className="border p-2">Remaining</th>
            <th className="border p-2">Agent</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row: any, i: number) => (
            <tr key={i}>
              <td className="border p-2">{row.groupNo}</td>
              <td className="border p-2">{row.ticket_no}</td>
              <td className="border p-2">{row.memberName}</td>
              <td className="border p-2">{row.mobile}</td>
              <td className="border p-2">
                {row.appliedDate
                  ? new Date(row.appliedDate).toLocaleDateString()
                  : "-"}
              </td>
              <td className="border p-2 text-red-600">
                ₹ {row.due.toLocaleString()}
              </td>
              <td className="border p-2 text-emerald-600">
                ₹ {row.paid.toLocaleString()}
              </td>
              <td className="border p-2">
                ₹ {row.remaining.toLocaleString()}
              </td>
              <td className="border p-2">{row.agentName}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 FOOTER */}
      <div className="mt-4 text-right font-semibold">
        Total Rows: {rows.length}
      </div>
    </div>
  );
});

export default PartyLedgerPDF;