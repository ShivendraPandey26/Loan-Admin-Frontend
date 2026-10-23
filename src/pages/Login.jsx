
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
            <section className="w-full max-w-100 rounded-lg border border-[#e1e5eb] bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-md bg-[#233b63] text-white">
                    <LockKeyhole size={19} strokeWidth={1.8} />
                </div>

                <p className="text-[11px] font-semibold uppercase tracking-[1.2px] text-[#68778d]">
                    Loan Administration
                </p>

                <h1 className="mt-2 text-[25px] font-semibold tracking-[-0.6px] text-[#202631]">
                    Sign in to your account
                </h1>

                <p className="mt-2 text-[13px] leading-5 text-[#737c89]">
                    Use your authorized account to access the internal workspace.
                </p>

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-[12px] font-medium text-[#424b59]"
                        >
                            Email address
                        </label>

                        <div className="relative">
                            <Mail
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a93a0]"
                            />
                            <input
                                id="email"
                                type="email"
                                autoComplete="username"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="you@company.com"
                                required
                                className="h-11 w-full rounded-md border border-[#dfe4eb] bg-white pl-9 pr-3 text-[13px] outline-none focus:border-[#8194b0] focus:ring-2 focus:ring-[#233b63]/10"
                            />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-[12px] font-medium text-[#424b59]"
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
                            className="h-11 w-full rounded-md border border-[#dfe4eb] bg-white px-3 text-[13px] outline-none focus:border-[#8194b0] focus:ring-2 focus:ring-[#233b63]/10"
                        />
                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="rounded-md border border-[#f0d3d1] bg-[#fff7f6] px-3 py-2.5 text-[12px] leading-5 text-[#a13f38]"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#233b63] px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#192e4e] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                        {!loading && <ArrowRight size={16} />}
                    </button>
                </form>

                <p className="mt-6 border-t border-[#edf0f3] pt-5 text-[11px] leading-5 text-[#858c98]">
                    Access is restricted to authorized Admin and Viewer accounts.
                </p>
            </section>
        </main>
    );
}

export default Login;
