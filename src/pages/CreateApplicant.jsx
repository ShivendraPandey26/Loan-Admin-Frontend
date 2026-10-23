
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, UserPlus } from "lucide-react";
import api from "../lib/api";

export default function CreateApplicant() {
    const navigate = useNavigate();

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

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");

        const payload = {
            ...formData,
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            creditScore: Number(formData.creditScore),
            monthlySalary: Number(formData.monthlySalary),
        };

        try {
            const response = await api.post("/applicants", payload);
            const applicant =
                response.data?.data?.applicant ??
                response.data?.data;

            if (applicant?._id) {
                navigate(`/applicants/${applicant._id}`);
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error(
                "Create applicant error:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                "Unable to create applicant. Please check the details."
            );
        } finally {
            setSaving(false);
        }
    };

    const inputClass =
        "mt-1 block w-full rounded-md border border-[#dfe4eb] bg-white px-3 py-2.5 text-sm text-[#202938] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            {/* Back navigation */}
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 rounded-md text-sm font-medium text-[#647084] transition-colors hover:text-[#294f80] focus:outline-none focus:ring-2 focus:ring-[#294f80]/20 mt-5"
            >
                <ArrowLeft size={17} />
                Back
            </button>

            {/* Page heading */}
            <div>
                <p className="text-sm font-medium text-[#647084]">
                    Applicants <span className="mx-1.5 text-[#c5ccd6]">/</span> New applicant
                </p>

                <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#172033] sm:text-3xl">
                    Create Applicant
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#647084]">
                    Enter applicant details to evaluate loan eligibility.
                </p>
            </div>

            {/* Applicant form */}
            <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-xl border border-[#e2e6ec] bg-white shadow-sm"
            >
                <div className="flex items-center gap-3 border-b border-[#e8ebf0] bg-[#fafbfc] px-5 py-5 sm:px-6">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#dce5f0] bg-[#f0f5fb] text-[#294f80]">
                        <UserPlus size={20} />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-[#202938]">
                            Applicant information
                        </h2>
                        <p className="mt-1 text-sm text-[#647084]">
                            All fields are required.
                        </p>
                    </div>
                </div>

                <div className="p-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                        <label className="block min-w-0 text-sm font-medium text-[#475467]">
                            Full name
                            <input
                                name="fullName"
                                type="text"
                                required
                                minLength={2}
                                maxLength={100}
                                value={formData.fullName}
                                onChange={handleChange}
                                className={`${inputClass} mt-2 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 py-3 text-sm text-[#202938] outline-none transition-colors placeholder:text-[#98a2b3] hover:border-[#cbd5e1] focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10`}
                            />
                        </label>

                        <label className="block min-w-0 text-sm font-medium text-[#475467]">
                            Email
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`${inputClass} mt-2 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 py-3 text-sm text-[#202938] outline-none transition-colors placeholder:text-[#98a2b3] hover:border-[#cbd5e1] focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10`}
                            />
                        </label>

                        <label className="block min-w-0 text-sm font-medium text-[#475467]">
                            Phone
                            <input
                                name="phone"
                                type="tel"
                                required
                                minLength={10}
                                maxLength={12}
                                value={formData.phone}
                                onChange={handleChange}
                                className={`${inputClass} mt-2 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 py-3 text-sm text-[#202938] outline-none transition-colors placeholder:text-[#98a2b3] hover:border-[#cbd5e1] focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10`}
                            />
                        </label>

                        <label className="block min-w-0 text-sm font-medium text-[#475467]">
                            Date of birth
                            <input
                                name="dateOfBirth"
                                type="date"
                                required
                                max={new Date().toISOString().slice(0, 10)}
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className={`${inputClass} mt-2 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 py-3 text-sm text-[#202938] outline-none transition-colors hover:border-[#cbd5e1] focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10`}
                            />
                        </label>

                        <label className="block min-w-0 text-sm font-medium text-[#475467]">
                            Credit score
                            <input
                                name="creditScore"
                                type="number"
                                required
                                min={300}
                                max={900}
                                step={1}
                                value={formData.creditScore}
                                onChange={handleChange}
                                className={`${inputClass} mt-2 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 py-3 text-sm text-[#202938] outline-none transition-colors hover:border-[#cbd5e1] focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10`}
                            />
                        </label>

                        <label className="block min-w-0 text-sm font-medium text-[#475467]">
                            Monthly salary (₹)
                            <input
                                name="monthlySalary"
                                type="number"
                                required
                                min={0}
                                step="any"
                                value={formData.monthlySalary}
                                onChange={handleChange}
                                className={`${inputClass} mt-2 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 py-3 text-sm text-[#202938] outline-none transition-colors hover:border-[#cbd5e1] focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10`}
                            />
                        </label>

                        <label className="block min-w-0 text-sm font-medium text-[#475467]">
                            Employment type
                            <select
                                name="employmentType"
                                required
                                value={formData.employmentType}
                                onChange={handleChange}
                                className={`${inputClass} mt-2 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 py-3 text-sm text-[#202938] outline-none transition-colors hover:border-[#cbd5e1] focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10`}
                            >
                                <option value="Salaried">Salaried</option>
                                <option value="Self-Employed">Self-Employed</option>
                            </select>
                        </label>

                        <label className="block min-w-0 text-sm font-medium text-[#475467]">
                            Salary type
                            <select
                                name="salaryType"
                                required
                                value={formData.salaryType}
                                onChange={handleChange}
                                className={`${inputClass} mt-2 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 py-3 text-sm text-[#202938] outline-none transition-colors hover:border-[#cbd5e1] focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10`}
                            >
                                <option value="DAT">DAT</option>
                                <option value="Cash">Cash</option>
                                <option value="Cheque">Cheque</option>
                            </select>
                        </label>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="mt-6 rounded-lg border border-[#f2caca] bg-[#fff7f7] px-4 py-3 text-sm leading-5 text-[#b42318]"
                        >
                            {error}
                        </div>
                    )}

                    <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#e8ebf0] pt-5 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#dfe4eb] bg-white px-5 py-2.5 text-sm font-semibold text-[#344054] transition-colors hover:border-[#cbd5e1] hover:bg-[#f8fafc]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#294f80] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#203f67] focus:outline-none focus:ring-2 focus:ring-[#294f80]/25 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {saving ? "Creating..." : "Create Applicant"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
