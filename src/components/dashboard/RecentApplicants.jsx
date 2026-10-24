import { Users, ArrowUpRight, AlertCircle } from "lucide-react";

export default function RecentApplicants({
    applicants = [],
    loading = false,
    error = "",
    onViewAll,
}) {
    return (
        <section className="mt-6 overflow-hidden rounded-lg border border-[#cbd2dc] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <div className="flex flex-col gap-3 border-b border-[#cbd2dc] bg-[#fcfcfd] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-[15px] font-semibold tracking-[-0.2px] text-[#182230]">
                        Recent applicants
                    </h2>
                    <p className="mt-1.5 text-[12px] leading-5 text-[#667085]">
                        Review the latest applicant records.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onViewAll}
                    className="inline-flex items-center gap-2 self-start rounded-md border border-[#c5ccd6] bg-white px-3.5 py-2.5 text-[12px] font-semibold text-[#344054] transition-colors hover:border-[#98a2b3] hover:bg-[#f5f7fa] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64748b] focus-visible:ring-offset-2 sm:self-auto"
                >
                    View applicants
                    <ArrowUpRight size={14} strokeWidth={1.8} />
                </button>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-[#dfe4eb] border-t-[#294f80]" />
                    <p className="mt-4 text-sm font-semibold text-[#344054]">
                        Loading applicants
                    </p>
                    <p className="mt-1 text-xs text-[#667085]">
                        Please wait while applicant records are being fetched.
                    </p>
                </div>
            ) : error ? (
                <div
                    role="alert"
                    className="mx-5 my-4 flex items-start gap-3 rounded-lg border border-[#f2caca] bg-[#fff7f7] px-4 py-4 text-sm leading-6 text-[#b42318]"
                >
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <p className="min-w-0 wrap-break-word">{error}</p>
                </div>
            ) : applicants.length === 0 ? (
                <div className="flex flex-col items-center px-5 py-12 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[#d5dbe4] bg-[#f8fafc] text-[#52637b]">
                        <Users size={20} strokeWidth={1.7} />
                    </div>
                    <p className="mt-3 text-[13px] font-semibold text-[#202939]">
                        No applicants found
                    </p>
                    <p className="mt-1 text-[12px] text-[#7b8493]">
                        New applicant records will appear here.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-150 text-left">
                        <thead className="border-b border-[#cbd2dc] bg-[#f3f5f8]">
                            <tr className="text-[11px] uppercase tracking-[0.5px] text-[#475467]">
                                <th className="px-5 py-3.5 font-semibold">
                                    Applicant
                                </th>
                                <th className="px-5 py-3.5 font-semibold">
                                    Employment
                                </th>
                                <th className="px-5 py-3.5 font-semibold">
                                    Credit score
                                </th>
                                <th className="px-5 py-3.5 font-semibold">
                                    Status
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#e0e4eb]">
                            {applicants.map((applicant) => {
                                const status = applicant.eligibilityStatus;

                                return (
                                    <tr
                                        key={applicant._id}
                                        className="text-[12px] transition-colors duration-150 hover:bg-[#f7f9fc]"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-[#202939]">
                                                {applicant.fullName}
                                            </p>
                                            <p className="mt-1 text-[11px] text-[#667085]">
                                                {applicant.email}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 text-[#475467]">
                                            {applicant.employmentType || "—"}
                                        </td>

                                        <td className="px-5 py-4 font-medium tabular-nums text-[#344054]">
                                            {applicant.creditScore ?? "—"}
                                        </td>

                                        <td className="px-5 py-4">

                                            <span
                                                className={`inline-flex items-center rounded-md border px-2.5 py-1 text-[11px] font-medium ${applicant.status?.toLowerCase() === "active"
                                                    ? "border-[#b7e4c7] bg-[#f0fdf4] text-[#15803d]"
                                                    : "border-[#fecaca] bg-[#fef2f2] text-[#dc2626]"
                                                    }`}
                                            >
                                                {applicant.status || "Not evaluated"}
                                            </span>

                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}
