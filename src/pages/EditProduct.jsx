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
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f7f8fa] px-5">
                <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-[#d5dbe4] border-t-[#294f80]" />

                <p className="mt-5 text-[15px] font-semibold tracking-[-0.2px] text-[#202939]">
                    Loading product details
                </p>

                <p className="mt-2 text-[13px] text-[#64748b]">
                    Please wait while the details are retrieved.
                </p>
            </div>
        );
    }


    return (
        <section className="mx-auto max-w-5xl">
            <button
                type="button"
                onClick={() => navigate("/products")}
                className="mb-6 mt-6 inline-flex items-center gap-2 rounded-md text-[14px] font-medium text-[#596579] transition-colors hover:text-[#244a7c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64748b] focus-visible:ring-offset-2"
            >
                <ArrowLeft size={18} />
                Back to Products
            </button>

            <div className="mb-7 border-b border-[#cbd2dc] pb-5">
                <p className="text-[13px] font-medium text-[#64748b]">
                    Products / Edit product
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-[-0.7px] text-[#182230]">
                    Edit Loan Product
                </h1>
                <p className="mt-2 text-[14px] leading-6 text-[#667085]">
                    Update product details and eligibility criteria.
                </p>
            </div>

            {error && (
                <p
                    role="alert"
                    className="mb-5 rounded-lg border border-[#e5b8b5] bg-[#fff5f4] p-4 text-[14px] leading-6 text-[#b42318]"
                >
                    {error}
                </p>
            )}

            {success && (
                <p
                    role="status"
                    className="mb-5 rounded-lg border border-[#a8d9bd] bg-[#f0fdf4] p-4 text-[14px] leading-6 text-[#15803d]"
                >
                    {success}
                </p>
            )}

            <form
                onSubmit={handleSubmit}
                className="overflow-hidden rounded-xl border border-[#c5ccd6] bg-white shadow-[0_2px_8px_rgba(16,24,40,0.04)]"
            >
                <div className="border-b border-[#d5dbe4] bg-[#f8fafc] px-5 py-5 sm:px-7">
                    <h2 className="text-[17px] font-semibold text-[#202939]">
                        Product information
                    </h2>
                    <p className="mt-1 text-[13px] text-[#667085]">
                        Enter the product details and minimum eligibility requirements.
                    </p>
                </div>

                <div className="p-5 sm:p-7">
                    <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                        <label className="block text-[14px] font-semibold text-[#344054]">
                            Product name *
                            <input
                                required
                                minLength={2}
                                maxLength={100}
                                value={formData.name}
                                onChange={(event) =>
                                    updateField("name", event.target.value)
                                }
                                className={`${inputClass} mt-2 w-full rounded-md border border-[#c5ccd6] px-3.5 py-3 text-[14px] font-normal text-[#202939] outline-none transition focus:border-[#5276a5] focus:ring-2 focus:ring-[#dce7f5]`}
                            />
                        </label>

                        <label className="block text-[14px] font-semibold text-[#344054] sm:col-span-2">
                            Description
                            <textarea
                                maxLength={500}
                                rows={3}
                                value={formData.description}
                                onChange={(event) =>
                                    updateField("description", event.target.value)
                                }
                                className={`${inputClass} mt-2 w-full resize-y rounded-md border border-[#c5ccd6] px-3.5 py-3 text-[14px] font-normal leading-6 text-[#202939] outline-none transition focus:border-[#5276a5] focus:ring-2 focus:ring-[#dce7f5]`}
                            />
                        </label>

                        <label className="block text-[14px] font-semibold text-[#344054]">
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
                                className={`${inputClass} mt-2 w-full rounded-md border border-[#c5ccd6] px-3.5 py-3 text-[14px] font-normal text-[#202939] outline-none transition focus:border-[#5276a5] focus:ring-2 focus:ring-[#dce7f5]`}
                            />
                        </label>

                        <label className="block text-[14px] font-semibold text-[#344054]">
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
                                className={`${inputClass} mt-2 w-full rounded-md border border-[#c5ccd6] px-3.5 py-3 text-[14px] font-normal text-[#202939] outline-none transition focus:border-[#5276a5] focus:ring-2 focus:ring-[#dce7f5]`}
                            />
                        </label>

                        <label className="block text-[14px] font-semibold text-[#344054]">
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
                                className={`${inputClass} mt-2 w-full rounded-md border border-[#c5ccd6] px-3.5 py-3 text-[14px] font-normal text-[#202939] outline-none transition focus:border-[#5276a5] focus:ring-2 focus:ring-[#dce7f5]`}
                            />
                        </label>

                        <label className="block text-[14px] font-semibold text-[#344054]">
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
                                className={`${inputClass} mt-2 w-full rounded-md border border-[#c5ccd6] px-3.5 py-3 text-[14px] font-normal text-[#202939] outline-none transition focus:border-[#5276a5] focus:ring-2 focus:ring-[#dce7f5]`}
                            />
                        </label>
                    </div>

                    <div className="mt-8 border-t border-[#dfe4eb] pt-7">
                        <fieldset>
                            <legend className="text-[15px] font-semibold text-[#202939]">
                                Allowed employment types *
                            </legend>

                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {["Salaried", "Self-Employed"].map((option) => (
                                    <label
                                        key={option}
                                        className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-[#d0d7e1] bg-white px-4 py-3 text-[14px] font-medium text-[#344054] transition-colors hover:border-[#9baabd] hover:bg-[#f8fafc] has-checked:border-[#91a9c9] has-checked:bg-[#f2f6fb]"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.allowedEmploymentTypes.includes(option)}
                                            onChange={() =>
                                                toggleOption("allowedEmploymentTypes", option)
                                            }
                                            className="h-4 w-4 shrink-0 accent-[#294f80] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5276a5]"
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </fieldset>

                        <fieldset className="mt-7">
                            <legend className="text-[15px] font-semibold text-[#202939]">
                                Allowed salary types *
                            </legend>

                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {["DAT", "Cash", "Cheque"].map((option) => (
                                    <label
                                        key={option}
                                        className="flex min-h-12 cursor-pointer items-center gap-3 rounded-md border border-[#d0d7e1] bg-white px-4 py-3 text-[14px] font-medium text-[#344054] transition-colors hover:border-[#9baabd] hover:bg-[#f8fafc] has-checked:border-[#91a9c9] has-checked:bg-[#f2f6fb]"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.allowedSalaryTypes.includes(option)}
                                            onChange={() =>
                                                toggleOption("allowedSalaryTypes", option)
                                            }
                                            className="h-4 w-4 shrink-0 accent-[#294f80] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5276a5]"
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </fieldset>
                    </div>
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-[#d5dbe4] bg-[#f8fafc] px-5 py-5 sm:flex-row sm:justify-end sm:px-7">
                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                        className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#c5ccd6] bg-white px-5 py-2.5 text-[14px] font-semibold text-[#344054] transition-colors hover:bg-[#f1f4f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64748b] focus-visible:ring-offset-2"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#244a7c] bg-[#294f80] px-5 py-2.5 text-[14px] font-semibold text-white transition-colors hover:bg-[#203f67] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64748b] focus-visible:ring-offset-2"
                    >
                        <Save size={17} />
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </form>
        </section>
    );
}
