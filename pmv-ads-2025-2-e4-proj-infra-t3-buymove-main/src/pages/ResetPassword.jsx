import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BackToHome from "@/components/BackToHome";
import { resetPassword } from "@/services/auth";

const fieldClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200";
const buttonClass =
  "inline-flex w-full items-center justify-center rounded-full bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = useMemo(() => new URLSearchParams(location.search).get("token") ?? "", [location.search]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);

  const canSubmit = Boolean(token && password && confirmPassword && password === confirmPassword);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!canSubmit) return;
    setStatus("submitting");
    setMessage(null);
    try {
      await resetPassword({ token, password });
      setStatus("success");
      setMessage("Senha redefinida com sucesso. Agora voce pode acessar sua conta normalmente.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setStatus("error");
      setMessage(error.message ?? "Nao foi possivel redefinir a senha agora.");
    }
  }

  if (!token) {
    return (
      <section className="space-y-8">
        <BackToHome className="justify-start" />
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 text-amber-900">
          Nenhum token de recuperacao foi informado. Solicite um novo link de redefinicao na pagina de
          <Link to="/forgot-password" className="ml-1 font-semibold text-blue-700 underline">
            recuperar senha
          </Link>
          .
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <BackToHome className="justify-start" />

      <header className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-6 py-12 text-white shadow-lg lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">Nova senha</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Defina uma senha segura</h1>
        <p className="mt-4 max-w-2xl text-lg text-blue-100">
          Escolha uma senha com pelo menos 8 caracteres para voltar a acessar sua conta com seguranca.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-sm space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Nova senha</label>
          <input
            type="password"
            required
            minLength={8}
            className={fieldClass}
            placeholder="Crie uma nova senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">Confirmar senha</label>
          <input
            type="password"
            required
            minLength={8}
            className={fieldClass}
            placeholder="Repita a nova senha"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
          />
        </div>

        {password && confirmPassword && password !== confirmPassword && (
          <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
            As senhas precisam ser iguais.
          </p>
        )}

        {message && (
          <p
            role="alert"
            className={`rounded-xl px-4 py-3 text-sm ${status === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
          >
            {message}
          </p>
        )}

        <button type="submit" className={buttonClass} disabled={!canSubmit || status === "submitting"}>
          {status === "submitting" ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </section>
  );
}
