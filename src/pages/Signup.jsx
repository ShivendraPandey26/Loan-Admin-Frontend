import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    UserPlus,
    ArrowRight,
    Eye,
    EyeOff,
} from "lucide-react";
import api from "../lib/api";

export default function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const name = formData.name.trim();
        const email = formData.email.trim().toLowerCase();
        const { password, confirmPassword } = formData;

        if (!name || !email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await api.post("/auth/signup", {
                name,
                email,
                password,
            });

            setSuccess(
                "Account created successfully. Redirecting to sign in..."
            );

            setTimeout(() => {
                navigate("/login", { replace: true });
            }, 1000);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "h-12 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 text-sm text-[#202938] outline-none transition-colors placeholder:text-[#98a2b3] hover:border-[#cbd5e1] focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10 disabled:cursor-not-allowed disabled:bg-[#f7f8fa]";

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-4 py-10">
            <section className="w-full max-w-2xl rounded-xl border border-slate-300 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.04)] sm:p-8">
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-lg border border-[#dce5f0] bg-[#f0f5fb] text-[#294f80]">
                    <UserPlus size={21} strokeWidth={1.8} />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#647084]">
                    Loan Administration
                </p>

                <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-[#172033] sm:text-[27px]">
                    Create your account
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#647084]">
                    Register as a Viewer to access the loan administration workspace.
                </p>

                <div className="mt-5 flex items-center gap-3 rounded-lg border border-[#dce5f0] bg-[#f7faff] px-3.5 py-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e8eff8] text-[#294f80]">
                        <UserPlus size={18} />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-[#243b5a]">
                            Viewer Account
                        </p>
                        <p className="mt-0.5 text-xs text-[#647084]">
                            Read-only workspace access
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2"
                >
                    <div>
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-[#344054]"
                        >
                            Full name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            maxLength={100}
                            required
                            disabled={loading}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-[#344054]"
                        >
                            Email address
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@company.com"
                            required
                            disabled={loading}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-[#344054]"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                minLength={6}
                                required
                                disabled={loading}
                                className={`${inputClass} pr-11`}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword((previous) => !previous)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8792a2] hover:text-[#294f80]"
                            >
                                {showPassword ? (
                                    <EyeOff size={17} />
                                ) : (
                                    <Eye size={17} />
                                )}
                            </button>
                        </div>

                        <p className="mt-1.5 text-xs text-[#7a8495]">
                            Use at least 6 characters.
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="mb-2 block text-sm font-medium text-[#344054]"
                        >
                            Confirm password
                        </label>

                        <div className="relative">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={
                                    showConfirmPassword ? "text" : "password"
                                }
                                autoComplete="new-password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Re-enter your password"
                                required
                                disabled={loading}
                                className={`${inputClass} pr-11`}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (previous) => !previous
                                    )
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide confirm password"
                                        : "Show confirm password"
                                }
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8792a2] hover:text-[#294f80]"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff size={17} />
                                ) : (
                                    <Eye size={17} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div
                            role="alert"
                            className="col-span-full rounded-lg border border-[#f2caca] bg-[#fff7f7] px-3.5 py-3 text-sm leading-5 text-[#b42318]"
                        >
                            {error}
                        </div>
                    )}

                    {/* Success message */}
                    {success && (
                        <div
                            role="status"
                            className="col-span-full rounded-lg border border-[#b7e4c7] bg-[#f0fdf4] px-3.5 py-3 text-sm leading-5 text-[#15803d]"
                        >
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="col-span-full flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#294f80] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#203f67] focus:outline-none focus:ring-2 focus:ring-[#294f80]/25 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Viewer Account"}

                        {!loading && <ArrowRight size={17} />}
                    </button>
                </form>

                <div className="mt-6 border-t border-[#e8ebf0] pt-5 text-center">
                    <p className="text-sm text-[#647084]">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold text-[#294f80] hover:text-[#203f67] hover:underline"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}