import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { fetchBCGroupById } from "@/api/bcGroup.api";

import { fetchPartiesByBCGroup } from "@/api/party.api";
import { fetchTransactionsByBCGroup } from "@/api/transaction.api";
import { fetchCyclesByBCGroup, closeCycle, getCycleContribution } from "@/api/cycle.api";
import AddTransactionModal from "./AddTransactionModal";
import AddPartyModal from "./AddPartyModal";
import TransactionsTable from "./TransactionsTable";
import CycleTimeline from "@/components/cycles/CycleTimeline";
import AuctionPanel from "@/components/auction/AuctionPanel";
import PartyDuesTable from "@/components/dues/PartyDuesTable";
import MemberDuesTable from "@/components/dues/MemberDuesTable";
import { useState } from "react";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";
import PartyCard from "@/components/party/PartyCard";
import PartyLedgerTable from "@/components/party/PartyLedgerTable";
import { fetchBCGroupSummary } from "@/api/transaction.api";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import TransactionStatementPDF from "../../utils/TransactionStatementPDF";
import SummaryPDF from "../../utils/SummaryPDF";
import { Input } from "@/components/ui/input";
import { setCycleContribution } from "@/api/cycle.api";

export default function BCGroupDetail() {
    const { id } = useParams();
    const bcGroupId = Number(id);
    const [selectedPartyId, setSelectedPartyId] = useState<string>("all");
    const [txnOpen, setTxnOpen] = useState(false);
    const [partyOpen, setPartyOpen] = useState(false);
    const [selectedCycleId, setSelectedCycleId] = useState<number | null>(null);
    const [cycleAmounts, setCycleAmounts] = useState<{ [key: number]: number }>({});
    const [partySearch, setPartySearch] = useState("");

    const qc = useQueryClient();

    const { data: bcGroup } = useQuery({
        queryKey: ["bc-group", bcGroupId],
        queryFn: () => fetchBCGroupById(bcGroupId),
    });

    const { data: parties } = useQuery({
        queryKey: ["parties", bcGroupId],
        queryFn: () => fetchPartiesByBCGroup(bcGroupId),
    });

    const { data: transactions } = useQuery({
        queryKey: ["transactions", bcGroupId],
        queryFn: () => fetchTransactionsByBCGroup(bcGroupId),
    });

    const { data: cycles } = useQuery({
        queryKey: ["cycles", bcGroupId],
        queryFn: () => fetchCyclesByBCGroup(bcGroupId),
    });


    const { data: summaryData } = useQuery({
        queryKey: ["bc-summary", bcGroupId],
        queryFn: () => fetchBCGroupSummary(bcGroupId),
    });

    const closeCycleMutation = useMutation({
        mutationFn: ({ bcGroupId, cycleId, force }: any) =>
            closeCycle(bcGroupId, cycleId, force),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["cycles", bcGroupId] });
            qc.invalidateQueries({ queryKey: ["bc-balance", bcGroupId] });
        },
    });

    const printRef = useRef(null);

    const handleDownloadPDF = useReactToPrint({
        contentRef: printRef,
        documentTitle: "Transaction Statement",
    });


    const summaryRef = useRef(null);

    const handleSummaryPrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: "Summary Report",
    });


    const setContributionMutation = useMutation({
        mutationFn: ({ cycleId, amount }: any) =>
            setCycleContribution(cycleId, amount),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["cycles", bcGroupId] });
            qc.invalidateQueries({ queryKey: ["cycle-contributions"] }); // ✅ important
        },
    });

    const { data: contributions = {} } = useQuery({
        queryKey: ["cycle-contributions", cycles],
        queryFn: async () => {
            if (!cycles) return {};

            const results: any = {};

            await Promise.all(
                cycles.map(async (cycle: any) => {
                    try {
                        const res = await getCycleContribution(cycle.id);
                        results[cycle.id] = res.amount;
                    } catch (err) {
                        results[cycle.id] = null; // not set yet
                    }
                })
            );

            return results;
        },
        enabled: !!cycles,
    });

    const selectedContribution =
        selectedCycleId !== null
            ? contributions[selectedCycleId]
            : undefined;


    const filteredTransactions =
        selectedPartyId === "all"
            ? transactions || []
            : (transactions || []).filter(
                (t: any) =>
                    String(t.party_id) === selectedPartyId
            );


    const filteredParties =
        (parties || []).filter((party: any) => {
            const text = partySearch.toLowerCase();

            return (
                // party level
                String(party.id).includes(text) ||
                party.ticket_no?.toString().includes(text) ||
                party.Agent?.name?.toLowerCase().includes(text) ||

                // 🔥 member level (important)
                party.PartyMembers?.some((m: any) =>
                    m.name?.toLowerCase().includes(text) ||
                    m.mobile_no?.includes(text)
                )
            );
        });

    if (!bcGroup) return null;
    return (
        <div className="space-y-8">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {bcGroup?.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {bcGroup?.months} months • ₹{" "}
                        {bcGroup?.total_amount?.toLocaleString()}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        Starts from{" "}
                        {bcGroup?.start_month?.charAt(0).toUpperCase() +
                            bcGroup?.start_month?.slice(1)}{" "}
                        {bcGroup?.start_year}
                    </p>
                    <Button
                        variant="outline"
                        onClick={handleDownloadPDF}
                    >
                        Download PDF
                    </Button>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setPartyOpen(true)}>
                        Add Party
                    </Button>
                    <Button onClick={() => setTxnOpen(true)}>
                        Add Transaction
                    </Button>
                </div>
            </div>

            {/* TABS */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="transactions">
                        Transactions
                    </TabsTrigger>
                    <TabsTrigger value="parties">Parties</TabsTrigger>
                    <TabsTrigger value="dues">Dues</TabsTrigger>
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-8">
                    {/* Balance Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <FinanceCard
                            title="Total Inflow"
                            value={summaryData?.summary?.total_inflow ?? 0}
                            positive
                        />

                        <FinanceCard
                            title="Total Outflow"
                            value={summaryData?.summary?.total_outflow ?? 0}
                            negative
                        />

                        <FinanceCard
                            title="Net Balance"
                            value={summaryData?.summary?.balance ?? 0}
                        />
                    </div>

                    {/* Cycles */}
                    {cycles && (
                        <Section title="Cycles">
                            <div className="space-y-4">
                                <CycleTimeline
                                    cycles={cycles}
                                    bcGroupId={bcGroupId} // ✅ pass here
                                    onClose={(bcGroupId, cycleId, force) =>
                                        closeCycleMutation.mutate({ bcGroupId, cycleId, force })
                                    }
                                />

                                {/* ✅ NEW — Contribution Setter */}
                                <div className="space-y-3">
                                    <h3 className="font-medium">Set Cycle Contribution</h3>

                                    {cycles.map((cycle: any) => {
                                        const existingAmount = contributions[cycle.id];

                                        return (
                                            <div
                                                key={cycle.id}
                                                className="flex items-center gap-3"
                                            >
                                                <span className="w-32 text-sm">
                                                    Cycle {cycle.cycle_number}
                                                </span>

                                                {existingAmount ? (
                                                    <>
                                                        {/* 🔒 LOCKED VIEW */}
                                                        <div className="px-3 py-2 border rounded-md bg-muted">
                                                            ₹ {existingAmount.toLocaleString()}
                                                        </div>

                                                        <Badge className="bg-gray-600">
                                                            Locked
                                                        </Badge>
                                                    </>
                                                ) : (
                                                    <>
                                                        {/* ✏️ EDITABLE */}
                                                        <Input
                                                            type="number"
                                                            placeholder="Amount"
                                                            className="w-40"
                                                            value={cycleAmounts[cycle.id] || ""}
                                                            onChange={(e) =>
                                                                setCycleAmounts({
                                                                    ...cycleAmounts,
                                                                    [cycle.id]: Number(e.target.value),
                                                                })
                                                            }
                                                        />

                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                setContributionMutation.mutate({
                                                                    cycleId: cycle.id,
                                                                    amount: cycleAmounts[cycle.id],
                                                                })
                                                            }
                                                            disabled={!cycleAmounts[cycle.id]}
                                                        >
                                                            Save
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </Section>
                    )}

                    {/* Auctions */}
                    {cycles?.map((cycle: any) => (
                        <Section
                            key={cycle.id}
                            title={`Auction – ${cycle.month} ${cycle.year}`}
                        >
                            <AuctionPanel
                                cycle={cycle}
                                parties={parties}
                            />
                        </Section>
                    ))}
                </TabsContent>

                {/* TRANSACTIONS TAB */}
                <TabsContent value="transactions">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Transactions</h2>

                        {/* Party Filter Dropdown */}
                        <div className="w-60">
                            <Select
                                value={selectedPartyId}
                                onValueChange={(val) => setSelectedPartyId(val)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by Party" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value="all">All Parties</SelectItem>

                                    {parties?.map((p: any) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            Party #{p.id}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtered Transactions Table */}
                        {transactions && (
                            <TransactionsTable transactions={filteredTransactions} />
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="parties">

                    <div className="flex justify-between items-center mb-4">
                        <Input
                            placeholder="Search by party, member, mobile, ticket..."
                            value={partySearch}
                            onChange={(e) => setPartySearch(e.target.value)}
                            className="w-80"
                        />
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        {filteredParties.map((party: any) => (
                            <PartyCard key={party.id} party={party} />
                        ))}
                    </div>
                    <div className="mt-5">
                        <PartyLedgerTable
                            bcGroupName={bcGroup?.name}
                            parties={filteredParties}
                            transactions={transactions}
                            totalCycles={bcGroup?.months}
                            contribution={selectedContribution} // ✅ IMPORTANT
                        />
                    </div>
                </TabsContent>

                {/* DUES TAB */}
                <TabsContent value="dues" className="space-y-8">
                    <div className="flex gap-4">
                        <Select
                            onValueChange={(val) =>
                                setSelectedCycleId(Number(val))
                            }
                        >
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Select Cycle" />
                            </SelectTrigger>

                            <SelectContent>
                                {cycles?.map((c: any) => (
                                    <SelectItem key={c.id} value={String(c.id)}>
                                        Cycle {c.cycle_number}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <PartyDuesTable
                        parties={parties || []}
                        cycleId={selectedCycleId}
                    />

                    <MemberDuesTable
                        bcGroupId={bcGroupId}
                        parties={parties || []}
                    />
                </TabsContent>


                <TabsContent value="summary" className="space-y-8">

                    <div className="flex justify-end">
                        <Button onClick={handleSummaryPrint}>
                            Download Summary PDF
                        </Button>
                    </div>

                    {/* SUMMARY CARDS */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <FinanceCard
                            title="Total Inflow"
                            value={summaryData?.summary?.total_inflow ?? 0}
                            positive
                        />

                        <FinanceCard
                            title="Total Outflow"
                            value={summaryData?.summary?.total_outflow ?? 0}
                            negative
                        />

                        <FinanceCard
                            title="Balance"
                            value={summaryData?.summary?.balance ?? 0}
                        />
                    </div>

                    {/* TRANSACTION TABLE */}
                    <Card className="p-0">
                        <table className="w-full text-sm">
                            <thead className="border-b bg-muted">
                                <tr className="text-left">
                                    <th className="p-3">Date</th>
                                    <th>Type</th>
                                    <th>Party</th>
                                    <th>Member</th>
                                    <th>Amount</th>
                                    <th>Direction</th>
                                </tr>
                            </thead>

                            <tbody>
                                {summaryData?.data?.map((t: any) => (
                                    <tr key={t.id} className="border-b hover:bg-muted/40">
                                        <td className="p-3">
                                            {new Date(t.created_at).toLocaleDateString()}
                                        </td>

                                        <td className="capitalize">
                                            {t.type.replaceAll("_", " ")}
                                        </td>

                                        <td>
                                            {t.Party ? `Party #${t.Party.id}` : "-"}
                                        </td>

                                        <td>
                                            {t.PartyMember?.name || "-"}
                                        </td>

                                        <td className="font-medium">
                                            ₹ {Number(t.amount).toLocaleString()}
                                        </td>

                                        <td>
                                            {t.direction === "in" ? (
                                                <Badge className="bg-emerald-500">
                                                    Inflow
                                                </Badge>
                                            ) : (
                                                <Badge variant="destructive">
                                                    Outflow
                                                </Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {!summaryData?.data?.length && (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center">
                                            No transactions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Card>
                </TabsContent>

            </Tabs>

            <AddTransactionModal
                bcGroupId={bcGroupId}
                cycles={cycles}
                parties={parties}
                open={txnOpen}
                onClose={() => setTxnOpen(false)}
            />

            <AddPartyModal
                bcGroupId={bcGroupId}
                open={partyOpen}
                onClose={() => setPartyOpen(false)}
            />

            <div className="hidden">
                <TransactionStatementPDF
                    ref={printRef}
                    transactions={filteredTransactions}
                    bcGroupName={bcGroup?.name}
                    selectedPartyId={selectedPartyId}
                />
            </div>

            <div className="hidden">
                <SummaryPDF
                    ref={summaryRef}
                    summary={summaryData?.summary}
                    data={summaryData?.data || []}
                    groupName={bcGroup?.name}
                />
            </div>


        </div>
    );
}

/* -------------------- */
/* Section Wrapper */
/* -------------------- */

function Section({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

/* -------------------- */
/* Finance Card */
/* -------------------- */

function FinanceCard({
    title,
    value,
    positive,
    negative,
}: {
    title: string;
    value: number;
    positive?: boolean;
    negative?: boolean;
}) {
    return (
        <Card className="hover:shadow-md hover:-translate-y-px transition-all duration-200">
            <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">{title}</p>
                <p
                    className={`text-2xl font-semibold mt-1 ${positive
                        ? "text-emerald-600"
                        : negative
                            ? "text-red-600"
                            : ""
                        }`}
                >
                    ₹ {value.toLocaleString()}
                </p>
            </CardContent>
        </Card>
    );
}
