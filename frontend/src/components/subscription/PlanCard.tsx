import type { ReactNode } from "react";

type PlanCardProps = {
  price: string;
  period: string;
  title: string;
  description: string;
  features: string[];
  actionLabel: string;
  buttonVariant?: "primary" | "secondary" | "muted";
  footer?: ReactNode;
  className?: string;
  highlight?: boolean;
};

const buttonStyles: Record<
  NonNullable<PlanCardProps["buttonVariant"]>,
  string
> = {
  primary: "bg-[#7CB0FF] text-white hover:bg-[#6aa3fb]",
  secondary: "bg-[#8C86FF] text-white hover:bg-[#7b75ef]",
  muted:
    "bg-[#E5E7F0] text-slate hover:bg-[#d9dce9] disabled:cursor-not-allowed disabled:opacity-60",
};

export function PlanCard({
  price,
  period,
  title,
  description,
  features,
  actionLabel,
  buttonVariant = "primary",
  footer,
  className,
  highlight = false,
}: PlanCardProps) {
  return (
    <article
      className={`flex h-full flex-col rounded-[28px] border ${
        highlight
          ? "border-transparent bg-gradient-to-b from-[#4E3EDC] via-[#3523B9] to-[#081F6B] text-white shadow-2xl"
          : "border-[#E4E1FF] bg-white/90 text-indigo shadow-sm"
      } p-6 ${className ?? ""}`}
    >
      <p
        className={`text-3xl font-bold ${
          highlight ? "text-white" : "text-[#1F1C4F]"
        }`}
      >
        {price}
        <span
          className={`text-base font-normal ${
            highlight ? "text-white/70" : "text-slate/70"
          }`}
        >
          {" "}
          {period}
        </span>
      </p>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p
        className={`mt-2 text-sm ${
          highlight ? "text-white/70" : "text-slate/70"
        }`}
      >
        {description}
      </p>

      <ul
        className={`mt-6 flex-1 space-y-3 text-sm ${
          highlight ? "text-white" : "text-[#3B3B6E]"
        }`}
      >
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                highlight
                  ? "bg-white/15 text-white"
                  : "bg-gradient-to-br from-[#C0A0FF] via-[#A886FF] to-[#6CD2FF] text-white shadow-sm"
              }`}
            >
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>

      <button
        className={`mt-8 w-full rounded-full py-3 text-sm font-semibold transition ${
          highlight
            ? "bg-white/90 text-[#0A1F4F] shadow-lg hover:bg-white"
            : buttonStyles[buttonVariant]
        }`}
      >
        {actionLabel}
      </button>
      {footer}
    </article>
  );
}

type PremiumPlanCardProps = Omit<
  PlanCardProps,
  "buttonVariant" | "footer" | "highlight"
> & {
  badge?: string;
  variant?: "gradient" | "light";
};

export function PremiumPlanCard({
  price,
  period,
  title,
  description,
  features,
  actionLabel,
  badge,
  className,
  variant = "gradient",
}: PremiumPlanCardProps) {
  const isGradient = variant === "gradient";
  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-[36px] ${
        isGradient
          ? "bg-gradient-to-b from-[#4E3EDC] via-[#3523B9] to-[#081F6B] text-white shadow-2xl"
          : "border border-[#E4E1FF] bg-white/90 text-indigo shadow-sm"
      } p-8 ${className ?? ""}`}
    >
      {badge && isGradient && (
        <span className="absolute right-6 top-6 rounded-full bg-[#1C2D6A] px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#9FD3FF]">
          {badge}
        </span>
      )}
      <p
        className={`text-3xl font-bold ${
          isGradient ? "text-white" : "text-[#1F1C4F]"
        }`}
      >
        {price}
        <span
          className={`text-base font-normal ${
            isGradient ? "text-white/70" : "text-slate/70"
          }`}
        >
          {" "}
          {period}
        </span>
      </p>
      <h3
        className={`mt-4 text-2xl font-semibold ${
          isGradient ? "text-white" : "text-indigo"
        }`}
      >
        {title}
      </h3>
      <p
        className={`mt-3 text-sm ${
          isGradient ? "text-white/70" : "text-slate/70"
        }`}
      >
        {description}
      </p>
      <ul
        className={`mt-6 flex-1 space-y-3 text-sm ${
          isGradient ? "text-white" : "text-[#3B3B6E]"
        }`}
      >
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                isGradient
                  ? "bg-white/15 text-white"
                  : "bg-gradient-to-br from-[#C0A0FF] via-[#A886FF] to-[#6CD2FF] text-white shadow-sm"
              }`}
            >
              ✓
            </span>
            {feature}
          </li>
        ))}
      </ul>
      <button
        className={`mt-8 w-full rounded-full py-3 text-sm font-semibold ${
          isGradient
            ? "bg-white/90 text-[#0A1F4F] shadow-lg transition hover:bg-white"
            : "bg-[#8C86FF] text-white shadow-sm transition hover:bg-[#7b75ef]"
        }`}
      >
        {actionLabel}
      </button>
    </article>
  );
}

