"use client";

import React, { forwardRef } from "react";
import logo from "@/assets/Logo.png"
import sign from "@/assets/Sign.png"
const ReceiptPDF = forwardRef(({ data }: any, ref: any) => {

  return (
    <div
      ref={ref}
      className="bg-white p-8 w-[210mm] text-sm text-black"
    >
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold">
            KRISHNARPAN ASSOCIATE
          </h2>
          <p>SQUARE LINK MARKET NEAR GOVERNMENT POLYTECHNIC</p>
          <p>COLLEGE GADGE NAGAR , AMRAVATI</p>
          <p>Phone no. : 7038927448</p>
          <p>Email : bhushanjawarkar007@gmail.com</p>
          <p>State: 27-Maharashtra</p>
        </div>
<div className="h-50 w-50">
  <img src={logo} alt="logo" />
</div>
   
      </div>

      <div className="border-t-2 border-green-600 my-4"></div>

      <h1 className="text-center text-green-600 text-xl font-bold mb-6">
        Payment Receipt
      </h1>

      <div className="flex justify-between">
        {/* LEFT */}
        <div className="w-[48%]">
          <p className="font-bold">Received From</p>
          <p className="font-bold">
            {data?.PartyMember?.name}
          </p>
          <p>Contact No: {data?.mobile || "-"}</p>

          <p className="font-bold mt-4">Description</p>
          <p>GROUP NO {data?.party_id}</p>
          <p>INST NO {data?.installment || "-"}</p>

          <p className="mt-3">
            ( PAYMENT BY {data?.payment_type || "Cash"} )
          </p>

        
        </div>

        {/* RIGHT */}
        <div className="w-[48%] text-right">
          <p className="font-bold">Receipt Details</p>
          <p>Receipt No: {data?.id}</p>
          <p>
            Date:{" "}
            {new Date(data?.created_at).toLocaleDateString()}
          </p>

          <div className="mt-6">
            ₹ {Number(data?.amount).toLocaleString()}
          </div>

          <div className="mt-4">
            For: KRISHNARPAN ASSOCIATE
          </div>

          <div className="mt-10 font-bold">
            Authorized Signatory
          </div>

          <div className="h-50 w-50 ml-50 mt-10">
            <img src={sign} alt="sign" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ReceiptPDF;