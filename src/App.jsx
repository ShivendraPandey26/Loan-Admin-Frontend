
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
  LayoutDashboard,
  Landmark,
  Users,
  Search,
  Bell,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  LogOut,
} from "lucide-react";

import Login from "./pages/Login";
import Products from "./pages/Products";
import Applicants from "./pages/Applicants";
import ApplicantDetails from "./pages/ApplicantDetails";
import api from "./lib/api";
import CreateApplicant from "./pages/CreateApplicant";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import DashboardStats from "./components/dashboard/DashboardStats";
import RecentApplicants from "./components/dashboard/RecentApplicants";
import ProductDetails from "./pages/ProductDetails";

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Loan products", icon: Landmark },
  { label: "Applicants", icon: Users },
];

function App() {
  const [account, setAccount] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function checkAuth() {
      const token = localStorage.getItem("loan_admin_token");

      if (!token) {
        if (!cancelled) setCheckingAuth(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        const accountData =
          response.data?.account ??
          response.data?.data?.account ??
          response.data?.data;

        if (!accountData?.role) {
          throw new Error("Invalid account response");
        }

        if (!cancelled) {
          setAccount(accountData);
        }
      } catch (error) {
        console.error(
          "Session check failed:",
          error.response?.status,
          error.response?.data || error.message
        );

        if ([401, 403].includes(error.response?.status)) {
          localStorage.removeItem("loan_admin_token");
        }

        if (!cancelled) {
          setAccount(null);
        }
      } finally {
        if (!cancelled) {
          setCheckingAuth(false);
        }
      }
    }

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogin(accountData) {
    setAccount(accountData);
  }

  function handleLogout() {
    localStorage.removeItem("loan_admin_token");
    setAccount(null);
  }


  if (checkingAuth) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f7f8fa] px-5">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#d5dbe4] border-t-[#294f80]" />

        <p className="mt-4 text-[13px] font-semibold text-[#344054]">
          Checking your session
        </p>

        <p className="mt-1 text-[12px] text-[#7b8493]">
          Please wait while we verify your access.
        </p>
      </div>
    );
  }


  if (!account) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route
        path="/applicants/:id"
        element={<ApplicantDetails />}
      />

      <Route
        path="*"
        element={
          <Dashboard
            account={account}
            onLogout={handleLogout}
          />
        }
      />

      <Route
        path="/applicants/new"
        element={<CreateApplicant />}
      />

      <Route
        path="/products/new"
        element={<CreateProduct />}
      />

      <Route
        path="/products/:id/edit"
        element={<EditProduct />}
      />

      <Route
        path="/products/:id"
        element={<ProductDetails />}
      />

      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
    </Routes>
  );
}

