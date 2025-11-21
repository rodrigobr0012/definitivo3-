import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import BackToHome from "@/components/BackToHome";
import { useAuth } from "@/context/auth-context";
import { deleteVehicle, listUserVehicles, normalizeVehicle, updateVehicle } from "@/services/vehicles";

const inputClass =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400 shadow-sm transition focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-200";

export default function MyVehicles() {
  const { user, initializing } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState("");

  const isLogged = useMemo(() => Boolean(user), [user]);

  useEffect(() => {
    if (!isLogged) return;

    async function fetchVehicles() {
      setLoading(true);
      setError(null);
      try {
        const { items } = await listUserVehicles();
        setVehicles(items.map(normalizeVehicle));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Não foi possível carregar seus anúncios.");
      } finally {
        setLoading(false);
      }
    }

    fetchVehicles();
  }, [isLogged]);

  function startEdit(vehicle) {
    setEditingId(vehicle.id);
    setSuccess("");
    setFormData({
      title: vehicle.title || "",
      price: vehicle.price || "",
      mileage: vehicle.mileage || "",
      location: vehicle.location || "",
      imageUrl: vehicle.imageUrl || "",
    });
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleUpdate(event) {
    event.preventDefault();
    if (!editingId) return;

    try {
      const payload = {
        title: formData.title?.trim() || undefined,
        price: formData.price ? Number(formData.price) : undefined,
        mileage: formData.mileage ? Number(formData.mileage) : undefined,
        location: formData.location?.trim() || undefined,
        images: formData.imageUrl?.trim() ? [formData.imageUrl.trim()] : undefined,
      };

      const updated = await updateVehicle(editingId, payload);
      setVehicles((prev) => prev.map((item) => (item.id === editingId ? normalizeVehicle(updated) : item)));
      setSuccess("Anúncio atualizado com sucesso.");
      setEditingId(null);
      setFormData({});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar o anúncio.");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Tem certeza que deseja remover este anúncio?");
    if (!confirmed) return;

    try {
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível remover o anúncio.");
    }
  }

  if (initializing) {
    return (
      <section className="space-y-8" aria-busy="true">
        <BackToHome className="justify-start" />
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Preparando ambiente seguro...
        </div>
      </section>
    );
  }

  if (!isLogged) {
    return (
      <section className="space-y-8">
        <BackToHome className="justify-start" />
        <header className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-6 py-12 text-white shadow-lg lg:px-10">
          <h1 className="text-3xl font-bold sm:text-4xl">Meus anúncios</h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Faça login para acompanhar, editar ou remover veículos cadastrados.
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

  return (
    <section className="space-y-8">
      <BackToHome className="justify-start" />

      <header className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-6 py-12 text-white shadow-lg lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">Veículos cadastrados</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Gerencie seus anúncios</h1>
        <p className="mt-4 max-w-2xl text-lg text-blue-100">
          Altere preços, atualize fotos ou remova anúncios que não fazem mais sentido no catálogo.
        </p>
      </header>

      {success && (
        <p className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </p>
      )}
      {error && (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading && <p className="text-sm text-slate-600">Carregando seus veículos...</p>}

      {!loading && !vehicles.length && (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-lg font-semibold text-blue-900">Nenhum anúncio por aqui</h2>
          <p className="mt-2 text-sm text-slate-600">Publique seu primeiro veículo para vê-lo listado aqui.</p>
          <Link
            to="/vehicle/new"
            className="mt-4 inline-flex items-center justify-center rounded-full bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
          >
            Anunciar agora
          </Link>
        </div>
      )}

      {!!vehicles.length && (
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <article
              key={vehicle.id}
              className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
            >
              <img
                src={vehicle.imageUrl}
                alt={vehicle.title}
                className="h-28 w-full rounded-2xl object-cover sm:h-24 sm:w-40"
              />
              <div className="flex-1 space-y-1">
                <h2 className="text-lg font-semibold text-blue-900">{vehicle.title}</h2>
                <p className="text-sm text-slate-500">
                  {vehicle.brand} • {vehicle.year} • {vehicle.location || "localização não informada"}
                </p>
                <p className="text-lg font-semibold text-blue-900">R$ {Number(vehicle.price).toLocaleString("pt-BR")}</p>
              </div>
              <div className="flex flex-wrap gap-2 sm:w-72 sm:justify-end">
                <button
                  onClick={() => startEdit(vehicle)}
                  className="rounded-full bg-blue-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-700 transition hover:border-red-300 hover:text-red-800"
                >
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {editingId && (
        <form
          onSubmit={handleUpdate}
          className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          aria-live="polite"
        >
          <h3 className="text-lg font-semibold text-blue-900">Editar anúncio</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600" htmlFor="title">
                Título
              </label>
              <input id="title" name="title" type="text" className={inputClass} value={formData.title || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600" htmlFor="price">
                Preço (R$)
              </label>
              <input id="price" name="price" type="number" min="0" className={inputClass} value={formData.price || ""} onChange={handleChange} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600" htmlFor="mileage">
                Quilometragem
              </label>
              <input id="mileage" name="mileage" type="number" min="0" className={inputClass} value={formData.mileage || ""} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600" htmlFor="location">
                Localização
              </label>
              <input id="location" name="location" type="text" className={inputClass} value={formData.location || ""} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600" htmlFor="imageUrl">
              URL da imagem
            </label>
            <input id="imageUrl" name="imageUrl" type="url" className={inputClass} value={formData.imageUrl || ""} onChange={handleChange} />
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="submit" className="rounded-full bg-blue-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-800">
              Salvar alterações
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData({});
              }}
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
