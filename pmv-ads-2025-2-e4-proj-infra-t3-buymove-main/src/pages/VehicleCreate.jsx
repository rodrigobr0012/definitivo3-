import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BackToHome from "@/components/BackToHome";
import { useAuth } from "@/context/auth-context";
import { createVehicle } from "@/services/vehicles";

const fieldClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200";

const buttonClass =
  "inline-flex w-full items-center justify-center rounded-full bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-300";

const initialFormState = {
  title: "",
  brand: "",
  model: "",
  version: "",
  year: "2023",
  price: "",
  mileage: "0",
  color: "",
  fuel_type: "",
  transmission: "",
  doors: "4",
  location: "",
  description: "",
  imageUrl: "",
  features: "",
};

export default function VehicleCreate() {
  const navigate = useNavigate();
  const { user, initializing } = useAuth();

  const [formData, setFormData] = useState(initialFormState);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (initializing) {
    return (
      <section className="space-y-8" aria-busy="true" aria-live="polite">
        <BackToHome className="justify-start" />
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Preparando ambiente seguro...
        </div>
      </section>
    );
  }

  if (!user) {
    return (
      <section className="space-y-8">
        <BackToHome className="justify-start" />
        <header className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-6 py-12 text-white shadow-lg lg:px-10">
          <h1 className="text-3xl font-bold sm:text-4xl">Faça login para anunciar</h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Apenas usuários autenticados podem publicar anúncios no catálogo.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-blue-900 shadow-sm transition hover:bg-blue-50"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="rounded-full border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Criar conta
            </Link>
          </div>
        </header>
      </section>
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError(null);
    setSuccessMessage("");

    if (!formData.title.trim() || !formData.brand.trim() || !formData.price) {
      setFormError("Título, marca e preço são obrigatórios.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        brand: formData.brand.trim(),
        model: formData.model.trim() || undefined,
        version: formData.version.trim() || undefined,
        year: Number(formData.year) || new Date().getFullYear(),
        price: Number(formData.price),
        mileage: Number(formData.mileage) || 0,
        color: formData.color.trim() || undefined,
        fuel_type: formData.fuel_type.trim() || undefined,
        transmission: formData.transmission.trim() || undefined,
        doors: formData.doors ? Number(formData.doors) : undefined,
        location: formData.location.trim() || undefined,
        description: formData.description.trim() || undefined,
        images: formData.imageUrl.trim() ? [formData.imageUrl.trim()] : [],
        features: formData.features
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      };

      await createVehicle(payload);
      setSuccessMessage("Veículo cadastrado com sucesso! Você pode acompanhá-lo em Meus anúncios.");
      setFormData(initialFormState);
      navigate("/my-vehicles");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível salvar seu veículo.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <section className="space-y-8">
      <BackToHome className="justify-start" />

      <header className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-6 py-12 text-white shadow-lg lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">Anunciar veículo</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Publique seu anúncio em minutos</h1>
        <p className="mt-4 max-w-2xl text-lg text-blue-100">
          Preencha os detalhes do veículo e ele aparecerá automaticamente no catálogo para compradores interessados.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-5 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm" noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="title">
              Título do anúncio
            </label>
            <input id="title" name="title" type="text" required className={fieldClass} placeholder="Ex: SUV perfeito para família" value={formData.title} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="brand">
              Marca
            </label>
            <input id="brand" name="brand" type="text" required className={fieldClass} placeholder="Marca" value={formData.brand} onChange={handleChange} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="model">
              Modelo
            </label>
            <input id="model" name="model" type="text" className={fieldClass} placeholder="Modelo" value={formData.model} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="version">
              Versão
            </label>
            <input id="version" name="version" type="text" className={fieldClass} placeholder="Ex: LTZ, Highline" value={formData.version} onChange={handleChange} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="year">
              Ano
            </label>
            <input id="year" name="year" type="number" min="1950" max="2100" className={fieldClass} value={formData.year} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="price">
              Preço (R$)
            </label>
            <input id="price" name="price" type="number" min="0" step="500" required className={fieldClass} value={formData.price} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="mileage">
              Quilometragem
            </label>
            <input id="mileage" name="mileage" type="number" min="0" className={fieldClass} value={formData.mileage} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="doors">
              Portas
            </label>
            <input id="doors" name="doors" type="number" min="2" max="6" className={fieldClass} value={formData.doors} onChange={handleChange} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="color">
              Cor
            </label>
            <input id="color" name="color" type="text" className={fieldClass} value={formData.color} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="fuel_type">
              Combustível
            </label>
            <input id="fuel_type" name="fuel_type" type="text" className={fieldClass} value={formData.fuel_type} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="transmission">
              Câmbio
            </label>
            <input id="transmission" name="transmission" type="text" className={fieldClass} value={formData.transmission} onChange={handleChange} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="location">
            Localização
          </label>
          <input id="location" name="location" type="text" className={fieldClass} placeholder="Cidade - UF" value={formData.location} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="imageUrl">
            URL da imagem principal
          </label>
          <input id="imageUrl" name="imageUrl" type="url" className={fieldClass} placeholder="https://" value={formData.imageUrl} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="features">
            Destaques (separados por vírgula)
          </label>
          <input id="features" name="features" type="text" className={fieldClass} placeholder="Bancos em couro, revisões em dia, único dono" value={formData.features} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-600" htmlFor="description">
            Descrição
          </label>
          <textarea id="description" name="description" rows="4" className={fieldClass} placeholder="Conte a história do veículo, o que foi feito de manutenção e porque ele é especial" value={formData.description} onChange={handleChange} />
        </div>

        {formError && (
          <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {formError}
          </p>
        )}
        {successMessage && (
          <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button type="submit" className={buttonClass} disabled={submitting}>
            {submitting ? "Enviando anúncio..." : "Publicar anúncio"}
          </button>
          <Link to="/my-vehicles" className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900">
            Ver meus anúncios
          </Link>
        </div>
      </form>
    </section>
  );
}
