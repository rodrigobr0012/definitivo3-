import { useState } from "react";
import { Link } from "react-router-dom";
import BackToHome from "@/components/BackToHome";
import { requestPasswordReset } from "@/services/auth";

const fieldClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200";
const buttonClass =
  "inline-flex w-full items-center justify-center rounded-full bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!email) return;
    setStatus("submitting");
    setMessage(null);
    try {
      await requestPasswordReset({ email });
      setStatus("success");
      setMessage(
        "Enviamos instrucoes para o seu e-mail. Caso ele esteja cadastrado, voce recebera um link em instantes."
      );
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error.message ?? "Nao foi possivel iniciar a recuperacao agora.");
    }
  }

  return (
    <section className="space-y-8">
      <BackToHome className="justify-start" />

      <header className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-6 py-12 text-white shadow-lg lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">Recuperar acesso</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Vamos enviar um link seguro</h1>
        <p className="mt-4 max-w-2xl text-lg text-blue-100">
          Informe o e-mail cadastrado e enviaremos um link para redefinir a sua senha.
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-sm space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm"
        noValidate
      >
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600">E-mail</label>
          <input
            type="email"
            required
            className={fieldClass}
            placeholder="seu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />
        </div>

        {message && (
          <p
            role="alert"
            className={`rounded-xl px-4 py-3 text-sm ${status === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
          >
            {message}
          </p>
        )}

        <button type="submit" className={buttonClass} disabled={status === "submitting"}>
          {status === "submitting" ? "Enviando..." : "Enviar link"}
        </button>

        <p className="text-sm text-slate-500">
          Lembrou a senha? Volte para a
          <Link to="/login" className="ml-2 font-semibold text-blue-700 transition hover:text-blue-600">
            tela de login
          </Link>
        </p>
      </form>
    </section>
  );
}
