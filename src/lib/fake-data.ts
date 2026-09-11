// Types basés sur le modèle Prisma

export type User = {
  id: string;
  email: string;
  nom: string;
  cree_le: string;
};

export type Faculte = {
  id: string;
  user_id: string;
  nom: string;
  couleur: string;
  cree_le: string;
};

export type Matiere = {
  id: string;
  faculte_id: string;
  nom: string;
  couleur: string;
  cree_le: string;
};

export type Cours = {
  id: string;
  matiere_id: string;
  titre: string;
  type: "texte_colle" | "audio";
  contenu_brut: string;
  url_audio?: string;
  duree_audio_secondes?: number;
  cree_le: string;
};

export type Resume = {
  id: string;
  cours_id: string;
  contenu: string;
  points_cles: string[];
  cree_le: string;
};

export type Flashcard = {
  id: string;
  cours_id: string;
  question: string;
  reponse: string;
  statut: "nouvelle" | "en_cours" | "maitrisee";
  derniere_revision?: string;
  cree_le: string;
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA — Facultés françaises complètes
// ─────────────────────────────────────────────────────────────────────────────

const now = new Date().toISOString();

export const MOCK_USER: User = {
  id: "usr_1",
  email: "etudiant@univ-lorraine.fr",
  nom: "Marie Curie",
  cree_le: now,
};

export const MOCK_FACULTES: Faculte[] = [
  { id: "fac_1",  user_id: "usr_1", nom: "Droit, Économie & Gestion", couleur: "#2563eb", cree_le: now },
  { id: "fac_2",  user_id: "usr_1", nom: "Médecine & Santé",          couleur: "#dc2626", cree_le: now },
  { id: "fac_3",  user_id: "usr_1", nom: "Sciences & Technologie",    couleur: "#16a34a", cree_le: now },
  { id: "fac_4",  user_id: "usr_1", nom: "Lettres, Arts & Sciences Humaines", couleur: "#7c3aed", cree_le: now },
  { id: "fac_5",  user_id: "usr_1", nom: "Informatique & Numérique",  couleur: "#0891b2", cree_le: now },
  { id: "fac_6",  user_id: "usr_1", nom: "Pharmacie",                 couleur: "#d97706", cree_le: now },
  { id: "fac_7",  user_id: "usr_1", nom: "Sciences Économiques",      couleur: "#0d9488", cree_le: now },
  { id: "fac_8",  user_id: "usr_1", nom: "Psychologie",               couleur: "#db2777", cree_le: now },
  { id: "fac_9",  user_id: "usr_1", nom: "STAPS (Sport)",             couleur: "#ea580c", cree_le: now },
  { id: "fac_10", user_id: "usr_1", nom: "Architecture & Design",     couleur: "#65a30d", cree_le: now },
];

export const MOCK_MATIERES: Matiere[] = [
  // Droit, Économie & Gestion (fac_1)
  { id: "mat_1",   faculte_id: "fac_1", nom: "Introduction au Droit Public",   couleur: "#3b82f6", cree_le: now },
  { id: "mat_2",   faculte_id: "fac_1", nom: "Droit Constitutionnel",          couleur: "#60a5fa", cree_le: now },
  { id: "mat_3",   faculte_id: "fac_1", nom: "Droit Civil : Les Personnes",    couleur: "#93c5fd", cree_le: now },
  { id: "mat_4",   faculte_id: "fac_1", nom: "Droit Civil : Les Obligations",  couleur: "#2563eb", cree_le: now },
  { id: "mat_5",   faculte_id: "fac_1", nom: "Droit Pénal Général",            couleur: "#1d4ed8", cree_le: now },
  { id: "mat_6",   faculte_id: "fac_1", nom: "Droit Administratif",            couleur: "#1e40af", cree_le: now },
  { id: "mat_101", faculte_id: "fac_1", nom: "Droit des Sociétés",             couleur: "#3b82f6", cree_le: now },
  { id: "mat_102", faculte_id: "fac_1", nom: "Droit International Public",     couleur: "#60a5fa", cree_le: now },
  { id: "mat_103", faculte_id: "fac_1", nom: "Histoire du Droit",              couleur: "#2563eb", cree_le: now },
  { id: "mat_104", faculte_id: "fac_1", nom: "Finances Publiques",             couleur: "#1e40af", cree_le: now },

  // Médecine & Santé (fac_2)
  { id: "mat_7",   faculte_id: "fac_2", nom: "Anatomie Générale",              couleur: "#ef4444", cree_le: now },
  { id: "mat_8",   faculte_id: "fac_2", nom: "Biochimie & Bio. Moléculaire",   couleur: "#f87171", cree_le: now },
  { id: "mat_9",   faculte_id: "fac_2", nom: "Physiologie Humaine",            couleur: "#fca5a5", cree_le: now },
  { id: "mat_10",  faculte_id: "fac_2", nom: "Sémiologie Médicale",            couleur: "#dc2626", cree_le: now },
  { id: "mat_11",  faculte_id: "fac_2", nom: "Pharmacologie Fondamentale",     couleur: "#b91c1c", cree_le: now },
  { id: "mat_12",  faculte_id: "fac_2", nom: "Histologie & Embryologie",       couleur: "#991b1b", cree_le: now },
  { id: "mat_105", faculte_id: "fac_2", nom: "Biostatistiques & Santé Pub.",   couleur: "#ef4444", cree_le: now },
  { id: "mat_106", faculte_id: "fac_2", nom: "Génétique Médicale",             couleur: "#f87171", cree_le: now },
  { id: "mat_107", faculte_id: "fac_2", nom: "Immunologie",                    couleur: "#dc2626", cree_le: now },
  { id: "mat_108", faculte_id: "fac_2", nom: "Bactériologie & Virologie",      couleur: "#b91c1c", cree_le: now },

  // Sciences & Technologie (fac_3)
  { id: "mat_13",  faculte_id: "fac_3", nom: "Analyse Mathématique",           couleur: "#22c55e", cree_le: now },
  { id: "mat_14",  faculte_id: "fac_3", nom: "Mécanique du Point",             couleur: "#4ade80", cree_le: now },
  { id: "mat_15",  faculte_id: "fac_3", nom: "Chimie Organique",               couleur: "#86efac", cree_le: now },
  { id: "mat_16",  faculte_id: "fac_3", nom: "Biologie Cellulaire",            couleur: "#16a34a", cree_le: now },
  { id: "mat_17",  faculte_id: "fac_3", nom: "Algèbre Linéaire",               couleur: "#15803d", cree_le: now },
  { id: "mat_18",  faculte_id: "fac_3", nom: "Thermodynamique",                couleur: "#166534", cree_le: now },
  { id: "mat_109", faculte_id: "fac_3", nom: "Chimie Minérale",                couleur: "#22c55e", cree_le: now },
  { id: "mat_110", faculte_id: "fac_3", nom: "Physique Quantique",             couleur: "#16a34a", cree_le: now },
  { id: "mat_111", faculte_id: "fac_3", nom: "Électromagnétisme",              couleur: "#15803d", cree_le: now },
  { id: "mat_112", faculte_id: "fac_3", nom: "Sciences de l'Ingénieur",        couleur: "#166534", cree_le: now },

  // Lettres, Arts & Sciences Humaines (fac_4)
  { id: "mat_19",  faculte_id: "fac_4", nom: "Littérature Française",          couleur: "#a855f7", cree_le: now },
  { id: "mat_20",  faculte_id: "fac_4", nom: "Philosophie Antique",            couleur: "#c084fc", cree_le: now },
  { id: "mat_21",  faculte_id: "fac_4", nom: "Histoire Contemporaine",         couleur: "#d8b4fe", cree_le: now },
  { id: "mat_22",  faculte_id: "fac_4", nom: "Géographie Humaine",             couleur: "#7c3aed", cree_le: now },
  { id: "mat_23",  faculte_id: "fac_4", nom: "Linguistique Générale",          couleur: "#6d28d9", cree_le: now },
  { id: "mat_24",  faculte_id: "fac_4", nom: "Langue & Civ. Anglaise",         couleur: "#5b21b6", cree_le: now },
  { id: "mat_113", faculte_id: "fac_4", nom: "Littérature Comparée",           couleur: "#a855f7", cree_le: now },
  { id: "mat_114", faculte_id: "fac_4", nom: "Sociologie des Organisations",   couleur: "#c084fc", cree_le: now },
  { id: "mat_115", faculte_id: "fac_4", nom: "Sciences de l'Éducation",        couleur: "#7c3aed", cree_le: now },
  { id: "mat_116", faculte_id: "fac_4", nom: "Histoire de l'Art",              couleur: "#5b21b6", cree_le: now },

  // Informatique & Numérique (fac_5)
  { id: "mat_25",  faculte_id: "fac_5", nom: "Algorithmique & Struct. de Données", couleur: "#06b6d4", cree_le: now },
  { id: "mat_26",  faculte_id: "fac_5", nom: "Bases de Données (SQL/NoSQL)",   couleur: "#22d3ee", cree_le: now },
  { id: "mat_27",  faculte_id: "fac_5", nom: "Architecture des Ordinateurs",   couleur: "#67e8f9", cree_le: now },
  { id: "mat_28",  faculte_id: "fac_5", nom: "Programmation Web",              couleur: "#0891b2", cree_le: now },
  { id: "mat_29",  faculte_id: "fac_5", nom: "Intelligence Artificielle",      couleur: "#0e7490", cree_le: now },
  { id: "mat_30",  faculte_id: "fac_5", nom: "Génie Logiciel",                 couleur: "#155e75", cree_le: now },
  { id: "mat_117", faculte_id: "fac_5", nom: "Programmation Orientée Objet",   couleur: "#06b6d4", cree_le: now },
  { id: "mat_118", faculte_id: "fac_5", nom: "Systèmes d'Exploitation",        couleur: "#22d3ee", cree_le: now },
  { id: "mat_119", faculte_id: "fac_5", nom: "Réseaux Informatiques",          couleur: "#0891b2", cree_le: now },
  { id: "mat_120", faculte_id: "fac_5", nom: "Cybersécurité & Crypto.",        couleur: "#155e75", cree_le: now },

  // Pharmacie (fac_6)
  { id: "mat_31",  faculte_id: "fac_6", nom: "Chimie Thérapeutique",           couleur: "#f59e0b", cree_le: now },
  { id: "mat_32",  faculte_id: "fac_6", nom: "Pharmacognosie & Botanique",     couleur: "#fbbf24", cree_le: now },
  { id: "mat_33",  faculte_id: "fac_6", nom: "Toxicologie Clinique",           couleur: "#d97706", cree_le: now },
  { id: "mat_121", faculte_id: "fac_6", nom: "Pharmacocinétique",              couleur: "#f59e0b", cree_le: now },
  { id: "mat_122", faculte_id: "fac_6", nom: "Galénique & Biopharmacie",       couleur: "#fbbf24", cree_le: now },
  { id: "mat_123", faculte_id: "fac_6", nom: "Hématologie Biologique",         couleur: "#d97706", cree_le: now },
  { id: "mat_124", faculte_id: "fac_6", nom: "Microbiologie Pharmaceutique",   couleur: "#f59e0b", cree_le: now },
  { id: "mat_125", faculte_id: "fac_6", nom: "Droit de la Santé & Déonto.",    couleur: "#d97706", cree_le: now },

  // Sciences Économiques (fac_7)
  { id: "mat_34",  faculte_id: "fac_7", nom: "Microéconomie",                  couleur: "#14b8a6", cree_le: now },
  { id: "mat_35",  faculte_id: "fac_7", nom: "Macroéconomie",                  couleur: "#2dd4bf", cree_le: now },
  { id: "mat_36",  faculte_id: "fac_7", nom: "Économétrie Appliquée",          couleur: "#0d9488", cree_le: now },
  { id: "mat_126", faculte_id: "fac_7", nom: "Histoire Pensée Économique",     couleur: "#14b8a6", cree_le: now },
  { id: "mat_127", faculte_id: "fac_7", nom: "Mathématiques Financières",      couleur: "#2dd4bf", cree_le: now },
  { id: "mat_128", faculte_id: "fac_7", nom: "Monnaie, Banque et Finance",     couleur: "#0d9488", cree_le: now },
  { id: "mat_129", faculte_id: "fac_7", nom: "Économie Internationale",        couleur: "#14b8a6", cree_le: now },
  { id: "mat_130", faculte_id: "fac_7", nom: "Gestion Financière & Compta.",   couleur: "#0d9488", cree_le: now },

  // Psychologie (fac_8)
  { id: "mat_37",  faculte_id: "fac_8", nom: "Psychologie Cognitive",          couleur: "#ec4899", cree_le: now },
  { id: "mat_38",  faculte_id: "fac_8", nom: "Psychologie Clinique",           couleur: "#f472b6", cree_le: now },
  { id: "mat_39",  faculte_id: "fac_8", nom: "Neuropsychologie",               couleur: "#db2777", cree_le: now },
  { id: "mat_131", faculte_id: "fac_8", nom: "Psychologie du Développement",   couleur: "#ec4899", cree_le: now },
  { id: "mat_132", faculte_id: "fac_8", nom: "Psychologie Sociale",            couleur: "#f472b6", cree_le: now },
  { id: "mat_133", faculte_id: "fac_8", nom: "Statistiques Psycho.",           couleur: "#db2777", cree_le: now },
  { id: "mat_134", faculte_id: "fac_8", nom: "Psychologie du Travail",         couleur: "#ec4899", cree_le: now },
  { id: "mat_135", faculte_id: "fac_8", nom: "Éthique du Psychologue",         couleur: "#db2777", cree_le: now },

  // STAPS (fac_9)
  { id: "mat_40",  faculte_id: "fac_9", nom: "Biomécanique du Mouvement",      couleur: "#f97316", cree_le: now },
  { id: "mat_41",  faculte_id: "fac_9", nom: "Physiologie de l'Effort",        couleur: "#fb923c", cree_le: now },
  { id: "mat_42",  faculte_id: "fac_9", nom: "Théorie de l'Entraînement",      couleur: "#ea580c", cree_le: now },
  { id: "mat_136", faculte_id: "fac_9", nom: "Anatomie Fonctionnelle",         couleur: "#f97316", cree_le: now },
  { id: "mat_137", faculte_id: "fac_9", nom: "Psychologie du Sport",           couleur: "#fb923c", cree_le: now },
  { id: "mat_138", faculte_id: "fac_9", nom: "Sociologie du Sport",            couleur: "#ea580c", cree_le: now },
  { id: "mat_139", faculte_id: "fac_9", nom: "Histoire du Sport",              couleur: "#f97316", cree_le: now },
  { id: "mat_140", faculte_id: "fac_9", nom: "Didactique des Activités",       couleur: "#ea580c", cree_le: now },

  // Architecture & Design (fac_10)
  { id: "mat_43",  faculte_id: "fac_10", nom: "Histoire de l'Architecture",     couleur: "#84cc16", cree_le: now },
  { id: "mat_44",  faculte_id: "fac_10", nom: "Théorie de la Conception",       couleur: "#a3e635", cree_le: now },
  { id: "mat_45",  faculte_id: "fac_10", nom: "Matériaux de Construction",      couleur: "#65a30d", cree_le: now },
  { id: "mat_141", faculte_id: "fac_10", nom: "Outils de Représentation CAO",   couleur: "#84cc16", cree_le: now },
  { id: "mat_142", faculte_id: "fac_10", nom: "Structure & Mécanique",          couleur: "#a3e635", cree_le: now },
  { id: "mat_143", faculte_id: "fac_10", nom: "Urbanisme et Paysage",           couleur: "#65a30d", cree_le: now },
  { id: "mat_144", faculte_id: "fac_10", nom: "Atelier de Projet",              couleur: "#84cc16", cree_le: now },
  { id: "mat_145", faculte_id: "fac_10", nom: "Bâtiment Durable",               couleur: "#65a30d", cree_le: now },
];

export const MOCK_COURS: Cours[] = [
  // Droit Constitutionnel
  { id: "crs_1",  matiere_id: "mat_1",  titre: "La Constitution de la Ve République",        type: "texte_colle", contenu_brut: "La Cinquième République est le régime républicain en vigueur en France depuis le 4 octobre 1958. Elle a été instaurée sous l'impulsion du général de Gaulle suite à la crise algérienne. La Constitution établit un régime semi-présidentiel où le Président de la République joue un rôle central. Le suffrage universel direct pour l'élection du Président a été instauré en 1962 par référendum. Le Parlement bicaméral est composé de l'Assemblée nationale et du Sénat.", cree_le: now },
  { id: "crs_2",  matiere_id: "mat_1",  titre: "Les Droits Fondamentaux",                    type: "texte_colle", contenu_brut: "Les droits fondamentaux en France sont protégés par le bloc de constitutionnalité qui comprend la Constitution de 1958, la Déclaration des droits de l'homme de 1789 et le Préambule de 1946. Le Conseil constitutionnel veille au respect de ces droits.", cree_le: now },
  { id: "crs_3",  matiere_id: "mat_2",  titre: "Les Obligations Contractuelles",             type: "texte_colle", contenu_brut: "Le contrat est un accord de volontés entre deux ou plusieurs personnes destiné à créer, modifier, transmettre ou éteindre des obligations. Le Code civil français régit les contrats depuis 1804. La réforme de 2016 a modernisé le droit des contrats.", cree_le: now },
  { id: "crs_4",  matiere_id: "mat_3",  titre: "Les Éléments Constitutifs de l'Infraction", type: "audio",       contenu_brut: "Pour qu'une infraction soit caractérisée, trois éléments doivent être réunis : l'élément légal (texte réprimant le comportement), l'élément matériel (l'acte lui-même), et l'élément moral (intention ou imprudence).", cree_le: now },

  // Médecine
  { id: "crs_5",  matiere_id: "mat_7",  titre: "Le Système Nerveux Central",                 type: "audio",       contenu_brut: "Le système nerveux central (SNC) comprend l'encéphale et la moelle épinière. L'encéphale est protégé par la boîte crânienne et comprend le cerveau, le cervelet et le tronc cérébral. La moelle épinière est le relais entre l'encéphale et le reste du corps.", cree_le: now },
  { id: "crs_6",  matiere_id: "mat_7",  titre: "L'Appareil Cardio-Vasculaire",               type: "texte_colle", contenu_brut: "Le cœur est une pompe musculaire qui assure la circulation du sang dans l'organisme. Il est constitué de quatre cavités : deux oreillettes et deux ventricules. La circulation systémique porte le sang oxygéné aux organes, tandis que la circulation pulmonaire permet l'oxygénation du sang.", cree_le: now },
  { id: "crs_7",  matiere_id: "mat_8",  titre: "Les Enzymes et Leur Mécanisme",              type: "texte_colle", contenu_brut: "Les enzymes sont des biocatalyseurs protéiques qui accélèrent les réactions chimiques du métabolisme. Leur fonctionnement obéit à la loi de Michaelis-Menten. La constante Km représente l'affinité de l'enzyme pour son substrat.", cree_le: now },
  { id: "crs_8",  matiere_id: "mat_9",  titre: "La Physiologie Rénale",                      type: "audio",       contenu_brut: "Le rein assure la filtration du sang, la régulation de l'équilibre hydro-électrolytique et de la pression artérielle. Le néphron est l'unité fonctionnelle du rein. La filtration glomérulaire produit environ 180L d'urine primitive par jour.", cree_le: now },

  // Sciences
  { id: "crs_9",  matiere_id: "mat_13", titre: "Les Suites Numériques",                      type: "texte_colle", contenu_brut: "Une suite numérique est une fonction définie sur N ou une partie de N à valeurs réelles. Les suites arithmétiques ont une raison constante r. Les suites géométriques ont une raison q constante. Une suite est convergente si elle admet une limite finie.", cree_le: now },
  { id: "crs_10", matiere_id: "mat_14", titre: "La Mécanique Quantique — Introduction",      type: "texte_colle", contenu_brut: "La mécanique quantique décrit le comportement de la matière à l'échelle atomique et subatomique. Le principe d'incertitude d'Heisenberg stipule qu'il est impossible de connaître simultanément et précisément la position et la quantité de mouvement d'une particule.", cree_le: now },
  { id: "crs_11", matiere_id: "mat_15", titre: "Les Liaisons Chimiques",                     type: "texte_colle", contenu_brut: "Les liaisons chimiques sont les interactions entre atomes qui permettent la formation des molécules. On distingue les liaisons covalentes (partage d'électrons), ioniques (transfert d'électrons), et les liaisons faibles comme les liaisons hydrogène.", cree_le: now },

  // Informatique
  { id: "crs_12", matiere_id: "mat_25", titre: "Tri Rapide (QuickSort)",                     type: "texte_colle", contenu_brut: "Le tri rapide est un algorithme de tri par comparaison de complexité moyenne O(n log n). Il utilise une stratégie diviser pour régner en choisissant un pivot et en partitionnant le tableau. Il est l'un des algorithmes de tri les plus utilisés en pratique.", cree_le: now },
  { id: "crs_13", matiere_id: "mat_26", titre: "Le Modèle Entité-Association",               type: "texte_colle", contenu_brut: "Le modèle Entité-Association (EA) est un outil de modélisation de bases de données. Il décrit les données d'un système d'information sous forme d'entités (objets) et d'associations (relations entre objets). Les cardinalités définissent le nombre d'occurrences dans une relation.", cree_le: now },
  { id: "crs_14", matiere_id: "mat_29", titre: "Les Réseaux de Neurones Artificiels",        type: "audio",       contenu_brut: "Les réseaux de neurones artificiels sont des modèles informatiques inspirés du cerveau humain. Ils sont composés de couches de neurones interconnectés. L'apprentissage se fait par rétropropagation du gradient. Les réseaux de neurones profonds (Deep Learning) permettent de traiter des tâches complexes comme la reconnaissance d'images.", cree_le: now },

  // Lettres & Humanités
  { id: "crs_15", matiere_id: "mat_20", titre: "L'Existentialisme de Sartre",                type: "texte_colle", contenu_brut: "L'existentialisme est un courant philosophique dont Jean-Paul Sartre est le principal représentant en France. Pour Sartre, 'l'existence précède l'essence' : l'homme n'a pas de nature prédéfinie et se définit par ses actes. La liberté est totale mais accompagnée d'une responsabilité absolue.", cree_le: now },
  { id: "crs_16", matiere_id: "mat_21", titre: "La Révolution Française",                    type: "audio",       contenu_brut: "La Révolution française (1789-1799) est une période de bouleversements politiques et sociaux majeurs. Elle débute avec la réunion des États généraux en mai 1789 et la prise de la Bastille le 14 juillet 1789. Elle aboutit à l'abolition de la monarchie absolue et à la Déclaration des Droits de l'Homme et du Citoyen.", cree_le: now },

  // Psychologie
  { id: "crs_17", matiere_id: "mat_37", titre: "La Mémoire et ses Mécanismes",               type: "texte_colle", contenu_brut: "La mémoire humaine est un système cognitif complexe permettant d'encoder, stocker et récupérer des informations. On distingue la mémoire à court terme (MCT) et la mémoire à long terme (MLT). La MLT comprend la mémoire épisodique (souvenirs personnels), sémantique (connaissances générales) et procédurale (habiletés).", cree_le: now },
  { id: "crs_18", matiere_id: "mat_39", titre: "Le Cortex Préfrontal et les Fonctions Exécutives", type: "audio", contenu_brut: "Le cortex préfrontal est la région antérieure du lobe frontal. Il est impliqué dans les fonctions exécutives : planification, inhibition, flexibilité mentale et mémoire de travail. Des lésions de cette zone entraînent des troubles du comportement et de la personnalité.", cree_le: now },

  // STAPS
  { id: "crs_19", matiere_id: "mat_41", titre: "La VO2max et l'Endurance",                   type: "texte_colle", contenu_brut: "La VO2max représente la consommation maximale d'oxygène d'un individu lors d'un effort intense. C'est un marqueur de la capacité aérobie. Elle se mesure sur tapis roulant ou ergocycle en spirométrie. L'entraînement en endurance permet d'augmenter la VO2max.", cree_le: now },

  // Économie
  { id: "crs_20", matiere_id: "mat_34", titre: "L'Élasticité Prix de la Demande",            type: "texte_colle", contenu_brut: "L'élasticité-prix de la demande mesure la sensibilité de la quantité demandée d'un bien à une variation de son prix. Elle est définie comme le rapport de la variation relative des quantités demandées à la variation relative du prix. Une élasticité supérieure à 1 en valeur absolue indique un bien élastique.", cree_le: now },
];

export const MOCK_RESUMES: Resume[] = [
  {
    id: "res_1", cours_id: "crs_1",
    contenu: `# La Constitution de la Ve République

## 1. Origines et Contexte Historique
La Cinquième République est le régime républicain en vigueur en France depuis le 4 octobre 1958. Elle a été instaurée sous l'impulsion du général Charles de Gaulle suite à la crise algérienne qui menaçait la stabilité du pays. 
Contrairement à la IVe République, marquée par une instabilité gouvernementale chronique, ce nouveau régime a été pensé pour restaurer l'autorité de l'État.

## 2. Le Pouvoir Exécutif
L'exécutif est le cœur du pouvoir sous la Ve République. Il est bicéphale, composé du Président de la République et du Gouvernement dirigé par le Premier ministre.

### 2.1. Le Président de la République
Clé de voûte des institutions, le Président dispose de pouvoirs propres (qui ne nécessitent pas le contreseing ministériel) :
- Nomination du Premier ministre
- Dissolution de l'Assemblée nationale
- Recours au référendum (Article 11)
- Pouvoirs exceptionnels en cas de crise majeure (Article 16)

Depuis la révision constitutionnelle de 1962 (adoptée par référendum), le Président est élu au suffrage universel direct, ce qui lui confère une légitimité démocratique très forte.

### 2.2. Le Gouvernement
Il détermine et conduit la politique de la Nation. Il est responsable devant le Parlement (et peut être renversé par une motion de censure).

## 3. Le Pouvoir Législatif
Le Parlement français est bicaméral, constitué de deux assemblées :

1. **L'Assemblée Nationale** : Élus au suffrage universel direct, les députés représentent le peuple. L'Assemblée a le dernier mot en cas de désaccord législatif.
2. **Le Sénat** : Élus au suffrage indirect, les sénateurs représentent les collectivités territoriales.

Le rôle du Parlement est de voter la loi, de contrôler l'action du Gouvernement et d'évaluer les politiques publiques. L'article 49.3 de la Constitution permet notamment au Gouvernement de faire passer un texte sans vote, engageant ainsi sa responsabilité.

## 4. Le Conseil Constitutionnel
Créé en 1958, le Conseil constitutionnel veille à la régularité des élections nationales et des référendums. Son rôle majeur est de se prononcer sur la conformité à la Constitution des lois avant (contrôle a priori) ou après (contrôle a posteriori, via la QPC depuis 2008) leur promulgation.

## Conclusion
La Ve République a su s'adapter aux alternances politiques et aux cohabitations. Son caractère hybride (semi-présidentiel) en fait un modèle institutionnel singulier, offrant un pouvoir exécutif particulièrement fort tout en préservant le cadre démocratique parlementaire.`,
    points_cles: ["Créée le 4 octobre 1958", "Régime semi-présidentiel", "Élection présidentielle au suffrage universel depuis 1962", "Parlement bicaméral (AN + Sénat)", "Rôle central du Conseil constitutionnel", "Pouvoirs propres du Président"],
    cree_le: now,
  },
  {
    id: "res_2", cours_id: "crs_5",
    contenu: "Le SNC est le centre de contrôle de l'organisme. Il comprend l'encéphale (cerveau, cervelet, tronc cérébral) et la moelle épinière. Les neurones sont les unités fonctionnelles qui transmettent l'information via des signaux électriques et chimiques (neurotransmetteurs).",
    points_cles: ["Encéphale + moelle épinière", "Cerveau : fonctions cognitives supérieures", "Cervelet : coordination motrice", "Tronc cérébral : fonctions vitales", "Neurones et synapses"],
    cree_le: now,
  },
  {
    id: "res_3", cours_id: "crs_12",
    contenu: "Le QuickSort est un algorithme de tri diviser pour régner de complexité moyenne O(n log n). Il choisit un pivot, partition le tableau en deux sous-tableaux (éléments inférieurs et supérieurs), puis les trie récursivement. Dans le pire cas (pivot toujours extrême), la complexité est O(n²).",
    points_cles: ["Complexité moyenne : O(n log n)", "Stratégie diviser pour régner", "Choix du pivot crucial", "Pire cas : O(n²)", "Tri en place (peu de mémoire)"],
    cree_le: now,
  },
  {
    id: "res_4", cours_id: "crs_17",
    contenu: "La mémoire humaine comprend une mémoire à court terme (MCT, ~7 éléments, secondes) et une mémoire à long terme (MLT, illimitée). La MLT contient la mémoire épisodique (événements vécus), sémantique (connaissances) et procédurale (compétences motrices). L'hippocampe joue un rôle clé dans la consolidation mémorielle.",
    points_cles: ["MCT : 7 ± 2 éléments, durée courte", "MLT : capacité illimitée", "Mémoire épisodique, sémantique, procédurale", "Hippocampe = consolidation", "Répétition espacée pour mémoriser"],
    cree_le: now,
  },
];

export const MOCK_FLASHCARDS: Flashcard[] = [
  // Droit constitutionnel
  { id: "fc_1",  cours_id: "crs_1", question: "Quelle date marque le début de la Ve République ?", reponse: "4 octobre 1958", statut: "maitrisee", cree_le: now },
  { id: "fc_2",  cours_id: "crs_1", question: "Qui est le principal artisan de la Constitution de 1958 ?", reponse: "Charles de Gaulle (et Michel Debré)", statut: "en_cours", cree_le: now },
  { id: "fc_3",  cours_id: "crs_1", question: "Depuis quelle année le Président est-il élu au suffrage universel direct ?", reponse: "1962 (après le référendum instauré par de Gaulle)", statut: "nouvelle", cree_le: now },
  { id: "fc_4",  cours_id: "crs_1", question: "Quelles sont les deux chambres du Parlement français ?", reponse: "L'Assemblée nationale et le Sénat", statut: "maitrisee", cree_le: now },
  // SNC
  { id: "fc_5",  cours_id: "crs_5", question: "Quelles sont les 2 composantes du SNC ?", reponse: "L'encéphale et la moelle épinière", statut: "maitrisee", cree_le: now },
  { id: "fc_6",  cours_id: "crs_5", question: "Quel rôle joue le cervelet ?", reponse: "Coordination des mouvements et équilibre", statut: "en_cours", cree_le: now },
  // Mémoire
  { id: "fc_7",  cours_id: "crs_17", question: "Quelle est la capacité de la mémoire à court terme ?", reponse: "7 ± 2 éléments (Miller, 1956)", statut: "nouvelle", cree_le: now },
  { id: "fc_8",  cours_id: "crs_17", question: "Quelle structure cérébrale consolide les souvenirs ?", reponse: "L'hippocampe", statut: "en_cours", cree_le: now },
  { id: "fc_9",  cours_id: "crs_17", question: "Citez les 3 types de mémoire à long terme", reponse: "Épisodique, sémantique, procédurale", statut: "nouvelle", cree_le: now },
  // QuickSort
  { id: "fc_10", cours_id: "crs_12", question: "Quelle est la complexité moyenne du QuickSort ?", reponse: "O(n log n)", statut: "en_cours", cree_le: now },
  { id: "fc_11", cours_id: "crs_12", question: "Quelle est la complexité dans le pire cas du QuickSort ?", reponse: "O(n²) — quand le pivot est toujours l'élément extrême", statut: "nouvelle", cree_le: now },
];

// ─────────────────────────────────────────────────────────────────────────────
// Fonctions simulant l'API
// ─────────────────────────────────────────────────────────────────────────────

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getUser(): Promise<User> {
  await delay(200);
  return MOCK_USER;
}

export async function getFacultes(): Promise<Faculte[]> {
  await delay(200);
  return MOCK_FACULTES;
}

export async function getMatieresByFaculte(faculte_id: string): Promise<Matiere[]> {
  await delay(200);
  return MOCK_MATIERES.filter(m => m.faculte_id === faculte_id);
}

export async function getCoursByMatiere(matiere_id: string): Promise<Cours[]> {
  await delay(200);
  return MOCK_COURS.filter(c => c.matiere_id === matiere_id);
}

export async function getResumeByCours(cours_id: string): Promise<Resume | undefined> {
  await delay(300);
  return MOCK_RESUMES.find(r => r.cours_id === cours_id);
}

export async function getFlashcardsByCours(cours_id: string): Promise<Flashcard[]> {
  await delay(300);
  return MOCK_FLASHCARDS.filter(f => f.cours_id === cours_id);
}
