import { Routes, Route, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UtilitiesPage from "./components/Utilities/UtilitiesPage";
import TariffsPage from "./components/Tariffs/TariffsPage";
import BillsPage from "./components/Bills/BillsPage";
import DashboardPage from "./components/Dashboard/DashboardPage";
import LanguageSwitcher from "./components/LanguageSwitcher";

export default function App() {
  const location = useLocation();
  const { t } = useTranslation();

  const nav = [
    { to: "/", label: t("nav.bills") },
    { to: "/dashboard", label: t("nav.dashboard") },
    { to: "/utilities", label: t("nav.utilities") },
    { to: "/tariffs", label: t("nav.tariffs") },
  ];

  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 flex items-center h-14 gap-8">
          <span className="font-bold text-lg text-indigo-600">Paynless</span>
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`text-sm font-medium ${
                location.pathname === n.to
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <LanguageSwitcher />
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
    </div>
  );
}
