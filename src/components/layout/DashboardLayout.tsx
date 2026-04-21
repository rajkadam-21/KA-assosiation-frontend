import { Outlet } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { motion } from "framer-motion";

<main className="flex-1 overflow-y-auto">
  <div className="mx-auto w-full max-w-7xl px-6 py-8">
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Outlet />
    </motion.div>
  </div>
</main>
export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="flex h-screen overflow-hidden">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="flex flex-1 flex-col overflow-hidden">
          <Header collapsed={collapsed} />

         <main className="flex-1 overflow-y-auto">
  <div className="mx-auto w-full max-w-7xl px-6 py-8">
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Outlet />
    </motion.div>
  </div>
</main>
        </div>
      </div>
    </div>
  );
}