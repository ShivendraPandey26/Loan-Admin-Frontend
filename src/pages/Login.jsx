
import { useState } from "react";
import { LockKeyhole, Mail, ArrowRight } from "lucide-react";
import api from "../lib/api";

function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

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
            <section className="w-full max-w-md rounded-xl border border-[#e2e6ec] bg-white p-6 shadow-[0_4px_24px_rgba(15,23,42,0.04)] sm:p-8">
                {/* Brand icon */}
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

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-medium text-[#344054]"
                        >
                            Email address
                        </label>

                        <div className="relative">
                            <Mail
                                size={17}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8792a2]"
                            />

                            <input
                                id="email"
                                type="email"
                                autoComplete="username"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="you@company.com"
                                required
                                className="h-12 w-full rounded-lg border border-[#dfe4eb] bg-white pl-10 pr-3.5 text-sm text-[#202938] outline-none transition-colors placeholder:text-[#98a2b3] hover:border-[#cbd5e1] focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-[#344054]"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            placeholder="Enter your password"
                            required
                            className="h-12 w-full rounded-lg border border-[#dfe4eb] bg-white px-3.5 text-sm text-[#202938] outline-none transition-colors placeholder:text-[#98a2b3] hover:border-[#cbd5e1] focus:border-[#294f80] focus:ring-2 focus:ring-[#294f80]/10"
                        />
                    </div>

                    {/* Error message */}
                    {error && (
                        <div
                            role="alert"
                            className="rounded-lg border border-[#f2caca] bg-[#fff7f7] px-3.5 py-3 text-sm leading-5 text-[#b42318]"
                        >
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#294f80] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#203f67] focus:outline-none focus:ring-2 focus:ring-[#294f80]/25 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                        {!loading && <ArrowRight size={17} />}
                    </button>
                </form>

                {/* Access note */}
                <div className="mt-7 border-t border-[#e8ebf0] pt-5">
                    <p className="text-xs leading-5 text-[#7a8495]">
                        Access is restricted to authorized Admin and Viewer accounts.
                    </p>
                </div>
            </section>
        </main>
    );
}

export default Login;
