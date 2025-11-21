import { useState } from "react";
import BackToHome from "@/components/BackToHome";
import { useAuth } from "@/context/auth-context";

const fieldClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200";
const textAreaClass = `${fieldClass} h-28`;

export default function Profile() {
  const { user } = useAuth();
  const [name, setName] = useState(localStorage.getItem("bm_profile_name") || "");
  const [phone, setPhone] = useState(localStorage.getItem("bm_profile_phone") || "");
  const [notify, setNotify] = useState(localStorage.getItem("bm_profile_notify") !== "false");
  const [whatsapp, setWhatsapp] = useState(localStorage.getItem("bm_profile_whatsapp") === "true");
  const [notes, setNotes] = useState(localStorage.getItem("bm_profile_notes") || "");
  const [feedback, setFeedback] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    localStorage.setItem("bm_profile_name", name.trim());
    localStorage.setItem("bm_profile_phone", phone.trim());
    localStorage.setItem("bm_profile_notify", String(notify));
    localStorage.setItem("bm_profile_whatsapp", String(whatsapp));
    localStorage.setItem("bm_profile_notes", notes.trim());
    const stamp = new Date().toISOString();
    localStorage.setItem("bm_profile_updated_at", stamp);
    setFeedback("Dados atualizados com sucesso!");
    setTimeout(() => setFeedback(""), 4000);
  }

  function handleReset() {
    setName(localStorage.getItem("bm_profile_name") || "");
    setPhone(localStorage.getItem("bm_profile_phone") || "");
    setNotify(localStorage.getItem("bm_profile_notify") !== "false");
    setWhatsapp(localStorage.getItem("bm_profile_whatsapp") === "true");
    setNotes(localStorage.getItem("bm_profile_notes") || "");
    setFeedback("Alterações desfeitas.");
    setTimeout(() => setFeedback(""), 4000);
  }

  const lastUpdateRaw = localStorage.getItem("bm_profile_updated_at");
  const lastUpdate = lastUpdateRaw
    ? new Date(lastUpdateRaw).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    : "Ainda não salvo";

  return (
    <section className="space-y-8">
      <BackToHome className="justify-start" />

      <header className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-6 py-12 text-white shadow-lg lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">Meu cadastro</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Dados da conta buyMove</h1>
        <p className="mt-4 max-w-2xl text-lg text-blue-100">
          Mantenha suas informações e preferências atualizadas para receber ofertas e alertas relevantes.
        </p>
      </header>

      {feedback && (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700" aria-live="polite">
          {feedback}
        </p>
      )}

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-blue-900">Dados pessoais</h2>
            <div className="space-y-4">
              <label className="space-y-2 text-sm font-medium text-slate-600">
                Nome completo
                <input
                  className={fieldClass}
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-slate-600">
                  Telefone
                  <input
                    className={fieldClass}
                    placeholder="(00) 90000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
                <label className="space-y-2 text-sm font-medium text-slate-600">
                  Observações rápidas
                  <textarea
                    className={textAreaClass}
                    placeholder="Anote detalhes importantes sobre o que procura."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-blue-900">Preferências de contato</h2>
            <div className="space-y-3 text-sm text-slate-700">
              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-blue-700"
                  checked={notify}
                  onChange={(e) => setNotify(e.target.checked)}
                />
                <span>Receber alertas por e-mail quando um favorito mudar de preço.</span>
              </label>
              <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 accent-blue-700"
                  checked={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.checked)}
                />
                <span>Permitir contato via WhatsApp pelo número informado.</span>
              </label>
              <p className="text-xs text-slate-400">
                Nunca compartilhamos seu contato sem autorização. Ajuste suas preferências quando quiser.
              </p>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-blue-900">Resumo da conta</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-600">
              <li>
                E-mail conectado: <span className="font-medium text-blue-900">{user?.email || "não informado"}</span>
              </li>
              <li>Status das notificações: {notify ? "Ativas" : "Inativas"}</li>
              <li>Contato via WhatsApp: {whatsapp ? "Permitido" : "Desativado"}</li>
              <li>Última atualização: {lastUpdate}</li>
            </ul>
          </section>

          <section className="space-y-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Salvar alterações
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:text-blue-800"
            >
              Desfazer mudanças
            </button>
          </section>
        </aside>
      </form>
    </section>
  );
}

