import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function MentionsLegalesPage() {
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
          Mentions Légales
        </h1>

        <div className="space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Éditeur du site</h2>
            <p>
              Le site <strong>StudIA</strong> est édité par :<br />
              <strong>Jean Dupont</strong> (à modifier)
              <br />
              Statut : Entrepreneur individuel (Auto-entrepreneur)
              <br />
              Adresse : 1 Rue de la Paix, 75000 Paris, France (à modifier)
              <br />
              SIRET : 123 456 789 00012 (à modifier)
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Contact</h2>
            <p>
              Pour toute question ou demande, vous pouvez nous contacter :<br />
              Par email : <strong>contact@studia.app</strong>
              <br />
              Par téléphone : <strong>01 23 45 67 89</strong> (à modifier)
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Hébergement</h2>
            <p>
              Le site est hébergé par :<br />
              <strong>Vercel Inc.</strong>
              <br />
              340 S Lemon Ave #4133
              <br />
              Walnut, CA 91789, USA
              <br />
              Site internet :{" "}
              <a href="https://vercel.com" className="text-primary hover:underline">
                vercel.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble des éléments figurant sur le site StudIA (textes, graphismes, logos,
              icônes, images) sont la propriété exclusive de son éditeur, à l'exception des marques,
              logos ou contenus appartenant à d'autres sociétés partenaires ou auteurs. Toute
              reproduction, représentation, modification, publication, adaptation de tout ou partie
              des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite,
              sauf autorisation écrite préalable.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
