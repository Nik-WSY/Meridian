import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "./components/RequireAuth";
import { RequireRole } from "./components/RequireRole";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SubmitPage from "./pages/SubmitPage";
import QueuePage from "./pages/QueuePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/submit" element={<SubmitPage />} />
        <Route
          path="/queue"
          element={
            <RequireRole role="manager">
              <QueuePage />
            </RequireRole>
          }
        />
      </Route>
    </Routes>
  );
}
