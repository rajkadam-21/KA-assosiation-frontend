import { useTheme } from "next-themes";
import { authStore } from "@/store/auth.store";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({ collapsed }: { collapsed: boolean }) {
  const { theme, setTheme } = useTheme();
  const user = authStore.user;
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-6 backdrop-blur">
      <div className="text-sm text-muted-foreground">
        Welcome back,
        <span className="ml-1 font-medium text-foreground">
          {user?.name}
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
            className="cursor-pointer"
          >
            {theme === "dark" ? (
              <>
                <Sun className="mr-2 h-4 w-4" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="mr-2 h-4 w-4" />
                Dark Mode
              </>
            )}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer text-destructive"
            onClick={() => {
              authStore.logout();
              navigate("/login");
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}