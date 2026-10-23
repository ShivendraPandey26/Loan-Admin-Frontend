
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    CheckCircle2,
    RefreshCw,
    AlertCircle,
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
            <div className="py-16 text-center text-sm text-[#858c98]">
                Loading applicant details...
            </div>
        );
    }

    if (error) {
        return (
            <section className="mt-7 rounded-lg border border-[#e2e6ec] bg-white p-6">
                <p className="text-sm text-red-600">{error}</p>

                <div className="mt-4 flex gap-3">
                    <button
                        onClick={fetchDetails}
                        className="flex items-center gap-2 rounded-md border border-[#dfe4eb] px-3 py-2 text-sm hover:bg-gray-50"
                    >
                        <RefreshCw size={15} />
                        Try again
                    </button>

                    <button
                        onClick={() => navigate("/")}
                        className="rounded-md border border-[#dfe4eb] px-3 py-2 text-sm hover:bg-gray-50"
                    >
                        Back to dashboard
                    </button>
                </div>
            </section>
        );
    }

    if (!applicant) {
        return (
            <section className="mt-7 rounded-lg border border-[#e2e6ec] bg-white p-6">
                Applicant not found.
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
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm text-[#536174] hover:text-[#202938]"
            >
                <ArrowLeft size={16} />
                Back to dashboard
            </button>

            <section className="rounded-lg border border-[#e2e6ec] bg-white p-5">

                <div className="flex flex-col justify-between gap-3 border-b border-[#e8ebf0] pb-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-base font-semibold text-[#202938]">
                            {fullName}
                        </h2>
                        <p className="mt-1 text-xs text-[#858c98]">
                            Applicant profile and loan eligibility
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex w-fit items-center rounded-md bg-[#f0f3f7] px-3 py-1.5 text-xs font-medium text-[#344054]">
                            {status}
                        </span>

                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing((previous) => !previous);
                                setEditError("");
                                setEditSuccess("");
                            }}
                            className="rounded-md border border-[#dfe4eb] bg-white px-3 py-2 text-sm font-medium text-[#344054] hover:bg-gray-50"
                        >
                            {isEditing ? "Cancel editing" : "Edit Applicant"}
                        </button>
                    </div>
                </div>



                {isEditing && (
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
                )}


                <div className="grid grid-cols-1 gap-5 pt-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Detail
                        label="Email"
                        value={applicant.email || "Not provided"}
                    />

                    <Detail
                        label="Phone"
                        value={applicant.phone || "Not provided"}
                    />
                    <Detail label="Date of Birth" value={
                        applicant.dateOfBirth
                            ? new Date(applicant.dateOfBirth).toLocaleDateString("en-IN")
                            : "Not provided"
                    } />
                    <Detail label="Age" value={age ?? "Not provided"} />
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
                        value={applicant.employmentType}
                    />
                    <Detail label="Salary Type" value={applicant.salaryType} />
                    <Detail
                        label="Last Evaluated"
                        value={
                            applicant.lastEvaluatedAt
                                ? new Date(applicant.lastEvaluatedAt).toLocaleString("en-IN")
                                : "Not evaluated"
                        }
                    />
                </div>
            </section>

            <section className="overflow-hidden rounded-lg border border-[#e2e6ec] bg-white">
                <div className="border-b border-[#e8ebf0] px-5 py-4">

                    <div className="flex flex-col gap-3 border-b border-[#e8ebf0] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-[#202938]">
                                Eligible Loan Products
                            </h3>
                            <p className="mt-1 text-xs text-[#858c98]">
                                Products returned by the backend eligibility engine.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleEvaluateEligibility}
                            disabled={evaluating}
                            className="inline-flex items-center gap-2 rounded-md border border-blue-700 bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <RefreshCw
                                size={16}
                                className={evaluating ? "animate-spin" : ""}
                            />
                            {evaluating ? "Evaluating..." : "Evaluate Eligibility"}
                        </button>
                    </div>

                    {evaluationMessage && (
                        <p className="mt-3 text-sm text-green-700">
                            {evaluationMessage}
                        </p>
                    )}

                    {evaluationError && (
                        <p className="mt-3 text-sm text-red-600">
                            {evaluationError}
                        </p>
                    )}

                    <p className="mt-1 text-xs text-[#858c98]">
                        Products returned by the backend eligibility engine.
                    </p>
                </div>

                {eligibleProducts.length === 0 ? (
                    <div className="flex flex-col items-center px-5 py-12 text-center">
                        <AlertCircle size={22} className="text-[#8993a2]" />
                        <p className="mt-3 text-sm font-medium text-[#344054]">
                            No eligible loan products
                        </p>
                        <p className="mt-1 text-xs text-[#858c98]">
                            No eligible products were returned for this applicant.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-125 text-left">
                            <thead className="bg-[#f8f9fb]">
                                <tr className="text-[11px] uppercase tracking-wide text-[#7c8594]">
                                    <th className="px-5 py-3">Product</th>
                                    <th className="px-5 py-3">Minimum Salary</th>
                                    <th className="px-5 py-3">Minimum Credit Score</th>
                                    <th className="px-5 py-3">Eligibility</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-[#edf0f4]">
                                {eligibleProducts.map((product, index) => (
                                    <tr
                                        key={product._id || product.id || index}
                                        className="text-xs text-[#344054]"
                                    >
                                        <td className="px-5 py-4 font-medium">
                                            {product.name || product.productName || "Loan product"}
                                        </td>

                                        <td className="px-5 py-4">
                                            {formatAmount(
                                                product.minSalary ?? product.minimumSalary
                                            )}
                                        </td>

                                        <td className="px-5 py-4">
                                            {product.minCreditScore ??
                                                product.minimumCreditScore ??
                                                "Not specified"}
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1 text-green-700">
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
        <div>
            <p className="text-xs text-[#858c98]">{label}</p>
            <p className="mt-1 wrap-break-word text-sm font-medium text-[#344054]">
                {value ?? "Not provided"}
            </p>
        </div>
    );
}
