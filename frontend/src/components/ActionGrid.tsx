import { quickActions } from '../data/actions.ts';
import { ActionCard } from './ActionCard.tsx';

export function ActionGrid() {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {quickActions.map((tile) => (
        <ActionCard key={tile.title} tile={tile} />
      ))}
    </section>
  );
}

