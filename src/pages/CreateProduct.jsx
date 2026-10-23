
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PackagePlus } from "lucide-react";
import api from "../lib/api";

const initialForm = {
    name: "",
    description: "",
    minAge: "18",
    maxAge: "60",
    minCreditScore: "650",
    allowedEmploymentTypes: ["Salaried"],
    allowedSalaryTypes: ["Cheque"],
    minSalary: "0",
};

const inputClass =
    "mt-1 block w-full rounded-md border border-[#dfe4eb] bg-white px-3 py-2.5 text-sm text-[#202938] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export default function CreateProduct() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState(initialForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const updateField = (field, value) => {
        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));
    };

    const toggleOption = (field, value) => {
        setFormData((previous) => {
            const selected = previous[field];

            return {
                ...previous,
                [field]: selected.includes(value)
                    ? selected.filter((item) => item !== value)
                    : [...selected, value],
            };
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");

        const payload = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            minAge: Number(formData.minAge),
            maxAge: Number(formData.maxAge),
            minCreditScore: Number(formData.minCreditScore),
            allowedEmploymentTypes: formData.allowedEmploymentTypes,
            allowedSalaryTypes: formData.allowedSalaryTypes,
            minSalary: Number(formData.minSalary),
        };

        try {
            const response = await api.post("/products", payload);

            if (response.data?.success === false) {
                throw new Error(
                    response.data.message || "Product creation failed."
                );
            }

            navigate("/products");
        } catch (err) {
            console.error(
                "Create product error:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to create product. Please check the details."
            );
        } finally {
            setSaving(false);
        }
    };

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
                    Products / New product
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-[#202938]">
                    Create Loan Product
                </h1>
                <p className="mt-1 text-sm text-[#64748b]">
                    Define the eligibility rules for a loan product.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-md border border-[#e2e6ec] bg-white p-5 sm:p-6"
            >
                <div className="mb-6 flex items-center gap-3 border-b border-[#e8ecf1] pb-4">
                    <div className="rounded-md bg-blue-50 p-2 text-blue-700">
                        <PackagePlus size={20} />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-[#202938]">
                            Product information
                        </h2>
                        <p className="mt-1 text-xs text-[#64748b]">
                            Fields marked required must be completed.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    <label className="text-sm font-medium text-[#536174]">
                        Product name *
                        <input
                            required
                            minLength={2}
                            maxLength={100}
                            value={formData.name}
                            onChange={(event) =>
                                updateField("name", event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>

                    <label className="text-sm font-medium text-[#536174] sm:col-span-2">
                        Description
                        <textarea
                            maxLength={500}
                            rows={2}
                            value={formData.description}
                            onChange={(event) =>
                                updateField("description", event.target.value)
                            }
                            className={inputClass}
                            placeholder="Optional product description"
                        />
                    </label>

                    <label className="text-sm font-medium text-[#536174]">
                        Minimum age *
                        <input
                            type="number"
                            required
                            min={18}
                            max={100}
                            step={1}
                            value={formData.minAge}
                            onChange={(event) =>
                                updateField("minAge", event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>

                    <label className="text-sm font-medium text-[#536174]">
                        Maximum age *
                        <input
                            type="number"
                            required
                            min={18}
                            max={100}
                            step={1}
                            value={formData.maxAge}
                            onChange={(event) =>
                                updateField("maxAge", event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>

                    <label className="text-sm font-medium text-[#536174]">
                        Minimum credit score *
                        <input
                            type="number"
                            required
                            min={300}
                            max={900}
                            step={1}
                            value={formData.minCreditScore}
                            onChange={(event) =>
                                updateField("minCreditScore", event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>

                    <label className="text-sm font-medium text-[#536174]">
                        Minimum monthly salary (₹) *
                        <input
                            type="number"
                            required
                            min={0}
                            step="any"
                            value={formData.minSalary}
                            onChange={(event) =>
                                updateField("minSalary", event.target.value)
                            }
                            className={inputClass}
                        />
                    </label>
                </div>

                <fieldset className="mt-6">
                    <legend className="text-sm font-medium text-[#536174]">
                        Allowed employment types *
                    </legend>
                    <div className="mt-3 flex flex-wrap gap-5">
                        {["Salaried", "Self-Employed"].map((option) => (
                            <label
                                key={option}
                                className="flex items-center gap-2 text-sm text-[#374151]"
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.allowedEmploymentTypes.includes(option)}
                                    onChange={() =>
                                        toggleOption("allowedEmploymentTypes", option)
                                    }
                                    className="accent-blue-700"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </fieldset>

                <fieldset className="mt-5">
                    <legend className="text-sm font-medium text-[#536174]">
                        Allowed salary types *
                    </legend>
                    <div className="mt-3 flex flex-wrap gap-5">
                        {["DAT", "Cash", "Cheque"].map((option) => (
                            <label
                                key={option}
                                className="flex items-center gap-2 text-sm text-[#374151]"
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.allowedSalaryTypes.includes(option)}
                                    onChange={() =>
                                        toggleOption("allowedSalaryTypes", option)
                                    }
                                    className="accent-blue-700"
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                </fieldset>

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
                        disabled={
                            saving ||
                            formData.allowedEmploymentTypes.length === 0 ||
                            formData.allowedSalaryTypes.length === 0
                        }
                        className="rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving ? "Creating..." : "Create Product"}
                    </button>
                </div>
            </form>
        </div>
    );
}
