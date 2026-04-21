import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Wallet,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { authStore } from "@/store/auth.store";

export default function Sidebar({
  collapsed,
  setCollapsed,
}: {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}) {
  const user = authStore.user;

  const navItems = [
    {
      label: "BC Groups",
      icon: Wallet,
      path: "/bc-groups",
      visible: true,
    },
    {
      label: "Users",
      icon: Users,
      path: "/users",
      visible: user?.role === "admin" || user?.sub_role === "hr",
    },
  ];

  return (
    <aside
      className={cn(
        "relative hidden border-r bg-background transition-all duration-300 md:flex",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex w-full flex-col">
        {/* Logo */}
        <div className="flex h-14 items-center justify-between px-4 border-b">
          {!collapsed && (
            <span className="text-lg font-semibold tracking-tight">
              BC Manager
            </span>
          )}

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map(
            (item) =>
              item.visible && (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted"
                    )
                  }
                >
                  <item.icon className="h-4 w-4 shrink-0" />

                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              )
          )}
        </nav>
      </div>
    </aside>
  );
}