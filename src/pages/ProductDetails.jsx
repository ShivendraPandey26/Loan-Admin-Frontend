
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Edit, Trash2 } from "lucide-react";
import api from "../lib/api";

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function fetchProduct() {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/products/${id}`);
                const data = response.data?.data;
                const result = data?.product ?? data;

                if (!result?._id) {
                    throw new Error("Product details could not be found.");
                }

                if (!cancelled) setProduct(result);
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err.response?.data?.message ||
                        err.message ||
                        "Failed to load product details."
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchProduct();

        return () => {
            cancelled = true;
        };
    }, [id]);

    async function handleDelete() {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) return;

        try {
            setDeleting(true);
            await api.delete(`/products/${id}`);
            navigate("/");
        } catch (err) {
            window.alert(
                err.response?.data?.message ||
                "Failed to delete product. Please try again."
            );
        } finally {
            setDeleting(false);
        }
    }



    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white px-5">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#d5dbe4] border-t-[#294f80]" />

                <p className="mt-4 text-[13px] font-semibold text-[#344054]">
                    Loading product details
                </p>

                <p className="mt-1 text-[12px] text-[#7b8493]">
                    Please wait while the details are retrieved.
                </p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="mx-auto mt-10 max-w-xl rounded-lg border border-[#d5dbe4] bg-white p-6 shadow-[0_1px_3px_rgba(16,24,40,0.04)] sm:p-8">
                <div className="flex h-11 w-11 items-center justify-center rounded-md border border-[#f0d3d1] bg-[#fff5f4] text-[#b42318]">
                    <AlertCircle size={20} strokeWidth={1.8} />
                </div>

                <h2 className="mt-4 text-[15px] font-semibold text-[#202939]">
                    Unable to load product
                </h2>

                <p className="mt-2 text-[13px] leading-6 text-[#667085]">
                    {error || "Product not found."}
                </p>

                <div className="mt-6 border-t border-[#e5e7eb] pt-4">
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="inline-flex items-center gap-2 rounded-md border border-[#c5ccd6] bg-white px-4 py-2.5 text-[12px] font-semibold text-[#344054] transition-colors hover:bg-[#f3f5f8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64748b] focus-visible:ring-offset-2"
                    >
                        <ArrowLeft size={15} />
                        Back to products
                    </button>
                </div>
            </div>
        );
    }


    const details = [
        ["Minimum age", `${product.minAge} years`],
        ["Maximum age", `${product.maxAge} years`],
        ["Minimum credit score", product.minCreditScore],
        [
            "Minimum monthly salary",
            Number(product.minSalary).toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }),
        ],
        [
            "Allowed employment types",
            product.allowedEmploymentTypes?.join(", ") || "Not specified",
        ],
        [
            "Allowed salary types",
            product.allowedSalaryTypes?.join(", ") || "Not specified",
        ],
    ];

    return (
        <div className="mt-8 space-y-6">
            <button
                type="button"
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 rounded-md text-[14px] font-medium text-[#596579] transition-colors hover:text-[#182230] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64748b] focus-visible:ring-offset-2"
            >
                <ArrowLeft size={18} />
                Back to products
            </button>

            <section className="overflow-hidden rounded-xl border border-[#c3ccd8] bg-white shadow-[0_2px_8px_rgba(16,24,40,0.04)]">
                <div className="flex flex-col justify-between gap-6 border-b border-[#c3ccd8] bg-[#f8fafc] p-6 sm:flex-row sm:items-start sm:p-8">
                    <div className="min-w-0">
                        <p className="mb-3 text-[12px] font-semibold uppercase tracking-[1.5px] text-[#64748b]">
                            Loan product details
                        </p>

                        <h2 className="wrap-break-word text-2xl font-semibold leading-tight tracking-[-0.6px] text-[#172033] sm:text-3xl">
                            {product.name}
                        </h2>

                        <p className="mt-3 max-w-3xl text-[14px] leading-7 text-[#596579] sm:text-[15px]">
                            {product.description || "No description provided."}
                        </p>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(`/products/${id}/edit`)}
                            className="inline-flex items-center gap-2 rounded-md border border-[#b9c3d0] bg-white px-4 py-3 text-[14px] font-semibold text-[#344054] transition-colors hover:border-[#8795a8] hover:bg-[#f1f5f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64748b] focus-visible:ring-offset-2"
                        >
                            <Edit size={17} />
                            Edit product
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="inline-flex items-center gap-2 rounded-md border border-[#e5b8b5] bg-white px-4 py-3 text-[14px] font-semibold text-[#b42318] transition-colors hover:border-[#d98b86] hover:bg-[#fff1f0] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] focus-visible:ring-offset-2"
                        >
                            <Trash2 size={17} />
                            {deleting ? "Deleting..." : "Delete product"}
                        </button>
                    </div>
                </div>

                <div className="p-6 sm:p-8">
                    <div className="border-b border-[#d8dee7] pb-5">
                        <h3 className="text-lg font-semibold tracking-[-0.2px] text-[#172033] sm:text-xl">
                            Eligibility criteria
                        </h3>
                        <p className="mt-2 text-[13px] leading-6 text-[#647084] sm:text-[14px]">
                            Minimum requirements configured for this product.
                        </p>
                    </div>

                    <dl className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {details.map(([label, value]) => (
                            <div
                                key={label}
                                className="min-w-0 border-b border-[#e0e5ec] py-5 sm:px-5 sm:odd:pl-0 sm:even:border-l sm:even:pl-5 lg:nth-[3n+1]:border-l-0 lg:nth-[3n+1]:pl-0 lg:nth-[3n]:border-l lg:nth-[3n]:pl-5"
                            >
                                <dt className="text-[13px] font-medium leading-5 text-[#647084] sm:text-[14px]">
                                    {label}
                                </dt>
                                <dd className="mt-2 wrap-break-word text-[16px] font-semibold leading-6 text-[#202939] sm:text-[17px]">
                                    {value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </section>
        </div>
    );
}
