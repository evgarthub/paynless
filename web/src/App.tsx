import { Routes, Route, Link, useLocation } from "react-router-dom";
import UtilitiesPage from "./components/Utilities/UtilitiesPage";
import TariffsPage from "./components/Tariffs/TariffsPage";
import BillsPage from "./components/Bills/BillsPage";

const nav = [
  { to: "/", label: "Bills" },
  { to: "/utilities", label: "Utilities" },
  { to: "/tariffs", label: "Tariffs" },
];

export default function App() {
  const location = useLocation();

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
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<BillsPage />} />
          <Route path="/utilities" element={<UtilitiesPage />} />
          <Route path="/tariffs" element={<TariffsPage />} />
        </Routes>
      </main>
    </div>
  );
}
