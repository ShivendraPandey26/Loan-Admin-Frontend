
import { useEffect, useState } from "react";
import { Search, Plus, RefreshCw, Landmark, Trash2 } from "lucide-react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

function Products() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [employmentFilter, setEmploymentFilter] = useState("All");
    const [salaryFilter, setSalaryFilter] = useState("All");

    async function fetchProducts() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/products");
            const result = response.data.data;

            setProducts(Array.isArray(result) ? result : result?.products ?? []);
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to load loan products."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchesEmployment =
            employmentFilter === "All" ||
            product.allowedEmploymentTypes?.includes(employmentFilter);

        const matchesSalary =
            salaryFilter === "All" ||
            product.allowedSalaryTypes?.includes(salaryFilter);

        return matchesSearch && matchesEmployment && matchesSalary;
    });

    const handleDeleteProduct = async (product) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) return;

        try {
            await api.delete(`/products/${product._id}`);
            await fetchProducts();
        } catch (error) {
            console.error("Failed to delete product:", error);

            window.alert(
                error.response?.data?.message ||
                "Failed to delete product. Please try again."
            );
        }
    };

    return (
        <section className="mt-7">

            <div className="mb-6 flex flex-col justify-between gap-4 border-b border-[#cbd2dc] pb-5 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-[17px] font-semibold tracking-[-0.3px] text-[#182230]">
                        Loan products
                    </h2>
                    <p className="mt-1.5 text-[12px] leading-5 text-[#667085]">
                        Product eligibility criteria configured in the system.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={fetchProducts}
                        disabled={loading}
                        aria-label="Refresh loan products"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#c5ccd6] bg-white text-[#475467] transition-colors hover:bg-[#f3f5f8] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64748b] focus-visible:ring-offset-2"
                    >
                        <RefreshCw size={15} />
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/products/new")}
                        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[#244a7c] bg-[#294f80] px-4 text-[12px] font-semibold text-white transition-colors hover:bg-[#203f67] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#64748b] focus-visible:ring-offset-2"
                    >
                        <Plus size={15} />
                        Create Product
                    </button>
                </div>
            </div>

            <div className="mb-5 grid grid-cols-1 gap-3 rounded-lg border border-[#cbd2dc] bg-[#f8f9fb] p-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_200px_180px]">
                <div className="flex h-10 min-w-0 items-center gap-2.5 rounded-md border border-[#c5ccd6] bg-white px-3 transition-colors focus-within:border-[#64748b] focus-within:ring-2 focus-within:ring-[#e2e8f0]">
                    <Search size={15} className="shrink-0 text-[#667085]" />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search loan products"
                        aria-label="Search loan products"
                        className="h-full w-full min-w-0 bg-transparent text-[12px] text-[#202939] outline-none placeholder:text-[#98a2b3]"
                    />
                </div>

                <select
                    value={employmentFilter}
                    onChange={(event) => setEmploymentFilter(event.target.value)}
                    aria-label="Filter by employment type"
                    className="h-10 w-full rounded-md border border-[#c5ccd6] bg-white px-3 text-[12px] text-[#344054] outline-none transition-colors focus:border-[#64748b] focus:ring-2 focus:ring-[#e2e8f0]"
                >
                    <option value="All">All employment types</option>
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                </select>

                <select
                    value={salaryFilter}
                    onChange={(event) => setSalaryFilter(event.target.value)}
                    aria-label="Filter by salary type"
                    className="h-10 w-full rounded-md border border-[#c5ccd6] bg-white px-3 text-[12px] text-[#344054] outline-none transition-colors focus:border-[#64748b] focus:ring-2 focus:ring-[#e2e8f0]"
                >
                    <option value="All">All salary types</option>
                    <option value="DAT">DAT</option>
                    <option value="Cash">Cash</option>
                    <option value="Cheque">Cheque</option>
                </select>
            </div>


            {error && (
                <div
                    role="alert"
                    className="mb-4 rounded-md border border-[#f0d3d1] bg-[#fff7f6] p-3 text-[13px] text-[#a13f38]"
                >
                    {error}
                    <button onClick={fetchProducts} className="ml-3 underline">
                        Try again
                    </button>
                </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-[#c5ccd6] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
                <table className="w-full min-w-225 border-collapse text-left">
                    <thead className="bg-[#f1f4f8]">
                        <tr className="border-b border-[#c5ccd6] text-[10px] font-semibold uppercase tracking-[0.8px] text-[#475467]">
                            <th className="px-5 py-4">Product</th>
                            <th className="px-5 py-4">Age range</th>
                            <th className="px-5 py-4">Min. credit score</th>
                            <th className="px-5 py-4">Employment</th>
                            <th className="px-5 py-4">Salary types</th>
                            <th className="px-5 py-4">Min. monthly salary</th>
                            <th className="px-5 py-4 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[#dfe4eb]">
                        {!loading &&
                            filteredProducts.map((product) => (
                                <tr
                                    key={product._id}
                                    onClick={() => navigate(`/products/${product._id}`)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter" || event.key === " ") {
                                            event.preventDefault();
                                            navigate(`/products/${product._id}`);
                                        }
                                    }}
                                    tabIndex={0}
                                    role="link"
                                    aria-label={`Edit ${product.name}`}
                                    className="cursor-pointer text-[12px] transition-colors hover:bg-[#f6f8fa] focus-visible:outline-2 focus-visible:outline-blue-600"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#e6eaf0] bg-[#fafbfc] text-[#536782]">
                                                <Landmark size={16} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[#28313d]">
                                                    {product.name}
                                                </p>
                                                <p className="mt-1 max-w-55 truncate text-[11px] text-[#858c98]">
                                                    {product.description || "No description provided"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 text-[#515b69]">
                                        {product.minAge} to {product.maxAge} years
                                    </td>

                                    <td className="px-5 py-4 text-[#515b69]">
                                        {product.minCreditScore}
                                    </td>

                                    <td className="px-5 py-4 text-[#515b69]">
                                        {product.allowedEmploymentTypes?.join(", ") || "Not set"}
                                    </td>

                                    <td className="px-5 py-4 text-[#515b69]">
                                        {product.allowedSalaryTypes?.join(", ") || "Not set"}
                                    </td>

                                    <td className="px-5 py-4 text-[#515b69]">
                                        {Number(product.minSalary).toLocaleString("en-IN", {
                                            style: "currency",
                                            currency: "INR",
                                            maximumFractionDigits: 0,
                                        })}
                                    </td>
                                    <td className="px-5 py-4 text-right">
                                        <button
                                            type="button"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleDeleteProduct(product);
                                            }}
                                            aria-label={`Delete ${product.name}`}
                                            title="Delete product"
                                            className="rounded-md border border-red-200 p-2 text-red-600 hover:bg-red-50"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>

                            ))}

                        {!loading && filteredProducts.length === 0 && !error && (
                            <tr>
                                <td colSpan={5} className="px-5 py-12 text-center">
                                    <p className="text-[13px] font-medium text-[#424b59]">
                                        No loan products found
                                    </p>
                                    <p className="mt-1 text-[12px] text-[#858c98]">
                                        Try another search or refresh the list.
                                    </p>
                                </td>
                            </tr>
                        )}

                        {loading && (
                            <tr>
                                <td colSpan={5} className="px-5 py-12 text-center align-middle">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#dfe4eb] border-t-[#294f80]" />
                                        <p className="mt-3 text-sm font-semibold text-[#344054]">
                                            Loading loan products...
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <p className="mt-3 text-[11px] text-[#858c98]">
                {loading
                    ? "Retrieving products..."
                    : `${filteredProducts.length} product${filteredProducts.length === 1 ? "" : "s"} shown`}
            </p>
        </section>
    );
}

export default Products;
