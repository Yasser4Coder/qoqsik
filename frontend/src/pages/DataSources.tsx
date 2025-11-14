import { type ReactNode, useEffect, useState } from "react";
import { DashboardShell } from "../components/layouts/DashboardShell.tsx";
import {
  TbBrandGmail,
  TbBrandSlack,
  TbCloud,
  TbDatabase,
  TbBrandNotion,
  TbWorldShare,
} from "react-icons/tb";
import {
  API_BASE_URL,
  disconnectConnector,
  fetchConnectors,
  type Connector,
} from "../lib/api.ts";

const instructions = [
  "Every connection is one click with OAuth — no manual secrets.",
  "No API keys to paste or developer setup required.",
  "Same flow for cloud apps or on-premise network folders.",
];

const connectorIcons: Record<string, ReactNode> = {
  gmail: <TbBrandGmail size={22} />,
  drive: <TbCloud size={22} />,
  chat: <TbBrandSlack size={22} />,
  crm: <TbDatabase size={22} />,
  knowledge: <TbBrandNotion size={22} />,
};

const defaultConnectors: Connector[] = [
  {
    id: "gmail",
    title: "Gmail / Google Workspace",
    description: "Sync emails, Drive files, and contacts.",
    icon: "gmail",
    optional: false,
    connected: false,
    last_synced_at: null,
  },
  {
    id: "drive",
    title: "Google Drive / OneDrive",
    description: "Bring in decks, contracts, and shared folders.",
    icon: "drive",
    optional: false,
    connected: false,
    last_synced_at: null,
  },
  {
    id: "chat",
    title: "Slack / Teams",
    description: "Capture support conversations and daily ops updates.",
    icon: "chat",
    optional: false,
    connected: false,
    last_synced_at: null,
  },
  {
    id: "crm",
    title: "CRM / ERP (Optional)",
    description: "Connect customers, inventory, or finance in one shot.",
    icon: "crm",
    optional: true,
    connected: false,
    last_synced_at: null,
  },
  {
    id: "knowledge",
    title: "Notion / Trello",
    description: "Knowledge bases, sprint boards, and project plans.",
    icon: "knowledge",
    optional: false,
    connected: false,
    last_synced_at: null,
  },
];

export function DataSourcesPage() {
  const [connectors, setConnectors] = useState<Connector[]>(defaultConnectors);
  const [error, setError] = useState<string | null>(null);
  const [busyProvider, setBusyProvider] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  const loadConnectors = () => {
    fetchConnectors()
      .then((data) => {
        const merged = defaultConnectors.map((base) => {
          const live = data.connectors.find((c) => c.id === base.id);
          return live ? { ...base, ...live } : base;
        });
        setConnectors(merged);
        setError(null);
      })
      .catch((err) => {
        setError((err as Error).message);
        setConnectors(defaultConnectors);
      });
  };

  useEffect(() => {
    loadConnectors();
    const params = new URLSearchParams(window.location.search);
    const connectedProvider = params.get("connected");
    if (connectedProvider) {
      setStatusMessage(`${connectedProvider} connected successfully.`);
      setShowSuccessBanner(true);
      setTimeout(() => setShowSuccessBanner(false), 4000);
      params.delete("connected");
      const newUrl =
        window.location.pathname + (params.toString() ? `?${params}` : "");
      window.history.replaceState({}, "", newUrl);
    }
  }, []);

  const handleConnect = (provider: string) => {
    window.location.href = `${API_BASE_URL}/integrations/${provider}/authorize`;
  };

  const handleDisconnect = async (provider: string) => {
    setBusyProvider(provider);
    try {
      await disconnectConnector(provider);
      setStatusMessage(`${provider} disconnected.`);
      loadConnectors();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusyProvider(null);
    }
  };

  return (
    <DashboardShell>
      <section className="rounded-3xl border border-indigo/10 bg-white/80 p-8 shadow-panel">
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold text-indigo">
            Connect every tool your business relies on
          </h1>
          <p className="text-sm text-slate/70">
            Pick the systems you already use every day and we&apos;ll ingest the
            data automatically. Three clear, business-friendly choices.
          </p>
        </header>

        <div className="mt-6 rounded-2xl border border-dashed border-indigo/15 bg-white/90 p-6">
          {showSuccessBanner && (
            <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Integration connected successfully! We’ll start syncing data in the background.
            </div>
          )}
          <h2 className="text-lg font-semibold text-indigo">
            How the connection works
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate/70">
            {instructions.map((step) => (
              <li key={step} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 rounded-full bg-indigo" />
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {error && (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}
          {statusMessage && (
            <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {statusMessage}
            </p>
          )}
          {connectors.map((connector) => (
            <article
              key={connector.id}
              className={`flex flex-col gap-4 rounded-3xl border p-5 text-indigo shadow-sm ${
                connector.connected
                  ? "border-green-200 bg-green-50"
                  : "border-indigo/10 bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo/10 text-indigo">
                  {connectorIcons[connector.icon] ?? <TbCloud size={22} />}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{connector.title}</h3>
                  {connector.optional && (
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo/70">
                      Optional
                    </p>
                  )}
                  {connector.connected && (
                    <p className="text-xs text-green-700">
                      Connected
                      {connector.last_synced_at
                        ? ` · Last sync ${new Date(
                            connector.last_synced_at,
                          ).toLocaleString()}`
                        : ""}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate/70">{connector.description}</p>
              {connector.connected ? (
                <button
                  onClick={() => handleDisconnect(connector.id)}
                  disabled={busyProvider === connector.id}
                  className="mt-auto rounded-2xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                >
                  {busyProvider === connector.id ? "Disconnecting..." : "Disconnect"}
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(connector.id)}
                  className="mt-auto rounded-2xl bg-indigo px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2c2d8a]"
                >
                  Connect now
                </button>
              )}
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-indigo/10 bg-indigo/5 p-6 text-sm text-indigo">
          <div className="flex items-start gap-3">
            <TbWorldShare className="text-2xl" />
            <p>
              Need on-premise? Connect any internal folder or server over the
              local network. Our team can jump on a quick remote session and set
              everything up in minutes.
            </p>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}

