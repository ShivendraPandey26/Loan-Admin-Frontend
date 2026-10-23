
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
        <section className="mt-7 overflow-hidden rounded-xl border border-[#c5ccd6] bg-white shadow-sm">
            {/* Header */}
            <div className="border-b border-[#d5dbe4] px-5 py-5 sm:px-6">
                <div className="mb-5">
                    <h2 className="text-lg font-semibold tracking-tight text-[#172033]">
                        Applicants
                    </h2>
                    <p className="mt-1 text-sm text-[#647084]">
                        Review applicant details and eligibility status.
                    </p>
                </div>

                <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                        {/* Search */}
                        <div className="flex min-w-0 items-center gap-3 rounded-lg border border-[#c5ccd6] bg-white px-3.5 transition-colors focus-within:border-[#294f80] focus-within:ring-2 focus-within:ring-[#294f80]/10 sm:w-72">
                            <Search size={17} className="shrink-0 text-[#687589]" />

                            <input
                                type="text"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search applicants..."
                                aria-label="Search applicants"
                                className="w-full min-w-0 py-3 text-sm text-[#202938] outline-none placeholder:text-[#8791a1]"
                            />
                        </div>

                        {/* Eligibility filter */}
                        <select
                            value={statusFilter}
                            onChange={(event) => {
                                const value = event.target.value;
                                setStatusFilter(value);
                                setPage(1);
                                fetchApplicants(1, value);
                            }}
                            aria-label="Filter by eligibility status"
                            className="w-full cursor-pointer rounded-lg border border-[#c5ccd6] bg-white px-3.5 py-3 text-sm text-[#293548] outline-none transition-colors focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10 sm:w-auto"
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
                            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#c5ccd6] bg-white text-[#40516a] transition-colors hover:bg-[#f3f6fa] hover:text-[#294f80] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RefreshCw
                                size={17}
                                className={loading ? "animate-spin" : ""}
                            />
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/applicants/new")}
                            className="inline-flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#294f80] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#203f67] focus:outline-none focus:ring-2 focus:ring-[#294f80]/30 focus:ring-offset-2 sm:flex-none"
                        >
                            <UserPlus size={17} />
                            Create Applicant
                        </button>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="mx-5 mt-5 flex flex-col gap-2 rounded-lg border border-[#efcaca] bg-[#fff7f7] px-4 py-3 text-sm text-[#b42318] sm:mx-6 sm:flex-row sm:items-center sm:justify-between">
                    <p>{error}</p>
                    <button
                        type="button"
                        onClick={fetchApplicants}
                        className="w-fit font-semibold underline underline-offset-4 hover:text-[#8f1d15]"
                    >
                        Try again
                    </button>
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="flex flex-col items-center justify-center">
                    <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#dfe4eb] border-t-[#294f80]" />
                    <p className="mt-3 text-sm font-semibold text-[#344054]">
                        Loading applicants...
                    </p>
                    <p className="mt-1 text-xs text-[#667085]">
                        Please wait while product details are being fetched.
                    </p>
                </div>
            ) : filteredApplicants.length === 0 ? (
                /* Empty state */
                <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d5dbe4] bg-[#f5f7fa]">
                        <Users size={22} className="text-[#64748b]" />
                    </div>

                    <p className="mt-4 text-base font-semibold text-[#202938]">
                        {search ? "No matching applicants" : "No applicants found"}
                    </p>

                    <p className="mt-1 max-w-sm text-sm leading-6 text-[#737f91]">
                        {search
                            ? "Try a different search term."
                            : "Applicant records will appear here when available."}
                    </p>
                </div>
            ) : (
                <>
                    {/* Applicants table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-190 text-left">
                            <thead className="border-b border-[#d5dbe4] bg-[#f5f7fa]">
                                <tr className="text-xs font-semibold uppercase tracking-[0.07em] text-[#526075]">
                                    <th className="px-6 py-4">Applicant</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Phone</th>
                                    <th className="px-6 py-4">Status</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#e0e5ec]">
                                {filteredApplicants.map((applicant) => (
                                    <tr
                                        key={applicant._id}
                                        onClick={() => {
                                            if (applicant._id) {
                                                navigate(`/applicants/${applicant._id}`);
                                            } else {
                                                console.error(
                                                    "Applicant ID is missing:",
                                                    applicant
                                                );
                                            }
                                        }}
                                        className="cursor-pointer text-sm text-[#344054] transition-colors hover:bg-[#f5f8fc]"
                                    >
                                        <td className="px-6 py-5">
                                            <span className="font-semibold capitalize text-[#202938]">
                                                {applicant.fullName || "Not provided"}
                                            </span>
                                        </td>

                                        <td className="px-6 py-5 text-[#526075]">
                                            {applicant.email || "Not provided"}
                                        </td>

                                        <td className="px-6 py-5 text-[#526075]">
                                            {applicant.phone || "Not provided"}
                                        </td>

                                        <td className="px-6 py-5">
                                            <span
                                                className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${applicant.status?.toLowerCase() === "active"
                                                    ? "border-[#b7e4c7] bg-[#f0fdf4] text-[#15803d]"
                                                    : applicant.status?.toLowerCase() === "rejected"
                                                        ? "border-[#fecaca] bg-[#fef2f2] text-[#dc2626]"
                                                        : "border-[#d5dbe4] bg-[#f5f7fa] text-[#526075]"
                                                    }`}
                                            >
                                                {applicant.status || "Not specified"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col gap-4 border-t border-[#d5dbe4] bg-[#fbfcfe] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <p className="text-sm text-[#526075]">
                            Total applicants:{" "}
                            <span className="font-semibold text-[#202938]">
                                {totalApplicants}
                            </span>
                            <span className="mx-2 text-[#a0a9b7]">|</span>
                            Page{" "}
                            <span className="font-semibold text-[#202938]">{page}</span>
                            {" "}of{" "}
                            <span className="font-semibold text-[#202938]">
                                {totalPages}
                            </span>
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => fetchApplicants(page - 1)}
                                disabled={loading || page <= 1}
                                className="rounded-lg border border-[#c5ccd6] bg-white px-4 py-2.5 text-sm font-medium text-[#344054] transition-colors hover:bg-[#f0f3f8] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Previous
                            </button>

                            <button
                                type="button"
                                onClick={() => fetchApplicants(page + 1)}
                                disabled={loading || page >= totalPages}
                                className="rounded-lg border border-[#c5ccd6] bg-white px-4 py-2.5 text-sm font-medium text-[#344054] transition-colors hover:bg-[#f0f3f8] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
