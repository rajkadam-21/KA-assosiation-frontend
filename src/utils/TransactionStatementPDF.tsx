"use client";

import React, { forwardRef } from "react";
import logo from "@/assets/Logo.png"
const TransactionStatementPDF = forwardRef(
    ({ transactions }: any, ref: any) => {
        let runningBalance = 0;

        return (
            <div
                ref={ref}
                className="p-6 bg-white text-black text-[11px] w-[210mm]"
            >
                {/* 🔹 HEADER */}
                <div className="flex  items-center justify-between border-b pb-3 mb-4">
                    <div>

                        <h1 className="font-bold text-lg">
                            KRISHNARPAN ASSOCIATE
                        </h1>
                        <p>
                            SQUARE LINK MARKET NEAR GOVERNMENT POLYTECHNIC COLLEGE
                        </p>
                        <p>GADGE NAGAR , AMRAVATI</p>
                        <p className="text-xs">
                            Phone: 7038927448
                        </p>

                    </div>
                    <div className="h-50 w-50">
                        <img src={logo} alt="logo" />
                    </div>

                </div>

                {/* 🔹 TITLE */}
                <h2 className="text-center font-bold underline text-base mb-2">
                    Party Statement
                </h2>

                {/* 🔹 TABLE */}
                <table className="w-full border text-[10px]">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border p-1">Date</th>
                            <th className="border p-1">Txn Type</th>
                            <th className="border p-1">Total</th>
                            <th className="border p-1">Received</th>
                            <th className="border p-1">Balance</th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactions.map((t: any) => {
                            const amount = Number(t.amount);

                            if (t.direction === "in") {
                                runningBalance += amount;
                            } else {
                                runningBalance -= amount;
                            }

                            return (
                                <React.Fragment key={t.id}>
                                    {/* MAIN ROW */}
                                    <tr>
                                        <td className="border p-1">
                                            {new Date(t.created_at).toLocaleDateString()}
                                        </td>

                                        <td className="border p-1">
                                            {t.type.replaceAll("_", " ")}
                                        </td>

                                        <td className="border p-1">
                                            ₹ {amount.toLocaleString()}
                                        </td>

                                        <td className="border p-1">
                                            {t.direction === "in"
                                                ? `₹ ${amount.toLocaleString()}`
                                                : "-"}
                                        </td>

                                        <td className="border p-1">
                                            ₹ {runningBalance.toLocaleString()}
                                        </td>
                                    </tr>

                                    {/* 🔥 DESCRIPTION ROW (IMPORTANT) */}
                                    <tr>
                                        <td colSpan={7} className="border px-2 py-1">
                                            <strong>Description:</strong>{" "}
                                            {t.description || "N/A"}
                                            <br />
                                            <strong>Payment Type:</strong>{" "}
                                            {t.payment_type || "Cash"}
                                        </td>
                                    </tr>
                                </React.Fragment>
                            );
                        })}
                    </tbody>
                </table>

                {/* 🔹 TOTAL */}
                <div className="text-right mt-4 font-bold">
                    Total Balance: ₹ {runningBalance.toLocaleString()}
                </div>
            </div>
        );
    }
);

export default TransactionStatementPDF;