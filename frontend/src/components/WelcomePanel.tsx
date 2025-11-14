export function WelcomePanel() {
  return (
    <section className="rounded-3xl bg-white/80 p-8 text-center shadow-panel">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-indigo to-blue-400 text-white shadow-lg">
        <span className="text-3xl font-semibold">●</span>
      </div>
      <h1 className="mt-6 text-3xl font-semibold text-indigo">
        Welcome, Mohamed
      </h1>
      <p className="mt-3 text-sm text-slate/80">
        Start by scripting a task, and let the chat take over. Not sure where to
        start?
      </p>
    </section>
  );
}

