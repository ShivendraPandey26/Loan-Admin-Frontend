
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

    console.log(products);


    return (
        <section className="mt-7">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-[16px] font-semibold">Loan products</h2>
                    <p className="mt-1 text-[12px] text-[#858c98]">
                        Product eligibility criteria configured in the system.
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={fetchProducts}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 self-start rounded-md border border-[#dfe4eb] bg-white p-3 text-[12px] font-medium hover:bg-[#f8f9fb] disabled:opacity-50"
                    >
                        <RefreshCw size={14} />
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/products/new")}
                        className="inline-flex items-center gap-2 rounded-md bg-blue-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-800"
                    >
                        <Plus size={16} />
                        Create Product
                    </button>
                </div>
            </div>

            <div className="mb-4 flex items-center gap-3 rounded-md border border-[#e0e4ea] bg-white px-3">
                <Search size={16} className="shrink-0 text-[#858c98]" />
                <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search loan products"
                    aria-label="Search loan products"
                    className="h-10 w-full bg-transparent text-[13px] outline-none placeholder:text-[#a0a6b0]"
                />
                <select
                    value={employmentFilter}
                    onChange={(event) => setEmploymentFilter(event.target.value)}
                    className="rounded-md border border-[#dfe4eb] bg-white px-3 py-2 mx-2 text-sm text-[#344054] outline-none focus:border-blue-500"
                >
                    <option value="All">All employment types</option>
                    <option value="Salaried">Salaried</option>
                    <option value="Self-Employed">Self-Employed</option>
                </select>

                <select
                    value={salaryFilter}
                    onChange={(event) => setSalaryFilter(event.target.value)}
                    className="rounded-md border border-[#dfe4eb] bg-white px-3 py-2 mx-2 text-sm text-[#344054] outline-none focus:border-blue-500"
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

            <div className="overflow-x-auto rounded-lg border border-[#e2e6ec] bg-white">
                <table className="w-full min-w-180 border-collapse text-left">
                    <thead className="bg-[#fafbfc]">
                        <tr className="border-b border-[#e8ebf0] text-[11px] font-semibold uppercase tracking-[0.6px] text-[#7c8593]">
                            <th className="px-5 py-3">Product</th>
                            <th className="px-5 py-3">Age range</th>
                            <th className="px-5 py-3">Min. credit score</th>
                            <th className="px-5 py-3">Employment</th>
                            <th className="px-5 py-3">Salary Types</th>
                            <th className="px-5 py-3">Min. monthly salary</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-[#edf0f3]">
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
                                <td
                                    colSpan={5}
                                    className="px-5 py-12 text-center text-[12px] text-[#858c98]"
                                >
                                    Loading loan products...
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
