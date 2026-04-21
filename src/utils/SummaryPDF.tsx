"use client";

import { forwardRef } from "react";

const SummaryPDF = forwardRef(
  ({ summary, data, groupName }: any, ref: any) => {

    console.log(data)
    return (
      <div
        ref={ref}
        className="p-6 bg-white text-black text-sm w-[210mm]"
      >
        {/* 🔹 HEADER */}
        <div className="text-center mb-4 border-b pb-2">
          <h1 className="font-bold text-lg">
            {groupName}
          </h1>
          <p>Summary Report</p>
        </div>

        {/* 🔹 SUMMARY CARDS */}
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div>
            <p className="text-xs">Total Inflow</p>
            <p className="font-bold">
              ₹ {summary?.total_inflow?.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs">Total Outflow</p>
            <p className="font-bold">
              ₹ {summary?.total_outflow?.toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-xs">Balance</p>
            <p className="font-bold">
              ₹ {summary?.balance?.toLocaleString()}
            </p>
          </div>
        </div>

        {/* 🔹 TABLE */}
        <table className="w-full border text-xs">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Date</th>
              <th className="border p-2">Type</th>
              <th className="border p-2">Party</th>
              <th className="border p-2">Member</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Direction</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((t: any) => (
              <tr key={t.id}>
                <td className="border p-2">
                  {new Date(t.transaction_date
                  ).toLocaleDateString()}
                </td>

                <td className="border p-2">
                  {t.type.replaceAll("_", " ")}
                </td>

                <td className="border p-2">
                  {t.Party ? `Party #${t.Party.id}` : "-"}
                </td>

                <td className="border p-2">
                  {t.PartyMember?.name || "-"}
                </td>

                <td className="border p-2">
                  ₹ {Number(t.amount).toLocaleString()}
                </td>

                <td className="border p-2">
                  {t.direction === "in"
                    ? "Inflow"
                    : "Outflow"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
);

export default SummaryPDF;