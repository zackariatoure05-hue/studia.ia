import { NextRequest, NextResponse } from "next/server";

// ── Types ──────────────────────────────────────────────────────────────────

export type GeneratedCourse = {
  resume: string; // Markdown complet, multi-sections
  pointsCles: string[]; // 5-10 points clés
  flashcards: { question: string; reponse: string }[];
};

// ── Config par plan ────────────────────────────────────────────────────────

const PLAN_CONFIG = {
  decouverte: {
    resumeSections: 3,
    flashcardsCount: 5,
    depthInstruction: "Fais un résumé concis en 3 sections principales avec les points essentiels.",
    enrichInstruction: "Reste proche du contenu fourni. Ajoute 1-2 exemples concrets simples.",
  },
  etudiant: {
    resumeSections: 6,
    flashcardsCount: 12,
    depthInstruction:
      "Fais un résumé approfondi en 5-6 sections avec sous-sections, exemples détaillés et mise en contexte académique.",
    enrichInstruction:
      "Enrichis avec des connaissances académiques pertinentes au-delà du contenu brut : théories associées, auteurs/chercheurs clés, applications pratiques, comparaisons et nuances importantes pour l'examen.",
  },
  premium: {
    resumeSections: 8,
    flashcardsCount: 20,
    depthInstruction:
      "Fais un résumé exhaustif niveau master en 7-8 sections avec sous-sections détaillées, références académiques, analyses critiques et perspectives.",
    enrichInstruction:
      "Enrichis massivement avec : théories avancées, débats académiques actuels, études de cas, contre-exemples, liens interdisciplinaires, méthodes d'application en examen et tout ce qu'un étudiant brillant doit maîtriser sur ce sujet.",
  },
};

