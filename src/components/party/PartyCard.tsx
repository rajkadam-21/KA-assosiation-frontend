import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageCircle, Phone } from "lucide-react";

export default function PartyCard({ party }: any) {
    const totalContribution =
        party.PartyMembers?.reduce(
            (sum: number, m: any) =>
                sum + Number(m.monthly_contribution || 0),
            0
        ) || 0;

    const defaulters =
        party.PartyMembers?.filter(
            (m: any) => m.is_defaulter
        ).length || 0;

    return (
        <Card className="hover:shadow-md transition">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>
                        Party #{party.id}
                    </CardTitle>
                    
                    <div>
                        party ticket no: {party.ticket_no}
                    </div>

                    <div className="flex gap-2">
                        <Badge variant="secondary">
                            {party.type}
                        </Badge>

                        {party.has_received_prize && (
                            <Badge className="bg-emerald-500 hover:bg-emerald-500">
                                Winner
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Summary Row */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                

                    <div>
                        <p className="text-muted-foreground">
                            Members
                        </p>
                        <p className="font-semibold">
                            {party.PartyMembers?.length || 0}
                        </p>
                    </div>

                    <div>
                        <p className="text-muted-foreground">
                            Defaulters
                        </p>
                        <p
                            className={`font-semibold ${defaulters > 0
                                ? "text-red-600"
                                : "text-emerald-600"
                                }`}
                        >
                            {defaulters}
                        </p>
                    </div>
                </div>

                <Separator />

                {/* Members Table */}
                <div className="space-y-2">
                    <p className="text-sm font-medium">
                        Members
                    </p>

                    <div className="space-y-2">
                        {party.PartyMembers?.map((m: any) => {
                            const mobile = m.mobile_no?.replace(/\D/g, ""); // remove non-digits
                            const whatsappNumber = mobile?.startsWith("91")
                                ? mobile
                                : `91${mobile}`; // default India code

                            const message = encodeURIComponent(
                                `Hello ${m.name}, regarding your BC contribution.`
                            );

                            const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

                            return (
                                <div
                                    key={m.id}
                                    className="flex items-center justify-between text-sm rounded-md px-3 py-2 bg-muted/50 hover:bg-muted transition"
                                >
                                    {/* LEFT SIDE */}
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">
                                                {m.name}
                                            </span>

                                            {m.is_defaulter && (
                                                <Badge variant="destructive">
                                                    Defaulter
                                                </Badge>
                                            )}
                                        </div>

                                        {m.mobile_no && (
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Phone size={12} />
                                                {m.mobile_no}
                                            </div>
                                        )}
                                    </div>

                                    {/* RIGHT SIDE */}
                                    <div className="flex items-center gap-3">
                                        <span className="font-semibold">
                                            ₹{" "}
                                            {Number(
                                                m.monthly_contribution ?? 0
                                            ).toLocaleString()}
                                        </span>

                                        {m.mobile_no && (
                                            <a
                                                href={whatsappLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-emerald-600 hover:text-emerald-700 transition"
                                            >
                                                <MessageCircle size={16} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {party.Agent && (
                    <div className="text-sm text-muted-foreground">
                        Agent: {party.Agent.name} ({party.Agent.phone})
                    </div>
                )}
            </CardContent>
        </Card>
    );
}