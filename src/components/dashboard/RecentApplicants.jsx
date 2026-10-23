
import { Users, ArrowUpRight } from "lucide-react";

export default function RecentApplicants({
    applicants = [],
    loading = false,
    error = "",
    onViewAll,
}) {

    return (
        <section className="mt-6 overflow-hidden rounded-md border border-[#e2e6ec] bg-white">
            <div className="flex flex-col gap-2 border-b border-[#e8ebf0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-[14px] font-semibold">
                        Recent applicants
                    </h2>
                    <p className="mt-1 text-[12px] text-[#858c98]">
                        Review the latest applicant records.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onViewAll}
                    className="flex items-center gap-2 self-start rounded-md border border-[#dfe4eb] px-3 py-2 text-[12px] font-medium hover:bg-[#f8f9fb]"
                >
                    View applicants
                    <ArrowUpRight size={14} />
                </button>
            </div>

            {loading ? (
                <p className="px-5 py-10 text-center text-sm text-[#667085]">
                    Loading applicants...
                </p>
            ) : error ? (
                <p role="alert" className="px-5 py-10 text-center text-sm text-red-600">
                    {error}
                </p>
            ) : applicants.length === 0 ? (
                <div className="flex flex-col items-center px-5 py-10 text-center">
                    <Users size={22} className="text-[#748096]" />
                    <p className="mt-3 text-[13px] font-medium">
                        No applicants found
                    </p>
                    <p className="mt-1 text-[12px] text-[#858c98]">
                        New applicant records will appear here.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-150 text-left">
                        <thead className="border-b border-[#edf0f3] bg-[#fafbfc]">
                            <tr className="text-[11px] text-[#667085]">
                                <th className="px-5 py-3 font-medium">Applicant</th>
                                <th className="px-5 py-3 font-medium">Employment</th>
                                <th className="px-5 py-3 font-medium">Credit score</th>
                                <th className="px-5 py-3 font-medium">Status</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#edf0f3]">
                            {applicants.map((applicant) => {
                                const status = applicant.eligibilityStatus;

                                return (
                                    <tr
                                        key={applicant._id}
                                        className="text-[12px] hover:bg-[#fafbfc]"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-[#202631]">
                                                {applicant.fullName}
                                            </p>
                                            <p className="mt-1 text-[#858c98]">
                                                {applicant.email}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4 text-[#515b69]">
                                            {applicant.employmentType || "—"}
                                        </td>

                                        <td className="px-5 py-4 text-[#515b69]">
                                            {applicant.creditScore ?? "—"}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="inline-block rounded-md border border-[#e2e6ec] px-2 py-1 text-[11px] text-[#515b69]">
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
