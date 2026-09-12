import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:underline font-semibold mb-8"
        >
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight">
          Politique des Cookies
        </h1>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Qu'est-ce qu'un cookie ?</h2>
            <p>
              Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, tablette,
              smartphone) lors de la visite d'un site web. Il permet au site de mémoriser vos
              actions et préférences pendant un temps donné.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              Les cookies que nous utilisons
            </h2>

            <h3 className="font-bold text-slate-800 mt-4">1. Cookies strictement nécessaires</h3>
            <p>
              Ces cookies sont indispensables au fonctionnement du site. Ils vous permettent de
              naviguer et d'utiliser les fonctionnalités essentielles (comme vous connecter à votre
              compte ou mémoriser vos choix de cookies). Ils ne peuvent pas être désactivés.
            </p>

            <h3 className="font-bold text-slate-800 mt-4">
              2. Cookies analytiques et de performance
            </h3>
            <p>
              Ils nous aident à comprendre comment les visiteurs interagissent avec StudIA (pages
              les plus visitées, temps passé, etc.) afin d'améliorer l'expérience utilisateur. Les
              données collectées sont agrégées et anonymisées.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Comment gérer vos cookies ?</h2>
            <p>
              Vous pouvez à tout moment configurer votre navigateur pour bloquer les cookies ou vous
              alerter de leur présence. Sachez toutefois que bloquer les cookies nécessaires risque
              de vous empêcher d'utiliser pleinement votre compte StudIA.
            </p>
            <p className="mt-2">
              Pour ajuster vos préférences pour notre site, vous pouvez vider le cache de votre
              navigateur pour faire réapparaître notre bandeau de consentement.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
