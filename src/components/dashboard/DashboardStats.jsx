
import {
    Landmark,
    Users,
    ShieldCheck,
} from "lucide-react";

const statCards = [
    {
        label: "Loan products",
        description: "Configured lending criteria",
        key: "products",
        icon: Landmark,
    },
    {
        label: "Total applicants",
        description: "Applicant records",
        key: "applicants",
        icon: Users,
    },
    {
        label: "Eligible applicants",
        description: "Applicants who meet the criteria",
        key: "eligible",
        icon: ShieldCheck,
    },
    {
        label: "Rejected applicants",
        description: "Applicants who do not meet the criteria",
        key: "rejected",
        icon: ShieldCheck,
    },
];

export default function DashboardStats({
    stats,
    loading,
    error,
}) {
    return (
        <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map(({ label, description, key, icon: Icon }) => (
                <div
                    key={key}
                    className="group rounded-lg border border-gray-300 bg-white p-5 transition-colors duration-150 hover:border-gray-400"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-400 bg-[#f7f9fc] text-[#455b78]">
                            <Icon size={18} strokeWidth={1.8} />
                        </div>
                    </div>

                    <p className="mt-5 text-[13px] font-medium text-[#475467]">
                        {label}
                    </p>

                    <p className="mt-1 min-h-10 text-[12px] leading-5 text-[#858e9d]">
                        {description}
                    </p>

                    <p className="mt-3 text-[30px] font-semibold leading-none tracking-[-1px] tabular-nums text-[#182230]">
                        {loading
                            ? "—"
                            : error
                                ? "—"
                                : stats[key] ?? "—"}
                    </p>

                    <div className="mt-5 flex items-center gap-2 border-t border-gray-300 pt-3">
                        <span
                            className={`h-1.5 w-1.5 shrink-0 rounded-full ${loading
                                ? "bg-[#c5a15b]"
                                : error
                                    ? "bg-[#c45b54]"
                                    : stats[key] == null
                                        ? "bg-[#98a2b3]"
                                        : "bg-[#32936f]"
                                }`}
                        />

                        <p className="text-[11px] font-medium text-[#7b8493]">
                            {loading
                                ? "Loading statistics..."
                                : error
                                    ? "Statistics unavailable"
                                    : stats[key] == null
                                        ? "Not connected yet"
                                        : "Live data"}
                        </p>
                    </div>
                </div>
            ))}
        </section>
    );
}
