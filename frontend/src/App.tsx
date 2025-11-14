import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/Dashboard.tsx";
import { SubscriptionPage } from "./pages/Subscription.tsx";
import { AddEmployeePage } from "./pages/AddEmployee.tsx";
import { AddDocumentsPage } from "./pages/AddDocuments.tsx";
import { DataSourcesPage } from "./pages/DataSources.tsx";
import { AuthPage } from "./pages/Auth.tsx";
import { SignupPage } from "./pages/Signup.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/subscription" element={<SubscriptionPage />} />
        <Route path="/dashboard/add-employee" element={<AddEmployeePage />} />
        <Route path="/dashboard/documents" element={<AddDocumentsPage />} />
        <Route path="/dashboard/data-sources" element={<DataSourcesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

