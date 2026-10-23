
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    RefreshCw,
    AlertCircle,
    UserRoundX,
} from "lucide-react";
import api from "../lib/api";
import ApplicantEditForm from "./ApplicantEditForm";

export default function ApplicantDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [applicant, setApplicant] = useState(null);
    const [eligibleProducts, setEligibleProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Edit applicant form state
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState("");
    const [editSuccess, setEditSuccess] = useState("");

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        creditScore: "",
        employmentType: "Salaried",
        salaryType: "Cheque",
        monthlySalary: "",
    });


    const [evaluationError, setEvaluationError] = useState("");
    const [evaluating, setEvaluating] = useState(false);
    const [evaluationMessage, setEvaluationMessage] = useState("");

    const handleEvaluateEligibility = async () => {
        try {
            setEvaluating(true);
            setEvaluationMessage("");
            setEvaluationError("");

            const response = await api.post(
                `/applicants/${id}/evaluate`
            );

            setEvaluationMessage(
                response.data.message || "Eligibility evaluated successfully."
            );

            await fetchDetails();
        } catch (error) {
            setEvaluationError(
                error.response?.data?.message ||
                "Failed to evaluate eligibility. Please try again."
            );
        } finally {
            setEvaluating(false);
        }
    };


    const handleSaveApplicant = async (event) => {
        event.preventDefault();

        setSaving(true);
        setEditError("");
        setEditSuccess("");

        const payload = {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            dateOfBirth: formData.dateOfBirth,
            creditScore: Number(formData.creditScore),
            employmentType: formData.employmentType,
            salaryType: formData.salaryType,
            monthlySalary: Number(formData.monthlySalary),
        };

        try {
            console.log("Applicant update payload:", payload);

            const response = await api.patch(
                `/applicants/${id}`,
                payload
            );

            setEditSuccess("Applicant updated successfully.");
            await fetchDetails();
        } catch (error) {
            console.error(
                "Validation error:",
                error.response?.data || error.message
            );

            const backendMessage = error.response?.data?.message;
            const details = error.response?.data?.errors;

            setEditError(
                Array.isArray(details)
                    ? details.map((item) => item.message || item).join(", ")
                    : backendMessage || "Update failed. Check the browser console."
            );
        } finally {
            setSaving(false);
        }
    };


    const fetchDetails = useCallback(async () => {
        if (!id) {
            setError("Applicant ID is missing from the URL.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");

        try {
            const applicantResponse = await api.get(`/applicants/${id}`);

            const applicantPayload = applicantResponse.data;

            const applicantData =
                applicantPayload?.applicant ??
                applicantPayload?.data?.applicant ??
                (Array.isArray(applicantPayload?.data)
                    ? applicantPayload.data.find(
                        (item) => item._id === id || item.id === id
                    )
                    : applicantPayload?.data);

            if (!applicantData || typeof applicantData !== "object") {
                throw new Error("Applicant details were not found.");
            }

            setApplicant(applicantData);

            setFormData({
                fullName: applicantData.fullName ?? "",
                email: applicantData.email ?? "",
                phone: applicantData.phone ?? "",
                dateOfBirth: applicantData.dateOfBirth
                    ? new Date(applicantData.dateOfBirth)
                        .toISOString()
                        .slice(0, 10)
                    : "",
                creditScore: applicantData.creditScore ?? "",
                employmentType: applicantData.employmentType ?? "Salaried",
                salaryType: applicantData.salaryType ?? "Cheque",
                monthlySalary: applicantData.monthlySalary ?? "",
            });

            setIsEditing(false);
            setEditError("");
            setEditSuccess("");

            try {
                const eligibilityResponse = await api.get(
                    `/applicants/${id}/eligible-products`
                );

                const payload = eligibilityResponse.data;

                const products =
                    payload?.eligibleProducts ??
                    payload?.products ??
                    payload?.data?.eligibleProducts ??
                    payload?.data?.products ??
                    (Array.isArray(payload?.data) ? payload.data : null) ??
                    applicantData.eligibleProducts;

                setEligibleProducts(Array.isArray(products) ? products : []);
            } catch (eligibilityError) {
                console.error("Failed to fetch eligibility:", eligibilityError);

                // Fall back to products already stored on the applicant record.
                setEligibleProducts(
                    Array.isArray(applicantData.eligibleProducts)
                        ? applicantData.eligibleProducts
                        : []
                );
            }
        } catch (err) {
            console.error("Failed to fetch applicant details:", err);

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to load applicant details."
            );

            setApplicant(null);
            setEligibleProducts([]);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f7f8fa] px-5 text-center">
                <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#d5dbe4] border-t-[#294f80]" />

                <p className="mt-5 text-base font-semibold text-[#202938]">
                    Loading applicant details
                </p>

                <p className="mt-1 text-sm text-[#647084]">
                    Please wait while the details are being fetched.
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <section className="mt-7 overflow-hidden rounded-xl border border-[#c5ccd6] bg-white shadow-sm">
                <div className="flex flex-col items-center px-6 py-12 text-center sm:py-16">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#fecaca] bg-[#fef2f2]">
                        <AlertCircle
                            size={26}
                            className="text-[#dc2626]"
                        />
                    </div>

                    <h2 className="mt-5 text-lg font-semibold text-[#202938]">
                        Unable to load applicant details
                    </h2>

                    <p className="mt-2 max-w-lg text-sm leading-6 text-[#b42318]">
                        {error}
                    </p>

                    <div className="mt-6 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                        <button
                            type="button"
                            onClick={fetchDetails}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#294f80] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#203f67] focus:outline-none focus:ring-2 focus:ring-[#294f80]/30 focus:ring-offset-2"
                        >
                            <RefreshCw size={16} />
                            Try again
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="inline-flex items-center justify-center rounded-lg border border-[#c5ccd6] bg-white px-5 py-3 text-sm font-semibold text-[#344054] transition-colors hover:bg-[#f3f6fa] focus:outline-none focus:ring-2 focus:ring-[#c5ccd6] focus:ring-offset-2"
                        >
                            Back to dashboard
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (!applicant) {
        return (
            <section className="mt-7 overflow-hidden rounded-xl border border-[#c5ccd6] bg-white shadow-sm">
                <div className="flex flex-col items-center px-6 py-14 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-[#d5dbe4] bg-[#f5f7fa]">
                        <UserRoundX
                            size={26}
                            className="text-[#647084]"
                        />
                    </div>

                    <h2 className="mt-5 text-lg font-semibold text-[#202938]">
                        Applicant not found
                    </h2>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-[#647084]">
                        The applicant record may no longer exist or may be unavailable.
                    </p>

                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#294f80] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#203f67] focus:outline-none focus:ring-2 focus:ring-[#294f80]/30 focus:ring-offset-2"
                    >
                        <ArrowLeft size={16} />
                        Back to dashboard
                    </button>
                </div>
            </section>
        );
    }

    const fullName = applicant.fullName || applicant.name || "Applicant";

    const age = applicant.dateOfBirth
        ? Math.max(
            0,
            new Date().getFullYear() -
            new Date(applicant.dateOfBirth).getFullYear() -
            (
                new Date().getMonth() <
                    new Date(applicant.dateOfBirth).getMonth() ||
                    (
                        new Date().getMonth() ===
                        new Date(applicant.dateOfBirth).getMonth() &&
                        new Date().getDate() <
                        new Date(applicant.dateOfBirth).getDate()
                    )
                    ? 1
                    : 0
            )
        )
        : applicant.age;

    const formatAmount = (value) => {
        if (value == null || value === "") return "Not provided";

        const amount = Number(value);

        return Number.isFinite(amount)
            ? `₹${amount.toLocaleString("en-IN")}`
            : String(value);
    };

    const status = applicant.status || "Not specified";

    return (
        <div className="mt-7 space-y-6">
            {/* Back navigation */}
            <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-[#526075] transition-colors hover:text-[#294f80] focus:outline-none focus:ring-2 focus:ring-[#294f80]/20"
            >
                <ArrowLeft size={17} />
                Back to dashboard
            </button>

            {/* Applicant profile */}
            <section className="overflow-hidden rounded-xl border border-[#aeb8c6] bg-white shadow-sm">
                {/* Profile header */}
                <div className="flex flex-col gap-4 border-b border-slate-200 bg-[#f4f6f9] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-widest text-[#526075]">
                            Applicant profile
                        </p>

                        <h2 className="mt-2 wrap-break-word text-xl font-bold tracking-tight text-[#172033] sm:text-2xl">
                            {fullName}
                        </h2>

                        <p className="mt-1.5 text-sm text-[#526075]">
                            Applicant details and loan eligibility
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <span
                            className={`inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-semibold ${status?.toLowerCase() === "active"
                                ? "border-[#86c99e] bg-[#eaf8ef] text-[#166534]"
                                : status?.toLowerCase() === "rejected"
                                    ? "border-[#f0a7a7] bg-[#fff0f0] text-[#b42318]"
                                    : "border-[#b8c2d0] bg-white text-[#475467]"
                                }`}
                        >
                            {status || "Not specified"}
                        </span>

                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing((previous) => !previous);
                                setEditError("");
                                setEditSuccess("");
                            }}
                            className="inline-flex items-center justify-center rounded-lg border border-[#aeb8c6] bg-white px-4 py-2.5 text-sm font-semibold text-[#263449] shadow-sm transition-colors hover:border-[#718096] hover:bg-[#edf1f6] focus:outline-none focus:ring-2 focus:ring-[#294f80]/25"
                        >
                            {isEditing ? "Cancel editing" : "Edit Applicant"}
                        </button>
                    </div>
                </div>

                <div className="p-5 sm:p-6">
                    {isEditing && (
                        <div className="mb-7">
                            <ApplicantEditForm
                                formData={formData}
                                setFormData={setFormData}
                                saving={saving}
                                editError={editError}
                                editSuccess={editSuccess}
                                onSubmit={handleSaveApplicant}
                                onCancel={() => {
                                    setIsEditing(false);
                                    setEditError("");
                                    setEditSuccess("");
                                }}
                            />
                        </div>
                    )}

                    {/* Details heading */}
                    <div className="mb-5 flex items-center gap-3">
                        <div className="h-6 w-1 rounded-sm bg-[#294f80]" />
                        <h3 className="text-base font-bold text-[#172033]">
                            Personal and financial details
                        </h3>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Detail
                            label="Email"
                            value={applicant.email || "Not provided"}
                        />

                        <Detail
                            label="Phone"
                            value={applicant.phone || "Not provided"}
                        />

                        <Detail
                            label="Date of Birth"
                            value={
                                applicant.dateOfBirth
                                    ? new Date(applicant.dateOfBirth).toLocaleDateString("en-IN")
                                    : "Not provided"
                            }
                        />

                        <Detail
                            label="Age"
                            value={age ?? "Not provided"}
                        />

                        <Detail
                            label="Monthly Salary"
                            value={formatAmount(applicant.monthlySalary)}
                        />

                        <Detail
                            label="Credit Score"
                            value={applicant.creditScore ?? "Not provided"}
                        />

                        <Detail
                            label="Employment Type"
                            value={applicant.employmentType || "Not provided"}
                        />

                        <Detail
                            label="Salary Type"
                            value={applicant.salaryType || "Not provided"}
                        />

                        <Detail
                            label="Last Evaluated"
                            value={
                                applicant.lastEvaluatedAt
                                    ? new Date(applicant.lastEvaluatedAt).toLocaleString("en-IN")
                                    : "Not evaluated"
                            }
                        />
                    </div>
                </div>
            </section>

            {/* Eligible loan products */}
            <section className="overflow-hidden rounded-xl border border-[#c5ccd6] bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-[#d5dbe4] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h3 className="text-lg font-semibold tracking-tight text-[#172033]">
                            Eligible Loan Products
                        </h3>
                        <p className="mt-1.5 text-sm text-[#647084]">
                            Products returned by the backend eligibility engine.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleEvaluateEligibility}
                        disabled={evaluating}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#294f80] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#203f67] focus:outline-none focus:ring-2 focus:ring-[#294f80]/30 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <RefreshCw
                            size={16}
                            className={evaluating ? "animate-spin" : ""}
                        />
                        {evaluating ? "Evaluating..." : "Evaluate Eligibility"}
                    </button>
                </div>

                {/* Evaluation feedback */}
                {(evaluationMessage || evaluationError) && (
                    <div className="space-y-3 px-5 pt-5 sm:px-6">
                        {evaluationMessage && (
                            <div className="flex items-start gap-3 rounded-lg border border-[#b7e4c7] bg-[#f0fdf4] px-4 py-3">
                                <CheckCircle2
                                    size={18}
                                    className="mt-0.5 shrink-0 text-[#15803d]"
                                />
                                <p className="text-sm leading-5 text-[#166534]">
                                    {evaluationMessage}
                                </p>
                            </div>
                        )}

                        {evaluationError && (
                            <div className="flex items-start gap-3 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
                                <AlertCircle
                                    size={18}
                                    className="mt-0.5 shrink-0 text-[#dc2626]"
                                />
                                <p className="text-sm leading-5 text-[#b42318]">
                                    {evaluationError}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {eligibleProducts.length === 0 ? (
                    <div className="flex flex-col items-center px-5 py-14 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d5dbe4] bg-[#f5f7fa]">
                            <AlertCircle size={23} className="text-[#647084]" />
                        </div>

                        <p className="mt-4 text-base font-semibold text-[#202938]">
                            No eligible loan products
                        </p>
                        <p className="mt-1.5 max-w-sm text-sm leading-6 text-[#647084]">
                            No eligible products were returned for this applicant.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-170 text-left">
                            <thead className="border-b border-[#d5dbe4] bg-[#f5f7fa]">
                                <tr className="text-xs font-semibold uppercase tracking-[0.06em] text-[#526075]">
                                    <th className="px-5 py-4 sm:px-6">Product</th>
                                    <th className="px-5 py-4">Minimum Salary</th>
                                    <th className="px-5 py-4">Minimum Credit Score</th>
                                    <th className="px-5 py-4 sm:pr-6">Eligibility</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#e0e5ec]">
                                {eligibleProducts.map((product, index) => (
                                    <tr
                                        key={product._id || product.id || index}
                                        className="text-sm text-[#344054] transition-colors hover:bg-[#f8fafc]"
                                    >
                                        <td className="px-5 py-5 sm:px-6">
                                            <span className="font-semibold text-[#202938]">
                                                {product.name || product.productName || "Loan product"}
                                            </span>
                                        </td>

                                        <td className="px-5 py-5 whitespace-nowrap">
                                            {formatAmount(
                                                product.minSalary ?? product.minimumSalary
                                            )}
                                        </td>

                                        <td className="px-5 py-5">
                                            {product.minCreditScore ??
                                                product.minimumCreditScore ??
                                                "Not specified"}
                                        </td>

                                        <td className="px-5 py-5 sm:pr-6">
                                            <span className="inline-flex items-center gap-1.5 rounded-md border border-[#b7e4c7] bg-[#f0fdf4] px-2.5 py-1.5 text-xs font-semibold text-[#15803d]">
                                                <CheckCircle2 size={14} />
                                                Eligible
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}

function Detail({ label, value }) {
    return (
        <div className="min-w-0 rounded-lg border border-[#e8ebf0] bg-white p-4 transition-colors hover:border-[#d5dbe4] hover:bg-[#fafbfc]">
            <p className="text-sm font-medium text-[#647084]">
                {label}
            </p>

            <p className="mt-2 wrap-break-word text-base font-semibold leading-6 text-[#202938]">
                {value ?? "Not provided"}
            </p>
        </div>

    );
}
