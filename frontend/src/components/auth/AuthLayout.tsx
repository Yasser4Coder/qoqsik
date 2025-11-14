import type { ReactNode } from "react";
export function DecorativePanel() {
  return (
    <section className="relative hidden flex-1 overflow-hidden bg-[#02062D] lg:block">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#040825] via-[#04194A] to-black" />
        <div className="absolute inset-x-0 top-0 h-2/3 bg-gradient-to-br from-[#071443] via-[#021F5B] to-[#010512]" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#1C1C1C] via-[#141414] to-transparent" />

        <div className="absolute -left-12 top-10 h-96 w-96 rounded-[120px] bg-gradient-to-br from-[#0e368a] via-[#0c4ea2] to-transparent opacity-80 blur-3xl" />
        <div className="absolute left-1/3 top-0 h-[32rem] w-[22rem] rounded-[180px] bg-gradient-to-br from-[#104fb5] via-[#0a3785] to-transparent opacity-70 blur-[100px]" />
        <div className="absolute right-10 top-5 h-[40rem] w-[24rem] rounded-[200px] bg-gradient-to-br from-[#0E2C68] via-[#062055] to-transparent opacity-80 blur-[100px]" />
        <div className="absolute left-1/4 bottom-10 h-[28rem] w-[28rem] rounded-[180px] bg-gradient-to-br from-[#1c4f97] via-[#0f2d63] to-transparent opacity-70 blur-[120px]" />
      </div>
    </section>
  );
}

type AuthInputProps = {
  label: string;
  placeholder: string;
  type?: string;
  icon?: ReactNode;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  autoComplete?: string;
};

export function AuthInput({
  label,
  placeholder,
  type = "text",
  icon,
  name,
  value,
  onChange,
  autoComplete,
}: AuthInputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-indigo">
      {label}
      <div className="flex items-center rounded-lg border border-transparent bg-white/80 px-4 py-3 text-base text-indigo focus-within:border-indigo/40 focus-within:ring-2 focus-within:ring-indigo/20">
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          autoComplete={autoComplete}
          onChange={(event) => onChange?.(event.target.value)}
          className="flex-1 bg-transparent text-sm font-medium text-indigo placeholder:text-slate/50 focus:outline-none"
        />
        {icon}
      </div>
    </label>
  );
}
