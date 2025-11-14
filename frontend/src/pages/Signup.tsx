import { type FormEvent, useState } from "react";
import { TbEye } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import {
  DecorativePanel,
  AuthInput,
} from "../components/auth/AuthLayout.tsx";
import { signup, setAuthUser } from "../lib/api.ts";

export function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const response = await signup({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
      });
      setAuthUser(response);
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const errorMessage =
        err?.message || "An error occurred during signup. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#E3ECFF] text-indigo lg:flex-row">
      <DecorativePanel />
      <section className="flex w-full flex-col items-center justify-center bg-[#E3ECFF] px-6 py-12 lg:max-w-md lg:px-14">
        <div className="w-full max-w-sm space-y-8">
          <header className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate/70">
              Create account
            </p>
            <h1 className="text-3xl font-semibold text-indigo">Sign up</h1>
            <p className="text-sm text-slate/80">
              Join us today and unlock personalized job hunting tools.
            </p>
          </header>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <AuthInput
              label="Full Name"
              placeholder="Enter your name"
              name="full_name"
              value={form.full_name}
              autoComplete="name"
              onChange={(value) =>
                setForm((prev) => ({ ...prev, full_name: value }))
              }
            />
            <AuthInput
              label="Email Address"
              placeholder="Email"
              type="email"
              name="email"
              value={form.email}
              autoComplete="email"
              onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
            />
            <AuthInput
              label="Password"
              placeholder="Create a password"
              type="password"
              name="password"
              value={form.password}
              autoComplete="new-password"
              onChange={(value) =>
                setForm((prev) => ({ ...prev, password: value }))
              }
              icon={
                <TbEye className="cursor-pointer text-slate/50 transition hover:text-indigo" />
              }
            />
            <AuthInput
              label="Confirm Password"
              placeholder="Confirm password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              autoComplete="new-password"
              onChange={(value) =>
                setForm((prev) => ({ ...prev, confirmPassword: value }))
              }
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#3E32B3] py-3 text-sm font-semibold text-white shadow-lg shadow-indigo/30 transition hover:bg-[#31258b] disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-slate/60">
              <span className="h-px flex-1 bg-slate/30" />
              Or
              <span className="h-px flex-1 bg-slate/30" />
            </div>
            <button className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/80 bg-white py-3 text-sm font-semibold text-indigo shadow-sm transition hover:border-indigo/30">
              <FcGoogle className="text-xl" />
              Sign up with Google
            </button>
            <p className="text-center text-sm text-slate/80">
              Already have an account?{" "}
              <Link to="/" className="font-semibold text-indigo">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