// ── Handler ────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const { titre, matiere, transcription, plan = "decouverte" } = await req.json();

    if (!titre || !transcription) {
      return NextResponse.json({ error: "titre et transcription requis" }, { status: 400 });
    }

    const apiKey = process.env.AI_API_KEY;
    if (!apiKey || apiKey.includes("votre-cle")) {
      // Pas de clé API : génération locale de qualité
      return NextResponse.json(
        generateLocalFallback(titre, matiere, transcription, plan as keyof typeof PLAN_CONFIG)
      );
    }

    const config = PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG] ?? PLAN_CONFIG.decouverte;

    const prompt = `Tu es un professeur d'université expert dans la structuration des connaissances et l'apprentissage actif.
Ta mission est de transformer un contenu brut en un matériel de révision de très haute qualité, parfaitement structuré et prêt à être mémorisé.

**Contexte du cours :**
- Titre : ${titre}
- Matière : ${matiere || "Non précisée"}
- Niveau d'exigence : ${config.depthInstruction}

**Contenu brut à analyser :**
(Attention: Si ce texte provient d'une transcription vocale automatique, il peut contenir de nombreuses fautes de frappe, mots manquants ou mots mal compris. Corrige implicitement ces erreurs en te basant sur le contexte avant de résumer).
\`\`\`
${transcription.slice(0, 10000)}
\`\`\`

**INSTRUCTIONS - 1. Le Résumé (resume) :**
- ${config.depthInstruction}
- ${config.enrichInstruction}
- Structure le contenu avec une logique implacable. Commence par une ## Introduction. 
- Utilise une hiérarchie claire (## Titre principal, ### Sous-titre).
- Mets en **gras** les concepts clés, les dates, les noms importants ou les formules.
- Utilise des listes à puces pour les énumérations.
- INTERDICTION ABSOLUE de recopier le texte brut mot pour mot (pas de copier-coller).
- C'est une VRAIE SYNTHÈSE : tu dois regrouper les idées similaires, reformuler de manière claire et concise.
- INTERDICTION de te répéter. Évite d'utiliser deux fois la même phrase ou les mêmes mots pour dire la même chose dans des sections différentes.
- Si le texte original se répète, tu dois fusionner les informations pour n'en faire qu'une seule explication claire.

**INSTRUCTIONS - 2. Les Points Clés (pointsCles) :**
- Extrais les idées maîtresses absolues (minimum 5). Ce que l'étudiant doit retenir s'il n'avait que 3 minutes pour réviser.

**INSTRUCTIONS - 3. Les Flashcards (flashcards) :**
- Génère EXACTEMENT ${config.flashcardsCount} flashcards.
- Ce doivent être de VRAIES flashcards de type "Anki" pour l'apprentissage actif.
- INTERDIT : Les questions vagues ("Que dit le texte ?", "Quel est le sujet ?").
- OBLIGATOIRE : Des questions très spécifiques (ex: "Quelle est la définition de X ?", "Quelles sont les 3 causes de Y ?", "Quelle est la différence entre X et Y ?").
- La réponse doit être concise, directe et mémorisable (1 à 3 phrases max).

**Format de réponse exigé :**
Tu dois IMPÉRATIVEMENT répondre avec un objet JSON strictement valide.
{
  "resume": "# ${titre}\\n\\n## Introduction\\n...", 
  "pointsCles": ["point clé 1", "point clé 2"],
  "flashcards": [
    {"question": "Question précise ?", "reponse": "Réponse concise et directe."}
  ]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: plan === "etudiant_plus" ? 8192 : plan === "etudiant" ? 6000 : 3000,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      return NextResponse.json(
        generateLocalFallback(titre, matiere, transcription, plan as keyof typeof PLAN_CONFIG)
      );
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    let parsed: GeneratedCourse;
    try {
      parsed = JSON.parse(rawText);
    } catch {
      // Si le JSON est dans un bloc markdown
      const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1]);
      } else {
        return NextResponse.json(
          generateLocalFallback(titre, matiere, transcription, plan as keyof typeof PLAN_CONFIG)
        );
      }
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("generate-course error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ── Fallback local (sans clé API) ─────────────────────────────────────────

function generateLocalFallback(
  titre: string,
  matiere: string,
  transcription: string,
  plan: keyof typeof PLAN_CONFIG
): GeneratedCourse {
  const config = PLAN_CONFIG[plan] ?? PLAN_CONFIG.decouverte;
  const sentences = transcription
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15);

  // Extraire les concepts-clés (mots capitalisés ou après ":")
  const concepts = Array.from(
    new Set(
      transcription.match(
        /\b[A-ZÉÀÈÙÂÊÎÔÛ][a-zéàèùâêîôû]{3,}(?:\s+[A-ZÉÀÈÙÂÊÎÔÛ]?[a-zéàèùâêîôû]{2,}){0,3}/g
      ) ?? []
    )
  ).slice(0, 8);

  const intro = sentences.slice(0, 2).join(" ");
  const body = sentences.slice(2);
  const chunkSize = Math.max(1, Math.floor(body.length / Math.max(config.resumeSections - 1, 1)));

  let resumeContent = `# ${titre}\n\n`;
  resumeContent += `## Introduction\n${intro || "Ce cours porte sur " + titre + " dans le cadre de la matière " + matiere + "."}\n\n`;

  const sectionTitles = [
    "Concepts fondamentaux",
    "Mécanismes et principes",
    "Applications et exemples",
    "Points clés à retenir",
    "Analyse approfondie",
    "Perspectives et enjeux",
    "Comparaisons et nuances",
    "Synthèse",
  ];

  for (let i = 0; i < config.resumeSections - 1 && body.length > 0; i++) {
    const chunk = body.slice(i * chunkSize, (i + 1) * chunkSize);
    if (chunk.length === 0) break;
    resumeContent += `## ${sectionTitles[i] || "Section " + (i + 1)}\n`;
    resumeContent += chunk.join(" ") + "\n\n";
  }

  const pointsCles = sentences
    .filter((s) => s.length > 20)
    .slice(0, 8)
    .map((s) => (s.length > 100 ? s.slice(0, 97) + "..." : s));

  // Générer des flashcards basées sur le contenu réel
  const flashcards: { question: string; reponse: string }[] = [];
  const fcSentences = sentences.filter((s) => s.length > 20);

  if (concepts.length > 0) {
    flashcards.push({
      question: `Qu'est-ce que "${concepts[0]}" dans le contexte de ${titre} ?`,
      reponse: fcSentences.find((s) => s.includes(concepts[0]))?.slice(0, 200) || concepts[0],
    });
  }

  for (let i = 0; i < Math.min(config.flashcardsCount - 1, fcSentences.length); i++) {
    const s = fcSentences[i];
    const words = s.split(" ");
    if (words.length < 5) continue;
    const keyWord = concepts[i % concepts.length] || words[Math.floor(words.length / 2)];
    flashcards.push({
      question: `Que signifie ou qu'implique "${keyWord}" dans ce cours ?`,
      reponse: s.slice(0, 200),
    });
    if (flashcards.length >= config.flashcardsCount) break;
  }

  // Complète si pas assez
  while (flashcards.length < Math.min(5, config.flashcardsCount)) {
    flashcards.push({
      question: `Quel est le point principal de la section "${sectionTitles[flashcards.length]}" ?`,
      reponse: body[flashcards.length] || "Voir le résumé complet de ce cours.",
    });
  }

  return {
    resume: resumeContent,
    pointsCles: pointsCles.length > 0 ? pointsCles : [`Le cours "${titre}" traite de ${matiere}.`],
    flashcards: flashcards.slice(0, config.flashcardsCount),
  };
}
