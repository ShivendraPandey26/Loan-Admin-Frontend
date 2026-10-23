
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import api from "../lib/api";

const initialForm = {
    name: "",
    description: "",
    minAge: "",
    maxAge: "",
    minCreditScore: "",
    minSalary: "",
    allowedEmploymentTypes: [],
    allowedSalaryTypes: [],
};

const inputClass =
    "mt-1 block w-full rounded-md border border-[#dfe4eb] bg-white px-3 py-2.5 text-sm text-[#202938] outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100";

export default function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await api.get(`/products/${id}`);
                const product =
                    response.data?.data?.product ??
                    response.data?.data;

                if (!product || product._id !== id) {
                    throw new Error("Product details were not found.");
                }

                setFormData({
                    name: product.name ?? "",
                    description: product.description ?? "",
                    minAge: String(product.minAge ?? ""),
                    maxAge: String(product.maxAge ?? ""),
                    minCreditScore: String(product.minCreditScore ?? ""),
                    minSalary: String(product.minSalary ?? ""),
                    allowedEmploymentTypes:
                        product.allowedEmploymentTypes ?? [],
                    allowedSalaryTypes: product.allowedSalaryTypes ?? [],
                });
            } catch (err) {
                console.error(
                    "Failed to load product:",
                    err.response?.data || err.message
                );

                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Unable to load product details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

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
        setSuccess("");

        if (Number(formData.minAge) > Number(formData.maxAge)) {
            setError("Minimum age cannot exceed maximum age.");
            setSaving(false);
            return;
        }

        if (
            formData.allowedEmploymentTypes.length === 0 ||
            formData.allowedSalaryTypes.length === 0
        ) {
            setError("Select at least one employment type and salary type.");
            setSaving(false);
            return;
        }

        const payload = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            minAge: Number(formData.minAge),
            maxAge: Number(formData.maxAge),
            minCreditScore: Number(formData.minCreditScore),
            minSalary: Number(formData.minSalary),
            allowedEmploymentTypes: formData.allowedEmploymentTypes,
            allowedSalaryTypes: formData.allowedSalaryTypes,
        };

        try {
            await api.patch(`/products/${id}`, payload);
            setSuccess("Loan product updated successfully.");
        } catch (err) {
            console.error(
                "Failed to update product:",
                err.response?.data || err.message
            );

            setError(
                err.response?.data?.message ||
                "Unable to update product. Please check the entered values."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="py-12 text-center text-sm text-[#64748b]">
                Loading product details...
            </div>
        );
    }

    return (
        <section className="mx-auto max-w-5xl">
            <button
                type="button"
                onClick={() => navigate("/products")}
                className="mb-5 inline-flex items-center gap-2 text-sm text-[#536174] hover:text-blue-700"
            >
                <ArrowLeft size={16} />
                Back to Products
            </button>

            <div className="mb-6">
                <p className="text-sm text-[#64748b]">
                    Products / Edit product
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-[#202938]">
                    Edit Loan Product
                </h1>
                <p className="mt-1 text-sm text-[#64748b]">
                    Update product details and eligibility criteria.
                </p>
            </div>

            {error && (
                <p
                    role="alert"
                    className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                    {error}
                </p>
            )}

            {success && (
                <p
                    role="status"
                    className="mb-4 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-700"
                >
                    {success}
                </p>
            )}

            <form
                onSubmit={handleSubmit}
                className="rounded-md border border-[#e2e6ec] bg-white p-5 sm:p-6"
            >
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

                <div className="mt-7 flex justify-end border-t border-[#e8ecf1] pt-5">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save size={16} />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </section>
    );
}
