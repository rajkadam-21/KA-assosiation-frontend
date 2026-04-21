import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import DashboardLayout from "./components/layout/DashboardLayout";
import BCGroupsPage from "./pages/bc-groups/BCGroupsPage";
import BCGroupsDetail from "./pages/bc-groups/BCGroupDetail";
import UsersPage from "./pages/users/UsersPage";
import { authStore } from "./store/auth.store";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const user = authStore.user;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/bc-groups" />} />
          <Route path="bc-groups" element={<BCGroupsPage />} />
          <Route path="bc-groups/:id" element={<BCGroupsDetail />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
