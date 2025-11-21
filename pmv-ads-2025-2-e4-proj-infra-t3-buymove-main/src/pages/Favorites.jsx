import { Link } from "react-router-dom";
import BackToHome from "@/components/BackToHome";
import ContactSellerButton from "@/components/ContactSellerButton";
import { useFavorites } from "@/context/favorites-context";

export default function Favorites() {
  const { favorites, removeFavorite, updateFavorite, loading, error } = useFavorites();

  if (loading) {
    return (
      <section className="space-y-8">
        <BackToHome className="justify-start" />
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          Carregando seus favoritos...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-8">
        <BackToHome className="justify-start" />
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center text-red-700 shadow-sm">
          Não foi possível carregar seus favoritos: {error}
        </div>
      </section>
    );
  }

  if (!favorites.length) {
    return (
      <section className="space-y-8">
        <BackToHome className="justify-start" />

        <header className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-6 py-12 text-white shadow-lg lg:px-10">
          <h1 className="text-3xl font-bold sm:text-4xl">Sem favoritos por enquanto</h1>
          <p className="mt-4 max-w-2xl text-lg text-blue-100">
            Salve os modelos que mais chamarem sua atenção para comparar depois com calma.
          </p>
          <Link
            to="/catalog"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
          >
            Ir para o catálogo
          </Link>
        </header>

        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-sm text-slate-600">
            Quando você favoritar um veículo, ele aparece aqui com acesso rápido aos detalhes, anotações e contato com o vendedor.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-8">
      <BackToHome className="justify-start" />

      <header className="rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-6 py-12 text-white shadow-lg lg:px-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">Favoritos</p>
        <h1 className="mt-3 text-3xl font-bold sm:text-4xl">Sua garagem inteligente</h1>
        <p className="mt-4 max-w-2xl text-lg text-blue-100">
          Organize modelos, registre observações e avance para a compra assim que estiver pronto.
        </p>
      </header>

      <ul className="space-y-4">
        {favorites.map((v) => (
          <li
            key={v.id}
            className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <img
                src={v.imageUrl}
                alt={v.title}
                className="h-28 w-full rounded-2xl object-cover sm:h-24 sm:w-44"
              />
              <div className="flex-1 space-y-2">
                <div className="text-lg font-semibold text-blue-900">{v.title}</div>
                <div className="text-sm text-slate-500">
                  {v.brand} - {v.year}
                </div>
                <div className="text-lg font-semibold text-blue-900">
                  R$ {Number(v.price).toLocaleString("pt-BR")}
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:w-56">
                <ContactSellerButton vehicle={v} variant="compact" />
                <button
                  onClick={() => removeFavorite(v.id)}
                  className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  Remover
                </button>
                <button
                  onClick={() => updateFavorite(v.id, { note: v.note ? `${v.note} (editado)` : "Observação rápida" })}
                  className="rounded-full bg-blue-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-800"
                >
                  Guardar observação
                </button>
              </div>
            </div>
            {v.note && (
              <p className="mt-3 rounded-2xl bg-slate-100 px-4 py-3 text-xs text-slate-600">
                Observação: {v.note}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

