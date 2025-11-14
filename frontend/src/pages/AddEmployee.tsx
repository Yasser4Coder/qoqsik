import { type FormEvent, useState } from "react";
import { DashboardShell } from "../components/layouts/DashboardShell.tsx";
import {
  TbUserPlus,
  TbMail,
  TbUserCircle,
  TbPhone,
  TbLock,
} from "react-icons/tb";
import { addEmployee } from "../lib/api.ts";

const roles = [
  {
    id: "admin",
    title: "Admin",
    description: "Full access to settings, billing, and automation controls.",
  },
  {
    id: "chef-service",
    title: "Chef Service",
    description: "Manage service workflows, approvals, and team readiness.",
  },
  {
    id: "employee",
    title: "Employee",
    description: "Collaborate on assigned tasks with limited permissions.",
  },
];

export function AddEmployeePage() {
  const [selectedRole, setSelectedRole] = useState<string>("employee");
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    temporary_password: "",
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setLoading(true);
    try {
      await addEmployee({
        ...form,
        role: selectedRole,
      });
      setFeedback("Employee added successfully.");
      setForm({ full_name: "", email: "", phone: "", temporary_password: "" });
    } catch (error) {
      setFeedback((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardShell>
      <section className="rounded-3xl border border-indigo/10 bg-white/80 p-8 shadow-panel">
        <div className="flex flex-col gap-4">
          <header>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate/60">
              Team
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-indigo">
              Add new employee
            </h1>
            <p className="text-sm text-slate/70">
              Invite teammates and assign roles to control what they can manage.
            </p>
          </header>

          <div className="grid gap-6 lg:grid-cols-2">
            <form
              className="space-y-5 rounded-3xl bg-white/90 p-6 shadow-inner"
              onSubmit={handleSubmit}
            >
              <label className="flex flex-col gap-2 text-sm font-semibold text-indigo">
                Full name
                <div className="flex items-center gap-3 rounded-2xl border border-indigo/10 bg-white px-4 py-3 text-slate/70 focus-within:border-indigo focus-within:text-indigo">
                  <TbUserCircle />
                  <input
                    placeholder="Ex: Lina Bensaid"
                    value={form.full_name}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, full_name: event.target.value }))
                    }
                    className="flex-1 bg-transparent text-sm font-medium text-indigo placeholder:text-slate/50 focus:outline-none"
                  />
                </div>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-indigo">
                Phone number
                <div className="flex items-center gap-3 rounded-2xl border border-indigo/10 bg-white px-4 py-3 text-slate/70 focus-within:border-indigo focus-within:text-indigo">
                  <TbPhone />
                  <input
                    placeholder="+213 5X XX XX XX"
                    value={form.phone}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, phone: event.target.value }))
                    }
                    className="flex-1 bg-transparent text-sm font-medium text-indigo placeholder:text-slate/50 focus:outline-none"
                  />
                </div>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-indigo">
                Temporary password
                <div className="flex items-center gap-3 rounded-2xl border border-indigo/10 bg-white px-4 py-3 text-slate/70 focus-within:border-indigo focus-within:text-indigo">
                  <TbLock />
                  <input
                    type="password"
                    placeholder="Choose a secure passphrase"
                    value={form.temporary_password}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        temporary_password: event.target.value,
                      }))
                    }
                    className="flex-1 bg-transparent text-sm font-medium text-indigo placeholder:text-slate/50 focus:outline-none"
                  />
                </div>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-indigo">
                Email
                <div className="flex items-center gap-3 rounded-2xl border border-indigo/10 bg-white px-4 py-3 text-slate/70 focus-within:border-indigo focus-within:text-indigo">
                  <TbMail />
                  <input
                    placeholder="name@company.com"
                    value={form.email}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, email: event.target.value }))
                    }
                    className="flex-1 bg-transparent text-sm font-medium text-indigo placeholder:text-slate/50 focus:outline-none"
                  />
                </div>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-indigo">
                Role
                <div className="rounded-2xl border border-indigo/10 bg-white px-4 py-3 text-sm text-slate/70">
                  {roles.find((role) => role.id === selectedRole)?.title}
                </div>
              </label>
              {feedback && (
                <p className="text-sm text-indigo">{feedback}</p>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-2xl bg-indigo px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo/40 transition hover:bg-[#2c2d8a] disabled:opacity-60"
              >
                <TbUserPlus />
                {loading ? "Adding..." : "Add employee"}
              </button>
            </form>

            <div className="space-y-4 rounded-3xl border border-indigo/10 bg-white/90 p-6">
              <h2 className="text-lg font-semibold text-indigo">
                Assign a role
              </h2>
              <p className="text-sm text-slate/70">
                Select the role that matches the responsibility level for this
                member.
              </p>
              <div className="grid gap-4">
                {roles.map((role) => {
                  const active = role.id === selectedRole;
                  return (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={`flex flex-col items-start gap-1 rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-indigo bg-indigo/10 text-indigo shadow-panel"
                          : "border-indigo/10 bg-white text-slate/80 hover:border-indigo/40"
                      }`}
                    >
                      <span className="text-base font-semibold">
                        {role.title}
                      </span>
                      <span className="text-sm">
                        {role.description}
                      </span>
                      {active && (
                        <span className="mt-2 rounded-full bg-indigo/10 px-3 py-1 text-xs font-semibold text-indigo">
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}

