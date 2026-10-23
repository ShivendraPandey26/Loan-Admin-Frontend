
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
        <div className="mx-auto max-w-5xl">
            <button
                type="button"
                onClick={() => navigate(-1)}
                className="mb-5 inline-flex items-center gap-2 text-sm text-[#536174] hover:text-blue-700"
            >
                <ArrowLeft size={16} />
                Back
            </button>

            <div className="mb-6">
                <p className="text-sm text-[#64748b]">
                    Applicants / New applicant
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-[#202938]">
                    Create Applicant
                </h1>
                <p className="mt-1 text-sm text-[#64748b]">
                    Enter applicant details to evaluate loan eligibility.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-md border border-[#e2e6ec] bg-white p-5 sm:p-6"
            >
                <div className="mb-6 flex items-center gap-3 border-b border-[#e8ecf1] pb-4">
                    <div className="rounded-md bg-blue-50 p-2 text-blue-700">
                        <UserPlus size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-[#202938]">
                            Applicant information
                        </h2>
                        <p className="mt-1 text-xs text-[#64748b]">
                            All fields are required.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="text-sm font-medium text-[#536174]">
                        Full name
                        <input
                            name="fullName"
                            type="text"
                            required
                            minLength={2}
                            maxLength={100}
                            value={formData.fullName}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </label>

                    <label className="text-sm font-medium text-[#536174]">
                        Email
                        <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </label>

                    <label className="text-sm font-medium text-[#536174]">
                        Phone
                        <input
                            name="phone"
                            type="tel"
                            required
                            minLength={10}
                            maxLength={12}
                            value={formData.phone}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </label>

                    <label className="text-sm font-medium text-[#536174]">
                        Date of birth
                        <input
                            name="dateOfBirth"
                            type="date"
                            required
                            max={new Date().toISOString().slice(0, 10)}
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </label>

                    <label className="text-sm font-medium text-[#536174]">
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
                            className={inputClass}
                        />
                    </label>

                    <label className="text-sm font-medium text-[#536174]">
                        Monthly salary (₹)
                        <input
                            name="monthlySalary"
                            type="number"
                            required
                            min={0}
                            step="any"
                            value={formData.monthlySalary}
                            onChange={handleChange}
                            className={inputClass}
                        />
                    </label>

                    <label className="text-sm font-medium text-[#536174]">
                        Employment type
                        <select
                            name="employmentType"
                            required
                            value={formData.employmentType}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="Salaried">Salaried</option>
                            <option value="Self-Employed">Self-Employed</option>
                        </select>
                    </label>

                    <label className="text-sm font-medium text-[#536174]">
                        Salary type
                        <select
                            name="salaryType"
                            required
                            value={formData.salaryType}
                            onChange={handleChange}
                            className={inputClass}
                        >
                            <option value="DAT">DAT</option>
                            <option value="Cash">Cash</option>
                            <option value="Cheque">Cheque</option>
                        </select>
                    </label>
                </div>

                {error && (
                    <p
                        role="alert"
                        className="mt-5 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                    >
                        {error}
                    </p>
                )}

                <div className="mt-7 flex justify-end border-t border-[#e8ecf1] pt-5">
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? "Creating..." : "Create Applicant"}
                    </button>
                </div>
            </form>
        </div>
    );
}
