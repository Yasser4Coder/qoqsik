import { TbBell, TbHelpCircle, TbGift } from 'react-icons/tb';

export function TopBar() {
  return (
    <header className="flex items-center justify-end gap-3">
      <button className="rounded-full bg-indigo px-5 py-2 text-sm font-semibold text-white shadow-panel">
        Upgrade
      </button>
      <button className="rounded-full border border-white/60 bg-white/70 p-2 text-slate hover:text-indigo">
        <TbHelpCircle size={20} />
      </button>
      <button className="rounded-full border border-white/60 bg-white/70 p-2 text-slate hover:text-indigo">
        <TbGift size={20} />
      </button>
      <button className="rounded-full border border-white/60 bg-white/70 p-2 text-slate hover:text-indigo">
        <TbBell size={20} />
      </button>
    </header>
  );
}

