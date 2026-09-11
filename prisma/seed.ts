import { prisma } from "../src/lib/prisma";

const FACULTIES = [
  {
    code: "droit",
    nom: "Droit",
    couleur: "#2563eb",
    icone: "⚖️",
    subjects: [
      "Droit Constitutionnel",
      "Droit Civil (Personnes & Famille)",
      "Droit Civil (Obligations)",
      "Droit Pénal Général",
      "Droit Administratif",
      "Droit des Affaires",
      "Droit International Public",
      "Droit International Privé",
      "Droit de la Propriété Intellectuelle",
      "Procédure Civile",
      "Droit du Travail",
      "Finances Publiques",
      "Histoire du Droit",
    ],
  },
  {
    code: "medecine",
    nom: "Médecine",
    couleur: "#dc2626",
    icone: "🩺",
    subjects: [
      "Anatomie",
      "Biochimie",
      "Physiologie",
      "Histologie & Embryologie",
      "Pharmacologie",
      "Sémiologie Médicale",
      "Microbiologie",
      "Immunologie",
      "Génétique Médicale",
      "Cardiologie",
      "Pneumologie",
      "Neurologie",
      "Gastro-entérologie",
      "Endocrinologie",
      "Hématologie",
    ],
  },
  {
    code: "aes",
    nom: "Administration Économique & Sociale (AES)",
    couleur: "#0891b2",
    icone: "📋",
    subjects: [
      "Droit Civil",
      "Droit des Affaires",
      "Économie Générale",
      "Microéconomie",
      "Macroéconomie",
      "Sociologie",
      "Comptabilité Générale",
      "Gestion des Ressources Humaines",
      "Finances Publiques",
      "Statistiques",
      "Informatique de Gestion",
    ],
  },
  {
    code: "sciences-eco",
    nom: "Sciences Économiques",
    couleur: "#0d9488",
    icone: "📈",
    subjects: [
      "Microéconomie 1 & 2",
      "Macroéconomie 1 & 2",
      "Économétrie",
      "Histoire de la Pensée Économique",
      "Économie Internationale",
      "Économie du Développement",
      "Finance de Marché",
      "Théorie des Jeux",
      "Économie Publique",
      "Mathématiques pour Économistes",
      "Statistiques & Probabilités",
    ],
  },
  {
    code: "sciences-techniques",
    nom: "Sciences & Techniques",
    couleur: "#16a34a",
    icone: "🔬",
    subjects: [
      "Mathématiques (Analyse)",
      "Mathématiques (Algèbre)",
      "Physique Mécanique",
      "Physique Électromagnétisme",
      "Chimie Générale",
      "Chimie Organique",
      "Biologie Cellulaire",
      "Thermodynamique",
      "Optique",
      "Mécanique Quantique",
      "Statistiques & Probabilités",
    ],
  },
  {
    code: "informatique",
    nom: "Informatique & Numérique",
    couleur: "#7c3aed",
    icone: "💻",
    subjects: [
      "Algorithmique & Structures de Données",
      "Programmation Orientée Objet (Java/C++)",
      "Bases de Données (SQL)",
      "Systèmes d'Exploitation",
      "Réseaux Informatiques",
      "Développement Web",
      "Intelligence Artificielle",
      "Machine Learning",
      "Cryptographie",
      "Génie Logiciel",
      "Architecture des Ordinateurs",
      "Mathématiques Discrètes",
    ],
  },
  {
    code: "lettres",
    nom: "Lettres, Langues & Arts",
    couleur: "#db2777",
    icone: "📖",
    subjects: [
      "Littérature Française (Moyen-Âge / Renaissance)",
      "Littérature Française (XVIIe-XVIIIe)",
      "Littérature Française (XIXe-XXe)",
      "Littérature Comparée",
      "Linguistique Générale",
      "Stylistique",
      "Grammaire & Orthographe",
      "Philosophie",
      "Histoire de l'Art",
      "Langue Vivante Étrangère (Anglais)",
      "Latin / Grec",
    ],
  },
  {
    code: "psychologie",
    nom: "Psychologie",
    couleur: "#ea580c",
    icone: "🧠",
    subjects: [
      "Psychologie Générale",
      "Psychologie du Développement",
      "Psychologie Sociale",
      "Psychologie Clinique",
      "Psychopathologie",
      "Neurosciences Cognitives",
      "Statistiques Appliquées",
      "Psychologie du Travail",
      "Méthodes de Recherche",
      "Psychanalyse",
      "Psychologie de la Personnalité",
    ],
  },
  {
    code: "pharmacie",
    nom: "Pharmacie",
    couleur: "#d97706",
    icone: "💊",
    subjects: [
      "Chimie Pharmaceutique",
      "Pharmacologie Générale",
      "Biologie Moléculaire",
      "Biochimie Pharmaceutique",
      "Pharmacocinétique",
      "Toxicologie",
      "Microbiologie Appliquée",
      "Législation Pharmaceutique",
      "Botanique & Pharmacognosie",
      "Galénique",
    ],
  },
  {
    code: "staps",
    nom: "STAPS (Sciences du Sport)",
    couleur: "#65a30d",
    icone: "🏃",
    subjects: [
      "Anatomie Fonctionnelle",
      "Physiologie de l'Exercice",
      "Biomécanique",
      "Psychologie du Sport",
      "Sociologie du Sport",
      "Didactique des APS",
      "Nutrition Sportive",
      "Management du Sport",
      "Secourisme & Sécurité",
      "VO2max & Endurance",
    ],
  },
  {
    code: "histoire-geo",
    nom: "Histoire & Géographie",
    couleur: "#92400e",
    icone: "🗺️",
    subjects: [
      "Histoire Ancienne",
      "Histoire Médiévale",
      "Histoire Moderne",
      "Histoire Contemporaine",
      "Géographie Physique",
      "Géographie Humaine",
      "Géopolitique",
      "Histoire des Idées Politiques",
      "Méthodologie Historique",
      "Paléographie",
    ],
  },
  {
    code: "gestion",
    nom: "Gestion & Management",
    couleur: "#1d4ed8",
    icone: "🏢",
    subjects: [
      "Comptabilité Générale",
      "Comptabilité Analytique",
      "Finance d'Entreprise",
      "Marketing",
      "Management Stratégique",
      "Gestion des Ressources Humaines",
      "Droit des Sociétés",
      "Fiscalité",
      "Contrôle de Gestion",
      "Entrepreneuriat",
      "Supply Chain Management",
    ],
  },
];

async function main() {
  console.log("🌱 Seeding Faculty & Subject data...");

  for (const fac of FACULTIES) {
    const faculty = await prisma.faculty.upsert({
      where: { code: fac.code },
      update: { nom: fac.nom, couleur: fac.couleur, icone: fac.icone },
      create: { code: fac.code, nom: fac.nom, couleur: fac.couleur, icone: fac.icone },
    });

    // Supprimer les anciennes matières et recréer
    await prisma.subject.deleteMany({ where: { facultyId: faculty.id } });

    await prisma.subject.createMany({
      data: fac.subjects.map((nom, i) => ({
        facultyId: faculty.id,
        nom,
        couleur: fac.couleur,
      })),
    });

    console.log(`  ✅ ${fac.icone} ${fac.nom} → ${fac.subjects.length} matières`);
  }

  console.log("\n✨ Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