function Dashboard({ account, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [activePage, setActivePage] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [dashboardStats, setDashboardStats] = useState({
    products: null,
    applicants: null,
  });

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState("");

  const [recentApplicants, setRecentApplicants] = useState([]);
  const [recentLoading, setRecentLoading] = useState(true);
  const [recentError, setRecentError] = useState("");


  useEffect(() => {
    let cancelled = false;

    async function loadDashboardStats() {
      setDashboardLoading(true);
      setDashboardError("");

      try {
        const [productsResponse, applicantsResponse] =
          await Promise.all([
            api.get("/products"),
            api.get("/applicants", {
              params: { page: 1, limit: 1 },
            }),
          ]);

        const productData = productsResponse.data?.data;
        const products = Array.isArray(productData)
          ? productData
          : productData?.products ?? [];

        const applicantData = applicantsResponse.data?.data;
        const pagination = applicantsResponse.data?.pagination;

        if (!cancelled) {
          setDashboardStats({
            products:
              pagination === undefined && !Array.isArray(productData)
                ? products.length
                : products.length,
            applicants:
              pagination?.total ??
              (Array.isArray(applicantData)
                ? applicantData.length
                : applicantData?.applicants?.length ?? 0),
          });
        }
      } catch (error) {
        if (!cancelled) {
          setDashboardError(
            error.response?.data?.message ||
            "Unable to load dashboard statistics."
          );
        }
      } finally {
        if (!cancelled) {
          setDashboardLoading(false);
        }
      }
    }

    loadDashboardStats();

    return () => {
      cancelled = true;
    };
  }, []);


  useEffect(() => {
    let cancelled = false;

    async function loadRecentApplicants() {
      try {
        const response = await api.get("/applicants", {
          params: { page: 1, limit: 5 },
        });

        const data = response.data?.data;
        const applicants = Array.isArray(data)
          ? data
          : data?.applicants ?? [];

        if (!cancelled) {
          setRecentApplicants(applicants);
        }
      } catch (error) {
        if (!cancelled) {
          setRecentError(
            error.response?.data?.message ||
            "Unable to load recent applicants."
          );
        }
      } finally {
        if (!cancelled) {
          setRecentLoading(false);
        }
      }
    }

    loadRecentApplicants();

    return () => {
      cancelled = true;
    };
  }, []);

  const pageDescriptions = {
    Overview: "Review loan products and applicant eligibility.",
    "Loan products": "Manage product criteria and lending requirements.",
    Applicants: "Review applicant details and eligibility status.",
  };

  const pageTitle =
    location.pathname === "/" ? activePage : activePage;

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#202631]">
      {sidebarOpen && (
        <button
          aria-label="Close navigation overlay"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-62 flex-col border-r border-[#e4e7ec] bg-white transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex h-18 items-center gap-3 border-b border-[#e9ebef] px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#233b63] text-white">
            <Landmark size={19} strokeWidth={1.8} />
          </div>

          <div>
            <p className="text-[14px] font-semibold tracking-[-0.3px]">
              Loan Administration
            </p>
            <p className="mt-0.5 text-[11px] text-[#858c98]">
              Internal workspace
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
            className="ml-auto rounded-md p-1 text-[#667085] hover:bg-[#f2f4f7] lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-3 pt-7">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[1.3px] text-[#9299a5]">
            Workspace
          </p>

          <nav className="space-y-1" aria-label="Main navigation">
            {navigation.map(({ label, icon: Icon }) => {
              const active = activePage === label;

              return (
                <button
                  key={label}
                  onClick={() => {
                    setActivePage(label);
                    setSidebarOpen(false);

                    if (location.pathname !== "/") {
                      navigate("/");
                    }
                  }}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-[13px] transition-colors ${active
                    ? "bg-[#edf2f8] font-semibold text-[#233b63]"
                    : "text-[#616a78] hover:bg-[#f6f7f9] hover:text-[#202631]"
                    }`}
                >
                  <Icon size={17} strokeWidth={1.8} />
                  <span>{label}</span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#345581]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>


        <div className="mt-auto border-t border-[#e5e7eb] px-3 py-4">
          <div className="flex items-center gap-3 rounded-md border border-[#e5e7eb] bg-[#fafbfc] px-3 py-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#dce3ed] bg-[#edf2f8] text-[12px] font-semibold tracking-wide text-[#344b70]">
              {(account?.name || "Admin").slice(0, 2).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold leading-5 text-[#202939]">
                {account?.name || "Admin"}
              </p>
              <p className="mt-0.5 truncate text-[11px] font-medium text-[#7b8493]">
                {account?.role}
              </p>
            </div>

            <ShieldCheck
              size={16}
              className="shrink-0 text-[#7b8493]"
            />
          </div>

          <button
            onClick={onLogout}
            className="mt-2 flex w-full items-center gap-2 rounded-md border border-transparent px-3 py-2.5 text-left text-[12px] font-medium text-[#a33c35] transition-colors duration-150 hover:border-[#f0d8d5] hover:bg-[#fff7f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a33c35] focus-visible:ring-offset-2"
          >
            <LogOut size={15} />
            <span>Sign out</span>
          </button>
        </div>

      </aside>

      <div className="min-h-screen lg:pl-62">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[#e4e7ec] bg-white/95 px-4 backdrop-blur-sm sm:px-7">
          <div className="flex items-center gap-3">
            <button
              aria-label="Open navigation"
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-2 text-[#525c6b] hover:bg-[#f2f4f7] lg:hidden"
            >
              <Menu size={19} />
            </button>

            <span className="hidden text-[12px] text-[#858c98] sm:inline">
              Workspace
            </span>

            <ChevronRight
              size={14}
              className="hidden text-[#a0a6b0] sm:block"
            />

            <span className="text-[12px] font-medium">
              {pageTitle}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#d8e0eb] bg-[#edf2f8] text-[12px] font-semibold tracking-wide text-[#344b70]">
              {(account?.name || "").slice(0, 2).toUpperCase()}
            </div>

            <span className="max-w-35 truncate text-[13px] font-semibold text-[#202939]">
              {account?.name || ""}
            </span>
          </div>

        </header>

        <main className="mx-auto max-w-360 px-4 py-7 sm:px-7 sm:py-9">
          <div className="flex flex-col justify-between gap-5 border-b border-[#e5e7eb] pb-6 sm:flex-row sm:items-end">
            <div className="min-w-0">
              <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-[1.5px] text-[#7b8493]">
                Loan operations
              </p>

              <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.7px] text-[#182230] sm:text-[30px]">
                {activePage}
              </h1>

              <p className="mt-2 max-w-xl text-[13px] leading-6 text-[#667085]">
                {pageDescriptions[activePage]}
              </p>
            </div>

            <div className="inline-flex w-fit shrink-0 items-center gap-2 rounded-md border border-[#e2e7ed] bg-white px-3 py-2 text-[11px] font-medium text-[#475467]">
              <span className="h-2 w-2 rounded-full bg-[#32936f]" />
              Authenticated session
            </div>
          </div>


          {activePage === "Overview" && (
            <>
              <DashboardStats
                stats={dashboardStats}
                loading={dashboardLoading}
                error={dashboardError}
              />

              <RecentApplicants
                applicants={recentApplicants}
                loading={recentLoading}
                error={recentError}
                onViewAll={() => setActivePage("Applicants")}
              />
            </>
          )}

          {activePage === "Loan products" && <Products />}

          {activePage === "Applicants" && <Applicants />}

          {search.trim() && (
            <p className="mt-4 text-[12px] text-[#858c98]">
              Workspace-wide search is not implemented yet.
            </p>
          )}

          <footer className="mt-8 border-t border-[#e4e7ec] pt-4 text-[11px] text-[#9299a5]">
            Loan Administration · Internal workspace
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
