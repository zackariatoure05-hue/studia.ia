import { NextRequest, NextResponse } from "next/server";

// ── Types ──────────────────────────────────────────────────────────────────

export type GeneratedCourse = {
  resume: string;        // Markdown complet, multi-sections
  pointsCles: string[];  // 5-10 points clés
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
    depthInstruction: "Fais un résumé approfondi en 5-6 sections avec sous-sections, exemples détaillés et mise en contexte académique.",
    enrichInstruction: "Enrichis avec des connaissances académiques pertinentes au-delà du contenu brut : théories associées, auteurs/chercheurs clés, applications pratiques, comparaisons et nuances importantes pour l'examen.",
  },
  premium: {
    resumeSections: 8,
    flashcardsCount: 20,
    depthInstruction: "Fais un résumé exhaustif niveau master en 7-8 sections avec sous-sections détaillées, références académiques, analyses critiques et perspectives.",
    enrichInstruction: "Enrichis massivement avec : théories avancées, débats académiques actuels, études de cas, contre-exemples, liens interdisciplinaires, méthodes d'application en examen et tout ce qu'un étudiant brillant doit maîtriser sur ce sujet.",
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
      return NextResponse.json(generateLocalFallback(titre, matiere, transcription, plan as keyof typeof PLAN_CONFIG));
    }

    const config = PLAN_CONFIG[plan as keyof typeof PLAN_CONFIG] ?? PLAN_CONFIG.decouverte;

    const prompt = `Tu es un assistant pédagogique expert pour étudiants universitaires français.

**Contexte du cours :**
- Titre : ${titre}
- Matière : ${matiere || "Non précisée"}
- Plan de l'étudiant : ${plan} (niveau d'approfondissement : ${config.depthInstruction})

**Contenu brut à analyser (transcription ou texte collé) :**
\`\`\`
${transcription.slice(0, 8000)}
\`\`\`

**Ta mission :**
${config.depthInstruction}
${config.enrichInstruction}

**RÈGLES ABSOLUES :**
1. NE JAMAIS recopier la transcription brute. C'est une synthèse pédagogique reformulée et enrichie.
2. Le résumé doit être en Markdown structuré avec des titres (##, ###), listes à puces, et **gras** pour les concepts clés.
3. Commence TOUJOURS par une introduction qui contextualise le sujet dans la matière.
4. Génère exactement ${config.flashcardsCount} flashcards question/réponse précises, cohérentes avec le contenu RÉEL (pas génériques).
5. Les flashcards doivent couvrir des définitions, des mécanismes, des applications, des distinctions importantes.
6. Réponds UNIQUEMENT en JSON valide, sans markdown autour du JSON.

**Format de réponse JSON STRICT :**
{
  "resume": "# ${titre}\\n\\n## Introduction\\n...(contenu markdown complet)...",
  "pointsCles": ["point 1", "point 2", "...", "point N"],
  "flashcards": [
    {"question": "...", "reponse": "..."},
    ...
  ]
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: plan === "etudiant_plus" ? 8192 : plan === "etudiant" ? 6000 : 3000,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      return NextResponse.json(generateLocalFallback(titre, matiere, transcription, plan as keyof typeof PLAN_CONFIG));
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
        return NextResponse.json(generateLocalFallback(titre, matiere, transcription, plan as keyof typeof PLAN_CONFIG));
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
    .map(s => s.trim())
    .filter(s => s.length > 15);

  // Extraire les concepts-clés (mots capitalisés ou après ":")
  const concepts = Array.from(new Set(
    transcription.match(/\b[A-ZÉÀÈÙÂÊÎÔÛ][a-zéàèùâêîôû]{3,}(?:\s+[A-ZÉÀÈÙÂÊÎÔÛ]?[a-zéàèùâêîôû]{2,}){0,3}/g) ?? []
  )).slice(0, 8);

  const intro = sentences.slice(0, 2).join(" ");
  const body = sentences.slice(2);
  const chunkSize = Math.max(1, Math.floor(body.length / Math.max(config.resumeSections - 1, 1)));

  let resumeContent = `# ${titre}\n\n`;
  resumeContent += `## Introduction\n${intro || "Ce cours porte sur " + titre + " dans le cadre de la matière " + matiere + "."}\n\n`;

  const sectionTitles = [
    "Concepts fondamentaux", "Mécanismes et principes", "Applications et exemples",
    "Points clés à retenir", "Analyse approfondie", "Perspectives et enjeux",
    "Comparaisons et nuances", "Synthèse"
  ];

  for (let i = 0; i < config.resumeSections - 1 && body.length > 0; i++) {
    const chunk = body.slice(i * chunkSize, (i + 1) * chunkSize);
    if (chunk.length === 0) break;
    resumeContent += `## ${sectionTitles[i] || "Section " + (i + 1)}\n`;
    resumeContent += chunk.join(" ") + "\n\n";
  }

  const pointsCles = sentences
    .filter(s => s.length > 20)
    .slice(0, 8)
    .map(s => s.length > 100 ? s.slice(0, 97) + "..." : s);

  // Générer des flashcards basées sur le contenu réel
  const flashcards: { question: string; reponse: string }[] = [];
  const fcSentences = sentences.filter(s => s.length > 20);

  if (concepts.length > 0) {
    flashcards.push({
      question: `Qu'est-ce que "${concepts[0]}" dans le contexte de ${titre} ?`,
      reponse: fcSentences.find(s => s.includes(concepts[0]))?.slice(0, 200) || concepts[0],
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
