import { useEffect, useState } from "react";
import { DashboardShell } from "../components/layouts/DashboardShell.tsx";
import {
  PlanCard,
  PremiumPlanCard,
} from "../components/subscription/PlanCard.tsx";
import { fetchSubscriptionPlans, type SubscriptionPlan } from "../lib/api.ts";

export function SubscriptionPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionPlans()
      .then(setPlans)
      .catch((err) => setError((err as Error).message));
  }, []);

  return (
    <DashboardShell>
      <section className="rounded-3xl border border-indigo/10 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate/60">
              Current plan
            </p>
            <h2 className="text-2xl font-semibold text-indigo">
              You&apos;re on the Professional plan
            </h2>
            <p className="text-sm text-slate/70">
              Your next billing date is April 28, 2025.
            </p>
          </div>
          <button className="rounded-full border border-indigo/20 px-6 py-2 text-sm font-semibold text-indigo transition hover:border-indigo/40">
            Manage billing
          </button>
        </div>
      </section>

      <section className="rounded-[36px] border-2 border-dashed border-[#C7A8FF] bg-white/70 p-8 shadow-panel">
        {error && (
          <p className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {plans.map((plan) =>
            plan.name === "Company" ? (
              <PremiumPlanCard
                key={plan.name}
                price={plan.price}
                period={plan.period}
                title={plan.name}
                description={plan.description}
                features={plan.features}
                actionLabel={plan.highlight ? "Current plan" : "Upgrade plan"}
                badge={plan.highlight ? "Most Popular" : undefined}
                variant={plan.highlight ? "gradient" : "light"}
              />
            ) : (
              <PlanCard
                key={plan.name}
                price={plan.price}
                period={plan.period}
                title={plan.name}
                description={plan.description}
                features={plan.features}
                actionLabel={plan.highlight ? "Current plan" : "Upgrade plan"}
                buttonVariant={plan.highlight ? "secondary" : "primary"}
                highlight={plan.highlight}
              />
            ),
          )}
        </div>
      </section>
    </DashboardShell>
  );
}

