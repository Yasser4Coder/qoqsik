import { type FormEvent, useEffect, useState } from "react";
import { DashboardShell } from "../components/layouts/DashboardShell.tsx";
import { TbUpload, TbFileDescription, TbLink, TbCloud } from "react-icons/tb";
import {
  uploadDocument,
  fetchRecentDocuments,
  type DocumentResponse,
} from "../lib/api.ts";

const defaultCategories = ["Contracts", "Reports", "Assets", "HR", "Finance"];

export function AddDocumentsPage() {
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>("Contracts");
  const [newCategory, setNewCategory] = useState<string>("");
  const [form, setForm] = useState({
    title: "",
    filename: "",
    cloud_link: "",
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [recentDocuments, setRecentDocuments] = useState<DocumentResponse[]>(
    []
  );

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    setCategories((prev) => [...prev, trimmed]);
    setSelectedCategory(trimmed);
    setNewCategory("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    setLoading(true);
    try {
      const payload = await uploadDocument({
        title: form.title,
        category: selectedCategory,
        filename: form.filename || `${form.title || "document"}.pdf`,
        cloud_link: form.cloud_link || undefined,
      });
      setFeedback("Document uploaded successfully.");
      setForm({ title: "", filename: "", cloud_link: "" });
      setRecentDocuments((prev) => [payload, ...prev].slice(0, 5));
    } catch (error) {
      setFeedback((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentDocuments()
      .then(setRecentDocuments)
      .catch(() => null);
  }, []);

  return (
    <DashboardShell>
      <section className="rounded-3xl border border-indigo/10 bg-white/80 p-8 shadow-panel">
        <div className="flex flex-col gap-6">
          <header className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate/60">
              Files
            </p>
            <h1 className="text-3xl font-semibold text-indigo">
              Add and organize documents
            </h1>
            <p className="text-sm text-slate/70">
              Upload files or link from cloud storage, then tag them to keep
              things tidy.
            </p>
          </header>

          <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
            <form
              className="space-y-5 rounded-3xl bg-white/90 p-6 shadow-inner"
              onSubmit={handleSubmit}
            >
              <label className="flex flex-col gap-2 text-sm font-semibold text-indigo">
                Document title
                <div className="flex items-center gap-3 rounded-2xl border border-indigo/10 bg-white px-4 py-3 text-slate/70 focus-within:border-indigo focus-within:text-indigo">
                  <TbFileDescription />
                  <input
                    placeholder="Q1 performance review"
                    value={form.title}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        title: event.target.value,
                      }))
                    }
                    className="flex-1 bg-transparent text-sm font-medium text-indigo placeholder:text-slate/50 focus:outline-none"
                  />
                </div>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-indigo">
                Category
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                        selectedCategory === category
                          ? "border-indigo bg-indigo/10 text-indigo"
                          : "border-indigo/10 text-slate/70 hover:border-indigo/30"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={newCategory}
                    onChange={(event) => setNewCategory(event.target.value)}
                    placeholder="Add new category"
                    className="flex-1 rounded-2xl border border-indigo/10 bg-white px-4 py-2 text-sm font-medium text-indigo placeholder:text-slate/50 focus:border-indigo focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="rounded-2xl bg-indigo px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white shadow-sm transition hover:bg-[#2c2d8a]"
                  >
                    Add
                  </button>
                </div>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-indigo">
                Upload file
                <div className="rounded-3xl border-2 border-dashed border-indigo/20 bg-white/70 px-4 py-8 text-center text-slate/60 transition hover:border-indigo/50">
                  <TbUpload className="mx-auto text-3xl text-indigo" />
                  <p className="mt-3 text-sm">
                    Drag & drop files or{" "}
                    <span className="font-semibold text-indigo">
                      browse from computer
                    </span>
                  </p>
                  <p className="text-xs text-slate/40">
                    PDF, DOCX, PNG up to 25MB
                  </p>
                  <input
                    type="text"
                    placeholder="File name (e.g. brief.pdf)"
                    value={form.filename}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        filename: event.target.value,
                      }))
                    }
                    className="mt-4 w-full rounded-2xl border border-indigo/10 px-4 py-2 text-sm text-indigo placeholder:text-slate/50 focus:border-indigo focus:outline-none"
                  />
                </div>
              </label>
              <label className="flex flex-col gap-2 text-sm font-semibold text-indigo">
                Cloud link (optional)
                <div className="flex items-center gap-3 rounded-2xl border border-indigo/10 bg-white px-4 py-3 text-slate/70 focus-within:border-indigo focus-within:text-indigo">
                  <TbLink />
                  <input
                    placeholder="https://drive.google.com/..."
                    value={form.cloud_link}
                    onChange={(event) =>
                      setForm((prev) => ({
                        ...prev,
                        cloud_link: event.target.value,
                      }))
                    }
                    className="flex-1 bg-transparent text-sm font-medium text-indigo placeholder:text-slate/50 focus:outline-none"
                  />
                </div>
              </label>
              {feedback && <p className="text-sm text-indigo">{feedback}</p>}
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 rounded-2xl bg-indigo px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo/40 transition hover:bg-[#2c2d8a] disabled:opacity-60"
              >
                <TbCloud />
                {loading ? "Uploading..." : "Upload document"}
              </button>
            </form>

            <div className="space-y-4 rounded-3xl border border-indigo/10 bg-white/90 p-6">
              <h2 className="text-lg font-semibold text-indigo">
                Recent uploads
              </h2>
              <ul className="space-y-3 text-sm text-slate/70">
                {recentDocuments.map((file) => (
                  <li
                    key={file.id}
                    className="rounded-2xl border border-indigo/10 px-4 py-3"
                  >
                    {file.title} ·{" "}
                    <span className="text-indigo">{file.category}</span>
                  </li>
                ))}
                {recentDocuments.length === 0 && (
                  <li className="rounded-2xl border border-indigo/10 px-4 py-3 text-slate/50">
                    No documents uploaded yet.
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
