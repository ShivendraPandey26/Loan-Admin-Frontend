
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
    console.log(stats)
    return (
        <section className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map(({ label, description, key, icon: Icon }) => (
                <div
                    key={key}
                    className="rounded-md border border-[#e2e6ec] bg-white p-5"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex h-9 w-9 items-center justify-center rounded-md border border-[#e7eaf0] bg-[#fafbfc] text-[#52637b]">
                            <Icon size={18} strokeWidth={1.7} />
                        </div>
                    </div>

                    <p className="mt-5 text-[13px] font-semibold">
                        {label}
                    </p>

                    <p className="mt-1 text-[12px] leading-5 text-[#858c98]">
                        {description}
                    </p>

                    <p className="mt-4 text-2xl font-semibold text-[#202631]">
                        {loading
                            ? "—"
                            : error
                                ? "—"
                                : stats[key] ?? "—"}
                    </p>

                    <p className="mt-2 border-t border-[#edf0f3] pt-3 text-[11px] text-[#858c98]">
                        {loading
                            ? "Loading statistics..."
                            : error
                                ? "Statistics unavailable"
                                : stats[key] == null
                                    ? "Not connected yet"
                                    : "Live data"}
                    </p>
                </div>
            ))}
        </section>
    );
}
