import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
        <Link href="/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold mb-8">
          <ArrowLeft size={16} /> Retour à l'accueil
        </Link>

        <h1 className="text-3xl md:text-4xl font-extrabold mb-8 tracking-tight">Politique de Confidentialité</h1>
        
        <div className="space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Collecte des données personnelles</h2>
            <p>
              Dans le cadre de l'utilisation de StudIA, nous collectons les données suivantes : nom, prénom, adresse e-mail, ainsi que les enregistrements vocaux et les contenus textuels que vous soumettez pour générer vos résumés et flashcards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Utilisation de vos données</h2>
            <p>
              Vos données sont exclusivement utilisées pour le bon fonctionnement du service :
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Création et gestion de votre compte utilisateur.</li>
              <li>Traitement de l'audio et du texte via notre moteur d'Intelligence Artificielle pour créer vos fiches de révision.</li>
              <li>Amélioration continue de notre application.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Transmission aux tiers (IA)</h2>
            <p>
              Pour transformer vos cours en résumés, nous utilisons des API d'Intelligence Artificielle tierces (ex. Google Gemini / OpenAI). Vos enregistrements et textes sont temporairement transmis à ces services de manière sécurisée pour être traités. Ils ne sont pas utilisés par ces tiers pour entraîner leurs propres modèles publics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Durée de conservation</h2>
            <p>
              Nous conservons vos données et historiques de cours ("Ma bibliothèque") tant que votre compte est actif. Vous pouvez supprimer un cours à tout moment depuis votre tableau de bord. En cas de suppression de compte, toutes vos données liées seront définitivement effacées de nos serveurs.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Vos droits (RGPD)</h2>
            <p>
              Conformément à la réglementation européenne (RGPD), vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données. Pour exercer ces droits, vous pouvez nous contacter à l'adresse suivante : <strong>contact@studia.app</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
