import { useQuery } from "@tanstack/react-query";
import { fetchBCGroups } from "@/api/bcGroup.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wallet, Activity, CheckCircle } from "lucide-react";
import CreateBCGroupModal from "./CreateBCGroupModal";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
 import { Skeleton } from "@/components/ui/skeleton";

export default function BCGroupsPage() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["bc-groups"],
    queryFn: fetchBCGroups,
  });

  const stats = useMemo(() => {
    if (!data) return { total: 0, active: 0, completed: 0 };

    return {
      total: data.length,
      active: data.filter((g) => g.status === "active").length,
      completed: data.filter((g) => g.status === "completed").length,
    };
  }, [data]);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            BC Groups
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage and monitor all chit fund groups.
          </p>
        </div>

        <Button onClick={() => setOpen(true)}>
          Create BC Group
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Groups"
          value={stats.total}
          icon={Wallet}
        />
        <StatCard
          title="Active Groups"
          value={stats.active}
          icon={Activity}
        />
        <StatCard
          title="Completed Groups"
          value={stats.completed}
          icon={CheckCircle}
        />
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Groups</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">
                  Total Amount
                </TableHead>
                <TableHead>Months</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
            

{isLoading &&
  Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-4 w-20 ml-auto" />
      </TableCell>
      <TableCell><Skeleton className="h-4 w-10" /></TableCell>
      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
    </TableRow>
  ))}
              {!isLoading && data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No groups found.
                  </TableCell>
                </TableRow>
              )}

              {data?.map((group) => (
                <TableRow
                  key={group.id}
                  className="cursor-pointer hover:bg-muted/50 transition"
                  onClick={() =>
                    navigate(`/bc-groups/${group.id}`)
                  }
                >
                  <TableCell className="font-medium">
                    {group.name}
                  </TableCell>

                  <TableCell className="text-right font-semibold">
                    ₹ {group.total_amount.toLocaleString()}
                  </TableCell>

                  <TableCell>{group.months}</TableCell>

                  <TableCell>
                    <StatusBadge status={group.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <CreateBCGroupModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

/* ----------------------- */
/* Stat Card Component */
/* ----------------------- */

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: any;
}) {
  return (
    <Card className="hover:shadow-md hover:-translate-y-px transition-all duration-200">
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm text-muted-foreground">
            {title}
          </p>
          <p className="text-2xl font-semibold mt-1">
            {value}
          </p>
        </div>
        <Icon className="h-6 w-6 text-muted-foreground" />
      </CardContent>
    </Card>
  );
}

/* ----------------------- */
/* Status Badge */
/* ----------------------- */

function StatusBadge({
  status,
}: {
  status: "active" | "completed" | "cancelled";
}) {
  if (status === "active")
    return <Badge className="bg-emerald-500 hover:bg-emerald-500">Active</Badge>;

  if (status === "completed")
    return <Badge variant="secondary">Completed</Badge>;

  return <Badge variant="destructive">Cancelled</Badge>;
}