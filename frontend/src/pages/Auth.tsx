import { type FormEvent, useState } from "react";
import { TbEye } from "react-icons/tb";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import {
  DecorativePanel,
  AuthInput,
} from "../components/auth/AuthLayout.tsx";
import { login } from "../lib/api.ts";

export function AuthPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form);
      navigate("/dashboard");
    } catch (err) {
      setError((err as Error).message);
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
              Welcome back
            </p>
            <h1 className="text-3xl font-semibold text-indigo">Welcome back</h1>
            <p className="text-sm text-slate/80">
              Join us now and start your job hunt journey with us.
            </p>
          </header>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              type="password"
              name="password"
              value={form.password}
              autoComplete="current-password"
              onChange={(value) =>
                setForm((prev) => ({ ...prev, password: value }))
              }
              icon={
                <TbEye className="text-slate/50 transition hover:text-indigo cursor-pointer" />
              }
            />
            <div className="text-right">
              <a
                href="#"
                className="text-sm font-medium text-indigo underline underline-offset-2"
              >
                Forget password
              </a>
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#3E32B3] py-3 text-sm font-semibold text-white shadow-lg shadow-indigo/30 transition hover:bg-[#31258b] disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign-in"}
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
              Continue with Google
            </button>
            <p className="text-center text-sm text-slate/80">
              Don&apos;t Have an Account?{" "}
              <Link to="/signup" className="font-semibold text-indigo">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

