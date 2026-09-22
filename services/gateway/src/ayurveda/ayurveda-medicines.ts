import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export interface AyurvedicMedicine {
  id: string;
  name: string;
  canonicalName: string;
  category: string;
  dosageForm: string;
  defaultDose: string;
  defaultFrequency: string;
  defaultTiming: string;
  defaultDuration: string;
  defaultAnupana: string;
  source: string;
}

function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function inferFormAndAnupana(category: string, name: string): {
  form: string;
  dose: string;
  freq: string;
  timing: string;
  duration: string;
  anupana: string;
} {
  const catUpper = (category || "").toUpperCase();
  const nameUpper = (name || "").toUpperCase();

  if (catUpper.includes("ASAVA") || catUpper.includes("ARISTA") || nameUpper.endsWith("ASAVA") || nameUpper.endsWith("ARISHTA") || nameUpper.endsWith("ARISTA")) {
    return {
      form: "Liquid (आसव/अरिष्ट)",
      dose: "20 ml",
      freq: "Twice daily (दिन में दो बार)",
      timing: "After meals (भोजनोपरांत)",
      duration: "15 days",
      anupana: "Equal quantity of warm water (समभाग उष्ण जल)",
    };
  }

  if (catUpper.includes("VATI") || catUpper.includes("GUTIKA") || nameUpper.endsWith("VATI") || nameUpper.endsWith("GUTIKA")) {
    return {
      form: "Tablet (वटी/गुटिका)",
      dose: "1-2 tablets",
      freq: "Twice daily (दिन में दो बार)",
      timing: "After meals (भोजनोपरांत)",
      duration: "7 days",
      anupana: "Warm water (उष्ण जल)",
    };
  }

  if (catUpper.includes("CHURNA") || nameUpper.endsWith("CHURNA") || nameUpper.endsWith("CURNA")) {
    return {
      form: "Powder (चूर्ण)",
      dose: "3-5 grams",
      freq: "Twice daily (दिन में दो बार)",
      timing: "After meals (भोजनोपरांत)",
      duration: "10 days",
      anupana: "Honey or warm water (मधु अथवा उष्ण जल)",
    };
  }

  if (catUpper.includes("GHRITA") || nameUpper.endsWith("GHRITA") || nameUpper.endsWith("GHRTA")) {
    return {
      form: "Medicated Ghee (घृत)",
      dose: "5-10 ml (1-2 tsp)",
      freq: "Twice daily (सुबह-शाम)",
      timing: "Before meals / Empty stomach (प्रातः खाली पेट)",
      duration: "15 days",
      anupana: "Warm water or warm milk (उष्ण जल / गोदुग्ध)",
    };
  }

  if (catUpper.includes("TAILA") || nameUpper.endsWith("TAILA")) {
    return {
      form: "Medicated Oil (तैल)",
      dose: "External / 2-4 drops",
      freq: "Once or twice daily",
      timing: "Morning or bedtime (सुबह/सोते समय)",
      duration: "14 days",
      anupana: "External application or Warm water (बाह्य प्रयोग / उष्ण जल)",
    };
  }

  if (catUpper.includes("BHASMA") || nameUpper.endsWith("BHASMA")) {
    return {
      form: "Bhasma (भस्म)",
      dose: "125-250 mg",
      freq: "Twice daily (दिन में दो बार)",
      timing: "After meals (भोजनोपरांत)",
      duration: "7 days",
      anupana: "Honey or milk cream (मधु / मलाई)",
    };
  }

  if (catUpper.includes("RASA") || nameUpper.endsWith("RASA") || nameUpper.endsWith("RAS")) {
    return {
      form: "Herbo-mineral (रसौषधि)",
      dose: "1 tablet (125-250mg)",
      freq: "Twice daily (दिन में दो बार)",
      timing: "After meals (भोजनोपरांत)",
      duration: "5 days",
      anupana: "Honey or ginger juice (मधु / आर्द्रक स्वरस)",
    };
  }

  if (catUpper.includes("AVALEHA") || catUpper.includes("PAKA") || nameUpper.endsWith("LEHA") || nameUpper.endsWith("AVALEHA")) {
    return {
      form: "Herbal Jam (अवलेह/पाक)",
      dose: "5-10 grams (1-2 tsp)",
      freq: "Twice daily (सुबह-शाम)",
      timing: "After meals or with milk (दूध के साथ)",
      duration: "15 days",
      anupana: "Warm milk (उष्ण गोदुग्ध)",
    };
  }

  if (catUpper.includes("KWATHA") || catUpper.includes("KVATHA") || nameUpper.endsWith("KWATH") || nameUpper.endsWith("KASHAYA")) {
    return {
      form: "Decoction (क्वाथ/काढ़ा)",
      dose: "30-40 ml",
      freq: "Twice daily (दिन में दो बार)",
      timing: "Before meals (भोजन से पूर्व)",
      duration: "7 days",
      anupana: "Warm water (उष्ण जल)",
    };
  }

  return {
    form: "Formulation (योग)",
    dose: "1 unit / standard dose",
    freq: "Twice daily (दिन में दो बार)",
    timing: "After meals (भोजनोपरांत)",
    duration: "7 days",
    anupana: "Warm water (उष्ण जल)",
  };
}

