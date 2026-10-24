import { useState } from "react";
import { LockKeyhole, ArrowRight, UserPlus, EyeOff, Eye } from "lucide-react";
import api from "../lib/api";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        if (!email.trim() || !password) {
            setError("Enter your email address and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await api.post("/auth/login", {
                email: email.trim(),
                password,
            });

            const { token, account } = response.data;

            if (!token || !account) {
                throw new Error("The server returned an unexpected response.");
            }

            localStorage.setItem("loan_admin_token", token);
            onLogin(account);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.message ||
                "Unable to sign in. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-4 py-10">
            <section className="w-full max-w-lg rounded-xl border border-slate-300 bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.04)] sm:p-8">
                <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-lg border border-[#dce5f0] bg-[#f0f5fb] text-[#294f80]">
                    <LockKeyhole size={21} strokeWidth={1.8} />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#647084]">
                    Loan Administration
                </p>

                <h1 className="mt-2.5 text-2xl font-bold tracking-tight text-[#172033] sm:text-[27px]">
                    Sign in to your account
                </h1>

                <p className="mt-2 text-sm leading-6 text-[#647084]">
                    Use your authorized account to access the internal workspace.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-1"
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-[#344054]"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="username"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="you@company.com"
                            required
                            className="h-12 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 text-sm text-[#202938] outline-none transition-colors placeholder:text-[#98a2b3] hover:border-[#cbd5e1] focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10"
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
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter your password"
                                required
                                minLength={6}
                                className="h-12 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 pr-11 text-sm text-[#202938] outline-none transition-colors placeholder:text-[#98a2b3] hover:border-[#cbd5e1] focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                className="absolute inset-y-0 right-0 flex items-center px-3.5 text-[#7a8495] hover:text-[#294f80] focus:outline-none"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="col-span-full rounded-lg border border-[#f2caca] bg-[#fff7f7] px-3.5 py-3 text-sm leading-5 text-[#b42318]">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="col-span-full flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#294f80] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#203f67] focus:outline-none focus:ring-2 focus:ring-[#294f80]/25 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                        {!loading && <ArrowRight size={17} />}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/signup")}
                        className="col-span-full flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#cbd5e1] bg-white px-4 text-sm font-semibold text-[#294f80] transition-colors hover:border-[#294f80] hover:bg-[#f5f8fc]"
                    >
                        <UserPlus size={17} />
                        Sign up as Viewer
                    </button>
                </form>
            </section>
        </main>
    );
}

export default Login;
