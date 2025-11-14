import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/Dashboard.tsx";
import { SubscriptionPage } from "./pages/Subscription.tsx";
import { AddEmployeePage } from "./pages/AddEmployee.tsx";
import { AddDocumentsPage } from "./pages/AddDocuments.tsx";
import { DataSourcesPage } from "./pages/DataSources.tsx";
import { AuthPage } from "./pages/Auth.tsx";
import { SignupPage } from "./pages/Signup.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/subscription"
          element={
            <ProtectedRoute>
              <SubscriptionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/add-employee"
          element={
            <ProtectedRoute>
              <AddEmployeePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/documents"
          element={
            <ProtectedRoute>
              <AddDocumentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/data-sources"
          element={
            <ProtectedRoute>
              <DataSourcesPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