let cachedMedicines: AyurvedicMedicine[] | null = null;

export function loadAyurvedicMedicines(): AyurvedicMedicine[] {
  if (cachedMedicines) return cachedMedicines;

  const candidatePaths = [
    resolve(__dirname, "../../../../infra/seed/ayush-formulary/afi-formulations.csv"),
    resolve(process.cwd(), "infra/seed/ayush-formulary/afi-formulations.csv"),
    resolve(process.cwd(), "../../infra/seed/ayush-formulary/afi-formulations.csv"),
    "/Users/codesmoker/CareFlow/infra/seed/ayush-formulary/afi-formulations.csv",
  ];

  let csvContent = "";
  for (const p of candidatePaths) {
    if (existsSync(p)) {
      try {
        csvContent = readFileSync(p, "utf-8");
        break;
      } catch {
        // try next candidate
      }
    }
  }

  const list: AyurvedicMedicine[] = [];
  const seen = new Set<string>();

  if (csvContent) {
    const lines = csvContent.split("\n");
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const parts = line.split(",");
      if (parts.length < 5) continue;
      const source = parts[0];
      const categorySection = parts[1];
      const formulationNo = parts[3];
      const rawName = parts[4];
      if (!rawName || rawName.length < 2) continue;

      const normName = titleCase(rawName);
      const key = normName.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);

      const defaults = inferFormAndAnupana(categorySection, rawName);
      list.push({
        id: `afi-${source}-${formulationNo}-${key.replace(/\s+/g, "-")}`,
        name: normName,
        canonicalName: rawName,
        category: titleCase(categorySection),
        dosageForm: defaults.form,
        defaultDose: defaults.dose,
        defaultFrequency: defaults.freq,
        defaultTiming: defaults.timing,
        defaultDuration: defaults.duration,
        defaultAnupana: defaults.anupana,
        source: "AFI (Ayurvedic Formulary of India)",
      });
    }
  }

  // Curated prominent classical formulations to guarantee coverage of standard OPD prescriptions
  const prominent = [
    {
      name: "Sudarshan Vati (सुदर्शन वटी)",
      canonicalName: "SUDARSHAN VATI",
      category: "Vati And Gutika",
      dosageForm: "Tablet (वटी)",
      defaultDose: "2 tablets",
      defaultFrequency: "Twice daily (सुबह-शाम)",
      defaultTiming: "After meals (भोजनोपरांत)",
      defaultDuration: "5 days",
      defaultAnupana: "Warm water (उष्ण जल)",
    },
    {
      name: "Tribhuvan Kirti Rasa (त्रिभुवन कीर्ति रस)",
      canonicalName: "TRIBHUVAN KIRTI RASA",
      category: "Rasa / Rasashastra",
      dosageForm: "Tablet (रसौषधि)",
      defaultDose: "1 tablet (125mg)",
      defaultFrequency: "Twice daily (दिन में दो बार)",
      defaultTiming: "After meals (भोजनोपरांत)",
      defaultDuration: "3 days",
      defaultAnupana: "Honey with ginger juice (मधु + अदरक रस)",
    },
    {
      name: "Sitopaladi Churna (सितोपलादि चूर्ण)",
      canonicalName: "SITOPALADI CHURNA",
      category: "Churna",
      dosageForm: "Powder (चूर्ण)",
      defaultDose: "3 grams",
      defaultFrequency: "Thrice daily (दिन में तीन बार)",
      defaultTiming: "After meals (भोजनोपरांत)",
      defaultDuration: "7 days",
      defaultAnupana: "Honey (मधु) / Warm water",
    },
    {
      name: "Talisadi Churna (तालिसादि चूर्ण)",
      canonicalName: "TALISADI CHURNA",
      category: "Churna",
      dosageForm: "Powder (चूर्ण)",
      defaultDose: "3 grams",
      defaultFrequency: "Thrice daily",
      defaultTiming: "After meals",
      defaultDuration: "7 days",
      defaultAnupana: "Honey (मधु)",
    },
    {
      name: "Ashwagandha Churna (अश्वगंधा चूर्ण)",
      canonicalName: "ASHWAGANDHA CHURNA",
      category: "Churna",
      dosageForm: "Powder (चूर्ण)",
      defaultDose: "3-5 grams",
      defaultFrequency: "Twice daily",
      defaultTiming: "Bedtime / After dinner",
      defaultDuration: "30 days",
      anupana: "Warm milk with a pinch of ghee (उष्ण दुग्ध)",
    },
    {
      name: "Triphala Churna (त्रिफला चूर्ण)",
      canonicalName: "TRIPHALA CHURNA",
      category: "Churna",
      dosageForm: "Powder (चूर्ण)",
      defaultDose: "3-5 grams",
      defaultFrequency: "Once daily",
      defaultTiming: "At bedtime (रात्रि शयन काल)",
      defaultDuration: "15 days",
      defaultAnupana: "Warm water (उष्ण जल)",
    },
    {
      name: "Amritarishta (अमृतारिष्ट)",
      canonicalName: "AMRITARISHTA",
      category: "Asava And Arista",
      dosageForm: "Liquid (अरिष्ट)",
      defaultDose: "20 ml",
      defaultFrequency: "Twice daily",
      defaultTiming: "After meals",
      defaultDuration: "15 days",
      defaultAnupana: "Equal parts water (समभाग जल)",
    },
    {
      name: "Dashamularishta (दशमूलारिष्ट)",
      canonicalName: "DASHAMULARISHTA",
      category: "Asava And Arista",
      dosageForm: "Liquid (अरिष्ट)",
      defaultDose: "20 ml",
      defaultFrequency: "Twice daily",
      defaultTiming: "After meals",
      defaultDuration: "21 days",
      defaultAnupana: "Equal parts warm water (समभाग उष्ण जल)",
    },
    {
      name: "Chyawanprash (च्यवनप्राश अवलेह)",
      canonicalName: "CHYAVANAPRASA",
      category: "Avaleha And Paka",
      dosageForm: "Herbal Jam (अवलेह)",
      defaultDose: "10 grams (1 tbsp)",
      defaultFrequency: "Once or twice daily",
      defaultTiming: "Morning with milk",
      defaultDuration: "30 days",
      defaultAnupana: "Warm milk (उष्ण गोदुग्ध)",
    },
    {
      name: "Avipattikar Churna (अविपत्तिकर चूर्ण)",
      canonicalName: "AVIPATTIKAR CHURNA",
      category: "Churna",
      dosageForm: "Powder (चूर्ण)",
      defaultDose: "3-5 grams",
      defaultFrequency: "Twice daily",
      defaultTiming: "Before meals",
      defaultDuration: "10 days",
      defaultAnupana: "Warm water or coconut water (उष्ण जल)",
    },
    {
      name: "Hingwashtak Churna (हिंग्वाष्टक चूर्ण)",
      canonicalName: "HINGWASHTAK CHURNA",
      category: "Churna",
      dosageForm: "Powder (चूर्ण)",
      defaultDose: "2-3 grams",
      defaultFrequency: "Twice daily",
      defaultTiming: "With first morsel of meal (प्रथम ग्रास)",
      defaultDuration: "7 days",
      defaultAnupana: "Warm ghee (उष्ण घृत)",
    },
    {
      name: "Brahmi Vati (ब्राह्मी वटी)",
      canonicalName: "BRAHMI VATI",
      category: "Vati And Gutika",
      dosageForm: "Tablet (वटी)",
      defaultDose: "1-2 tablets",
      defaultFrequency: "Twice daily",
      defaultTiming: "After meals",
      defaultDuration: "30 days",
      defaultAnupana: "Warm milk / Honey (उष्ण दुग्ध / मधु)",
    },
    {
      name: "Yograj Guggulu (योगराज गुग्गुलु)",
      canonicalName: "YOGRAJ GUGGULU",
      category: "Vati And Gutika",
      dosageForm: "Tablet (गुग्गुलु)",
      defaultDose: "2 tablets",
      defaultFrequency: "Twice daily",
      defaultTiming: "After meals",
      defaultDuration: "15 days",
      defaultAnupana: "Warm water or Dashamula Kwatha (उष्ण जल)",
    },
    {
      name: "Kaishore Guggulu (कैशोर गुग्गुलु)",
      canonicalName: "KAISHORE GUGGULU",
      category: "Vati And Gutika",
      dosageForm: "Tablet (गुग्गुलु)",
      defaultDose: "2 tablets",
      defaultFrequency: "Twice daily",
      defaultTiming: "After meals",
      defaultDuration: "15 days",
      defaultAnupana: "Warm water (उष्ण जल)",
    },
    {
      name: "Khadiradi Vati (खदिरादि वटी)",
      canonicalName: "KHADIRADI VATI",
      category: "Vati And Gutika",
      dosageForm: "Chewable Tablet (वटी)",
      defaultDose: "1 tablet",
      defaultFrequency: "4-6 times daily (चूसने के लिए)",
      defaultTiming: "Slowly chew / dissolve in mouth",
      defaultDuration: "5 days",
      defaultAnupana: "Dissolve slowly in oral cavity (मुख में धारण)",
    },
    {
      name: "Chandraprabha Vati (चन्द्रप्रभावटी)",
      canonicalName: "CHANDRAPRABHA VATI",
      category: "Vati And Gutika",
      dosageForm: "Tablet (वटी)",
      defaultDose: "2 tablets",
      defaultFrequency: "Twice daily",
      defaultTiming: "After meals",
      defaultDuration: "15 days",
      defaultAnupana: "Warm water or milk (उष्ण जल / दुग्ध)",
    },
  ];

  for (const p of prominent) {
    const key = p.name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      list.unshift({
        id: `prominent-${p.canonicalName.toLowerCase().replace(/\s+/g, "-")}`,
        name: p.name,
        canonicalName: p.canonicalName,
        category: p.category,
        dosageForm: p.dosageForm,
        defaultDose: p.defaultDose,
        defaultFrequency: p.defaultFrequency,
        defaultTiming: p.defaultTiming,
        defaultDuration: p.defaultDuration,
        defaultAnupana: (p as any).defaultAnupana || (p as any).anupana || "Warm water (उष्ण जल)",
        source: "Classical Ayurvedic Formulary",
      });
    }
  }

  cachedMedicines = list;
  return list;
}

export function searchAyurvedicMedicines(query: string, limit = 15): AyurvedicMedicine[] {
  const all = loadAyurvedicMedicines();
  const q = (query || "").trim().toLowerCase();
  if (!q) return all.slice(0, limit);

  const exactMatches: AyurvedicMedicine[] = [];
  const prefixMatches: AyurvedicMedicine[] = [];
  const substringMatches: AyurvedicMedicine[] = [];

  for (const m of all) {
    const nameLow = m.name.toLowerCase();
    const canonLow = m.canonicalName.toLowerCase();
    const catLow = m.category.toLowerCase();

    if (nameLow === q || canonLow === q) {
      exactMatches.push(m);
    } else if (nameLow.startsWith(q) || canonLow.startsWith(q)) {
      prefixMatches.push(m);
    } else if (nameLow.includes(q) || canonLow.includes(q) || catLow.includes(q)) {
      substringMatches.push(m);
    }
  }

  return [...exactMatches, ...prefixMatches, ...substringMatches].slice(0, limit);
}
