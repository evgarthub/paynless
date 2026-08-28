import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import AuthCallback from "./pages/AuthCallback";
import UtilitiesPage from "./components/Utilities/UtilitiesPage";
import TariffsPage from "./components/Tariffs/TariffsPage";
import BillsPage from "./components/Bills/BillsPage";
import DashboardPage from "./components/Dashboard/DashboardPage";
import LanguageSwitcher from "./components/LanguageSwitcher";
import ThemeToggle from "./components/ThemeToggle";

export default function App() {
  const location = useLocation();
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const nav = [
    { to: "/", label: t("nav.bills") },
    { to: "/dashboard", label: t("nav.dashboard") },
    { to: "/utilities", label: t("nav.utilities") },
    { to: "/tariffs", label: t("nav.tariffs") },
  ];

  return (
    <div className="min-h-screen">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-6xl mx-auto px-4 flex items-center h-14 gap-8">
                  <span className="font-bold text-lg text-indigo-600">Paynless</span>
                  {nav.map((n) => (
                    <Link
                      key={n.to}
                      to={n.to}
                      className={`text-sm font-medium ${
                        location.pathname === n.to
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      }`}
                    >
                      {n.label}
                    </Link>
                  ))}
                  <div className="ml-auto flex items-center gap-4">
                    <ThemeToggle />
                    <LanguageSwitcher />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{user?.name || user?.email}</span>
                    <button
                      onClick={logout}
                      className="text-sm text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    >
                      {t("nav.logout")}
                    </button>
                  </div>
                </div>
              </nav>
              <main className="max-w-6xl mx-auto px-4 py-6">
                <Routes>
                  <Route path="/" element={<BillsPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/utilities" element={<UtilitiesPage />} />
                  <Route path="/tariffs" element={<TariffsPage />} />
                </Routes>
              </main>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
