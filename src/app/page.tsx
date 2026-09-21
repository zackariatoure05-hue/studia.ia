import Link from "next/link";
import Image from "next/image";
import {
  Mic,
  BrainCircuit,
  Folders,
  Bot,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Zap,
  Target,
  BookOpen,
  Clock,
  Users,
} from "lucide-react";
import AnimatedHeroMockup from "@/components/landing/AnimatedHeroMockup";
import AnimatedFeatureFlashcard from "@/components/landing/AnimatedFeatureFlashcard";
import AnimatedFeatureSummary from "@/components/landing/AnimatedFeatureSummary";

const plans = [
  {
    name: "Découverte",
    price: "1,99 €",
    period: "par mois",
    description: "Parfait pour découvrir StudIA.",
    features: ["4 heures d'audio / mois", "Résumés standards", "Flashcards limitées"],
    cta: "Créer un compte",
    highlighted: false,
  },
  {
    name: "Étudiant",
    price: "4,99 €",
    period: "par mois",
    description: "L'essentiel pour réviser efficacement.",
    features: [
      "20 heures d'audio / mois",
      "Résumés approfondis",
      "Flashcards détaillées",
      "Génération illimitée (texte)",
    ],
    cta: "S'inscrire",
    highlighted: true,
    badge: "Le plus populaire",
  },
  {
    name: "Premium",
    price: "9,99 €",
    period: "par mois",
    description: "Pour les étudiants les plus exigeants.",
    features: [
      "Audio illimité",
      "Résumés exhaustifs (niveau Master)",
      "Mode révision avec tous les profils d'IA",
      "Support prioritaire",
    ],
    cta: "Choisir Premium",
    highlighted: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 overflow-x-hidden">
      {/* ── HEADER ── */}
      <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              Studi<span className="text-indigo-600">IA</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#fonctionnalites"
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Fonctionnalités
            </Link>
            <Link
              href="#histoire"
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Notre Histoire
            </Link>
            <Link
              href="#tarifs"
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
            >
              Tarifs
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/connexion"
              className="text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors hidden sm:block"
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-800 hover:scale-105 transition-all shadow-xl shadow-slate-900/20 flex items-center gap-2"
            >
              Commencer <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {/* ── HERO SECTION ── */}
        <section className="relative pt-20 sm:pt-24 pb-20 sm:pb-32 px-4 sm:px-6 overflow-hidden perspective-[2000px]">
          {/* Animated Background Gradients & Floating Shapes */}
          <div className="absolute top-0 right-0 w-full max-w-2xl h-[500px] bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/30 blur-[120px] rounded-full -z-10 animate-pulse [animation-duration:3000ms]"></div>
          <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full -z-10"></div>

          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Column: Text */}
              <div className="text-left z-10 relative">
                <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-indigo-50/80 backdrop-blur-sm border border-indigo-100 text-indigo-700 font-semibold text-xs sm:text-sm mb-6 sm:mb-8 animate-in slide-in-from-left-4 fade-in duration-700 shadow-sm">
                  <Sparkles className="w-4 h-4 shrink-0" /> La nouvelle ère de l'apprentissage
                </div>

                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight sm:leading-[1.1] mb-6 sm:mb-8 animate-in slide-in-from-left-6 fade-in duration-700 delay-100 break-words">
                  Concentre-toi sur l'écoute.
                  <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-[length:200%_auto] animate-gradient block sm:inline-block mt-1 sm:mt-0">
                    StudIA prend tes notes.
                  </span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-8 sm:mb-10 leading-relaxed animate-in slide-in-from-left-8 fade-in duration-700 delay-200">
                  L'IA qui enregistre tes cours, les transcrit en direct, et génère tes résumés et
                  flashcards instantanément. Divise ton temps de révision par deux.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4 w-full">
                  <Link
                    href="/inscription"
                    className="bg-indigo-600 text-white px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm md:text-base font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto text-center shrink-0"
                  >
                    Commencer maintenant <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                  </Link>
                  <Link
                    href="#fonctionnalites"
                    className="bg-white text-slate-700 border border-slate-200 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-sm md:text-base font-bold hover:bg-slate-50 transition-colors flex items-center justify-center w-full sm:w-auto text-center shrink-0"
                  >
                    Découvrir comment
                  </Link>
                </div>
              </div>

              {/* Right Column: 3D Mockup */}
              <div className="relative animate-in zoom-in-95 fade-in duration-1000 delay-500 lg:h-[600px] flex items-center justify-center mt-6 lg:mt-0">
                {/* Floating elements behind mockup */}
                <div
                  className="absolute top-10 right-10 w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-500 rounded-3xl opacity-50 blur-2xl animate-bounce"
                  style={{ animationDuration: "4s" }}
                ></div>
                <div
                  className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full opacity-50 blur-2xl animate-bounce"
                  style={{ animationDuration: "6s", animationDelay: "1s" }}
                ></div>

                <div
                  className="relative w-full max-w-[800px] rounded-2xl md:rounded-[2.5rem] overflow-hidden border border-slate-200/50 shadow-2xl shadow-indigo-900/20 transform scale-95 sm:scale-100"
                  style={{
                    transform: "perspective(1200px) rotateY(-10deg) rotateX(5deg)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent z-10 pointer-events-none rounded-[2.5rem]"></div>
                  <AnimatedHeroMockup />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── VALEUR / BÉNÉFICES ── */}
        <section className="py-24 bg-white px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                  <Clock className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Gagne du temps</h3>
                <p className="text-slate-600 leading-relaxed">
                  Fini les heures à recopier tes notes au propre. Sors de cours avec tes fiches déjà
                  prêtes.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">100% de concentration</h3>
                <p className="text-slate-600 leading-relaxed">
                  Écoute activement ton prof et participe. Laisse notre IA s'occuper de la prise de
                  notes exhaustive.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600">
                  <BrainCircuit className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Rétention maximale</h3>
                <p className="text-slate-600 leading-relaxed">
                  Révise activement grâce aux flashcards générées sur mesure, basées sur la science
                  de la répétition espacée.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SERVICES / FONCTIONNALITÉS ── */}
        <section id="fonctionnalites" className="py-32 px-6 bg-slate-50 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                Le couteau suisse de l'étudiant
              </h2>
              <p className="text-xl text-slate-600">
                Tout ce dont tu as besoin pour exceller, réuni dans une seule application pensée
                pour ta réussite.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
              <div className="order-2 lg:order-1 space-y-12">
                <div className="flex gap-6">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Mic className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Transcription Live</h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Pose ton téléphone sur la table. L'IA écoute et retranscrit le cours en temps
                      réel, même au fond de l'amphi.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600">
                    <BookOpen className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Résumés de niveau Master
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Notre IA ne fait pas que résumer. Elle analyse, structure et enrichit ton
                      cours avec du contexte additionnel.
                    </p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600">
                    <Bot className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Avatar IA Pédagogique
                    </h3>
                    <p className="text-slate-600 text-lg leading-relaxed">
                      Choisis ton prof virtuel. Pose-lui des questions sur tes cours obscurs, il te
                      répondra avec pédagogie.
                    </p>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2 relative rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-500 border border-slate-200/50">
                <AnimatedFeatureFlashcard />
              </div>
              <div className="order-3 lg:order-3 relative rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-500 border border-slate-200/50 mt-8 col-span-1 lg:col-span-2">
                <AnimatedFeatureSummary />
              </div>
            </div>
          </div>
        </section>

        {/* ── HISTOIRE (POURQUOI STUDIA) ── */}
        <section id="histoire" className="py-24 bg-slate-900 text-white px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Users className="w-16 h-16 text-indigo-400 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-extrabold mb-8">
              Créé par des étudiants, pour les étudiants
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed mb-8">
              "L'idée de StudIA est née d'une frustration simple : passer plus de temps à recopier
              des notes qu'à réellement comprendre le cours. Nous avons voulu créer l'outil ultime
              que nous aurions rêvé d'avoir en première année de fac."
            </p>
            <p className="text-lg font-bold text-indigo-300">— L'équipe fondatrice de StudIA</p>
          </div>
        </section>

        {/* ── TARIFS ── */}
        <section id="tarifs" className="py-32 px-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">
                Investis dans ta réussite
              </h2>
              <p className="text-xl text-slate-600">
                Des tarifs transparents, adaptés au budget étudiant. Sans engagement.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
              {plans.map((plan, i) => (
                <div
                  key={i}
                  className={`relative bg-white rounded-3xl p-8 border ${plan.highlighted ? "border-indigo-500 shadow-2xl shadow-indigo-500/20 scale-105 z-10" : "border-slate-200 shadow-lg"} flex flex-col h-full transition-transform`}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                      {plan.badge}
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-500 mb-6">{plan.description}</p>

                  <div className="mb-8">
                    <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                    <span className="text-slate-500"> {plan.period}</span>
                  </div>

                  <ul className="space-y-4 mb-10 flex-1">
                    {plan.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-slate-700">
                        <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/inscription"
                    className={`w-full py-4 rounded-xl font-bold text-center transition-all ${plan.highlighted ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-1" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="py-32 px-6 bg-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-8">
              Prêt à valider ton semestre ?
            </h2>
            <p className="text-xl text-slate-600 mb-10">
              Rejoins StudIA aujourd'hui et découvre une nouvelle façon d'étudier, sans stress.
            </p>
            <Link
              href="/inscription"
              className="inline-flex bg-slate-900 text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-slate-800 hover:scale-105 transition-all shadow-2xl shadow-slate-900/30 items-center gap-2"
            >
              Créer mon compte <ChevronRight className="w-6 h-6" />
            </Link>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-slate-900 pt-20 pb-10 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 inline-flex">
              <Zap className="w-6 h-6 text-indigo-400" />
              <span className="font-extrabold text-2xl text-white">
                Studi<span className="text-indigo-400">IA</span>
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              L'IA qui transforme tes cours en résumés et flashcards. Révise mieux, retiens plus.
              Conçu pour la réussite de tous les étudiants.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-lg">Légal</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/politique-de-confidentialite"
                  className="text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  Politique des cookies
                </Link>
              </li>
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6 text-lg">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:contact@studia.app"
                  className="text-slate-400 hover:text-indigo-400 transition-colors"
                >
                  contact@studia.app
                </a>
              </li>
              <li className="text-slate-400">01 23 45 67 89</li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 font-medium">
            © {new Date().getFullYear()} StudiIA Inc. Conçu avec passion.
          </p>
        </div>
      </footer>
    </div>
  );
}
