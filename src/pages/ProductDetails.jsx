
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
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
        return <p className="py-12 text-center text-sm text-gray-500">
            Loading product details...
        </p>;
    }

    if (error || !product) {
        return (
            <section className="mt-7 rounded-lg border border-gray-200 bg-white p-6">
                <p className="text-sm text-red-600">
                    {error || "Product not found."}
                </p>
                <button
                    onClick={() => navigate("/")}
                    className="mt-4 rounded-md border px-3 py-2 text-sm"
                >
                    Back to products
                </button>
            </section>
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
        <div className="mt-7 space-y-6">
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft size={16} />
                Back to products
            </button>

            <section className="rounded-lg border border-gray-200 bg-white">
                <div className="flex flex-col justify-between gap-4 border-b border-gray-200 p-5 sm:flex-row sm:items-start">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {product.name}
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                            {product.description || "No description provided."}
                        </p>
                    </div>

                    <div className="flex shrink-0 gap-2">
                        <button
                            onClick={() => navigate(`/products/${id}/edit`)}
                            className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                        >
                            <Edit size={15} />
                            Edit
                        </button>

                        <button
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex items-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                            <Trash2 size={15} />
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>

                <div className="p-5">
                    <h3 className="text-sm font-semibold text-gray-900">
                        Eligibility criteria
                    </h3>

                    <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {details.map(([label, value]) => (
                            <div key={label}>
                                <dt className="text-xs text-gray-500">{label}</dt>
                                <dd className="mt-1 text-sm font-medium text-gray-900">
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
