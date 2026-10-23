
import { useEffect, useState } from "react";
import { Search, RefreshCw, Users, ExternalLink } from "lucide-react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function Applicants() {
    const navigate = useNavigate();

    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalApplicants, setTotalApplicants] = useState(0);

    const fetchApplicants = async (pageNumber = page, selectedStatus = statusFilter) => {
        setLoading(true);
        setError("");

        try {
            const response = await api.get("/applicants", {
                params: {
                    page: pageNumber,
                    limit: 10,
                    ...(selectedStatus && { status: selectedStatus }),
                },
            });

            const records = response.data?.data;
            const pagination = response.data?.pagination;

            if (!Array.isArray(records)) {
                throw new Error("Invalid applicants response format.");
            }

            setApplicants(records);
            setPage(pagination?.page ?? pageNumber);
            setTotalPages(pagination?.totalPages ?? 1);
            setTotalApplicants(pagination?.total ?? records.length);
        } catch (err) {
            console.error("Failed to fetch applicants:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load applicants."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, []);

    const filteredApplicants = applicants.filter((applicant) => {
        const searchText = search.toLowerCase();

        return [
            applicant.name,
            applicant.fullName,
            applicant.email,
            applicant.phone,
            applicant.status,
        ]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(searchText));
    });

    return (
        <section className="mt-7 overflow-hidden rounded-lg border border-[#e2e6ec] bg-white">
            <div className="flex flex-col gap-4 border-b border-[#e8ebf0] px-5 py-4">
                {/* Heading */}
                <div>
                    <h2 className="text-sm font-semibold text-[#202938]">
                        Applicants
                    </h2>
                    <p className="mt-1 text-xs text-[#858c98]">
                        Review applicant details and eligibility status.
                    </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        {/* Search applicants */}
                        <div className="flex min-w-0 items-center gap-2 rounded-md border border-[#dfe4eb] px-3 sm:w-64">
                            <Search
                                size={15}
                                className="shrink-0 text-[#858c98]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search applicants..."
                                aria-label="Search applicants"
                                className="w-full min-w-0 py-2 text-xs text-[#202938] outline-none placeholder:text-[#858c98]"
                            />
                        </div>

                        {/* Eligibility status filter */}
                        <select
                            value={statusFilter}
                            onChange={(event) => {
                                const value = event.target.value;
                                setStatusFilter(value);
                                setPage(1);
                                fetchApplicants(1, value);
                            }}
                            aria-label="Filter by eligibility status"
                            className="w-full rounded-md border border-[#dfe4eb] bg-white px-3 py-2.5 text-sm text-[#374151] outline-none focus:border-blue-600 sm:w-auto"
                        >
                            <option value="">All statuses</option>
                            <option value="Active">Active</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => fetchApplicants(page)}
                            disabled={loading}
                            aria-label="Refresh applicants"
                            className="inline-flex items-center justify-center rounded-md border border-[#dfe4eb] px-3 py-2.5 text-[#4b5565] transition-colors hover:bg-[#f6f8fa] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RefreshCw
                                size={15}
                                className={loading ? "animate-spin" : ""}
                            />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/applicants/new")}
                            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-800"
                        >
                            <UserPlus size={16} />
                            Create Applicant
                        </button>
                    </div>
                </div>
            </div>

            {error && (
                <div className="m-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
                    {error}
                    <button
                        onClick={fetchApplicants}
                        className="ml-2 font-semibold underline"
                    >
                        Try again
                    </button>
                </div>
            )}

            {loading ? (
                <div className="py-16 text-center text-[13px] text-[#858c98]">
                    Loading applicants...
                </div>
            ) : filteredApplicants.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                    <Users size={22} className="text-[#8993a2]" />
                    <p className="mt-3 text-[13px] font-medium text-[#344054]">
                        {search ? "No matching applicants" : "No applicants found"}
                    </p>
                    <p className="mt-1 text-[12px] text-[#858c98]">
                        {search
                            ? "Try a different search term."
                            : "Applicant records will appear here when available."}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-162.5 text-left">
                        <thead className="bg-[#f8f9fb]">
                            <tr className="text-[11px] font-medium uppercase tracking-wide text-[#7c8594]">
                                <th className="px-5 py-3">Applicant</th>
                                <th className="px-5 py-3">Email</th>
                                <th className="px-5 py-3">Phone</th>
                                <th className="px-5 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#edf0f4]">
                            {filteredApplicants.map((applicant, index) => (
                                <tr
                                    key={applicant._id}
                                    onClick={() => {
                                        if (applicant._id) {
                                            navigate(`/applicants/${applicant._id}`);
                                        } else {
                                            console.error("Applicant ID is missing:", applicant);
                                        }
                                    }}
                                    className="cursor-pointer text-[12px] text-[#344054] hover:bg-[#f5f7fa]"
                                >
                                    <td className="px-5 py-4 font-medium capitalize">
                                        {applicant.fullName || "Not provided"}
                                    </td>
                                    <td className="px-5 py-4">
                                        {applicant.email || "Not provided"}
                                    </td>
                                    <td className="px-5 py-4">
                                        {applicant.phone || "Not provided"}
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="rounded-md bg-[#f0f3f7] px-2 py-1 text-[11px]">
                                            {applicant.status || "Not specified"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>


                    <div className="flex flex-col gap-3 border-t border-[#e8ebf0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-[#64748b]">
                            Total applicants: {totalApplicants}
                            <span className="mx-2">|</span>
                            Page {page} of {totalPages}
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => fetchApplicants(page - 1)}
                                disabled={loading || page <= 1}
                                className="rounded-md border border-[#dfe4eb] px-3 py-2 text-sm text-[#374151] hover:bg-[#f6f8fa] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <button
                                type="button"
                                onClick={() => fetchApplicants(page + 1)}
                                disabled={loading || page >= totalPages}
                                className="rounded-md border border-[#dfe4eb] px-3 py-2 text-sm text-[#374151] hover:bg-[#f6f8fa] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </section>
    );
}
