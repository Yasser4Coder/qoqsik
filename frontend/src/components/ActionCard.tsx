import type { ActionTile } from '../data/actions.ts';

type ActionCardProps = {
  tile: ActionTile;
};

export function ActionCard({ tile }: ActionCardProps) {
  const Icon = tile.icon;
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-panel">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lavender text-indigo">
        <Icon size={22} />
      </span>
      <div>
        <h3 className="text-base font-semibold text-indigo">{tile.title}</h3>
        <p className="text-sm text-slate/80">{tile.description}</p>
      </div>
    </article>
  );
}

