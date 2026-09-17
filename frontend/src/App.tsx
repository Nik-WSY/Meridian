import { Routes, Route } from "react-router-dom";
import { RequireAuth } from "./components/RequireAuth";
import { RequireRole } from "./components/RequireRole";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import SubmitPage from "./pages/SubmitPage";
import QueuePage from "./pages/QueuePage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<DashboardPage />} />
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