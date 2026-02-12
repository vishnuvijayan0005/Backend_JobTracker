const STOP_WORDS = [
  "and","or","the","a","to","for","in","on","with",
  "is","are","of","at","this","that","will","as",
  "an","be","by","from","it"
];

const REQUIRED_SECTIONS = [
  "experience",
  "education",
  "skills",
  "projects"
];
const IRRELEVANT_WORDS = [
  "title","location","india","bangalore",
  "employment","type","looking","join",
  "candidate","should","have","strong",
  "responsible","growing","ideal",
  "company","team","role","position"
];
// Important technical skills get higher weight
const HIGH_PRIORITY_SKILLS = [
  "react","next","node","express","mongodb",
  "typescript","javascript","aws","docker","kubernetes"
];

// Basic synonym mapping
const SYNONYMS = {
  "nodejs": "node",
  "node.js": "node",
  "reactjs": "react",
  "nextjs": "next",
  "mongo": "mongodb",
  "js": "javascript",
  "ts": "typescript"
};

const normalize = (text) =>
  text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const applySynonyms = (text) => {
  let normalized = normalize(text);

  Object.keys(SYNONYMS).forEach(key => {
    const regex = new RegExp(`\\b${key}\\b`, "g");
    normalized = normalized.replace(regex, SYNONYMS[key]);
  });

  return normalized;
};

const extractKeywords = (jobText) => {
  const skillSectionMatch = jobText.match(
    /(required skills|key responsibilities|qualifications)([\s\S]*)/i
  );

  const relevantText = skillSectionMatch
    ? skillSectionMatch[2]
    : jobText;

  const words = applySynonyms(relevantText).split(" ");

  return [...new Set(
    words.filter(word =>
      word.length > 3 &&
      !STOP_WORDS.includes(word) &&
      !IRRELEVANT_WORDS.includes(word)
    )
  )];
};


const extractPhrases = (jobText) => {
  const words = applySynonyms(jobText).split(" ");
  const phrases = [];

  for (let i = 0; i < words.length - 2; i++) {
    const two = words[i] + " " + words[i + 1];
    const three = words[i] + " " + words[i + 1] + " " + words[i + 2];

    if (!STOP_WORDS.includes(words[i])) phrases.push(two);
    phrases.push(three);
  }

  return [...new Set(phrases.filter(p => p.length > 8))];
};

const keywordScore = (resumeText, jobText) => {
  const resume = applySynonyms(resumeText);
  const keywords = extractKeywords(jobText);

  let totalWeight = 0;
  let matchedWeight = 0;

  keywords.forEach(keyword => {
    const weight = HIGH_PRIORITY_SKILLS.includes(keyword) ? 2 : 1;
    totalWeight += weight;

    if (resume.includes(keyword)) {
      matchedWeight += weight;
    }
  });

  const score = (matchedWeight / totalWeight) * 100;

  const missingKeywords = keywords.filter(
    word => !resume.includes(word)
  );

  return {
    score: Math.round(score),
    missingKeywords
  };
};

const phraseScore = (resumeText, jobText) => {
  const resume = applySynonyms(resumeText);
  const phrases = extractPhrases(jobText);

  let matched = 0;

  phrases.forEach(phrase => {
    if (resume.includes(phrase)) matched++;
  });

  const score = phrases.length
    ? (matched / phrases.length) * 100
    : 0;

  return Math.round(score);
};

const structureScore = (resumeText) => {
  const resume = normalize(resumeText);
  let found = 0;

  REQUIRED_SECTIONS.forEach(section => {
    const regex = new RegExp(`\\b${section}\\b`, "i");
    if (regex.test(resume)) found++;
  });

  return (found / REQUIRED_SECTIONS.length) * 100;
};

const quantifyScore = (resumeText) => {
  const numbers = resumeText.match(/\d+%|\d+\s?(years?|months?)/gi);
  return numbers ? 100 : 40;
};

const experienceMatchScore = (resumeText, jobText) => {
  const jobYears = jobText.match(/(\d+)\+?\s?(years?)/i);
  const resumeYears = resumeText.match(/(\d+)\+?\s?(years?)/i);

  if (!jobYears || !resumeYears) return 70;

  const jobExp = parseInt(jobYears[1]);
  const resumeExp = parseInt(resumeYears[1]);

  if (resumeExp >= jobExp) return 100;
  if (resumeExp >= jobExp - 1) return 80;
  return 50;
};

const keywordStuffingPenalty = (resumeText) => {
  const words = normalize(resumeText).split(" ");
  const frequency = {};

  words.forEach(word => {
    if (!STOP_WORDS.includes(word)) {
      frequency[word] = (frequency[word] || 0) + 1;
    }
  });

  const excessive = Object.values(frequency).filter(f => f > 15);

  return excessive.length > 3 ? 15 : 0; // deduct 15 points if stuffing detected
};

export const calculateATSScore = (resumeText, jobText) => {
  const keyword = keywordScore(resumeText, jobText);
  const phrase = phraseScore(resumeText, jobText);
  const structure = structureScore(resumeText);
  const quantify = quantifyScore(resumeText);
  const experience = experienceMatchScore(resumeText, jobText);
  const stuffingPenalty = keywordStuffingPenalty(resumeText);

  const finalScore =
    (keyword.score * 0.35) +
    (phrase * 0.15) +
    (structure * 0.15) +
    (quantify * 0.15) +
    (experience * 0.20) -
    stuffingPenalty;

  let improvements = [];

  if (keyword.score < 65)
    improvements.push("Add more relevant technical keywords from the job description.");

  if (phrase < 50)
    improvements.push("Include exact skill phrases like 'REST API development' or 'MongoDB database design'.");

  if (structure < 75)
    improvements.push("Ensure resume has clear headings: Experience, Skills, Education, Projects.");

  if (quantify < 80)
    improvements.push("Add measurable achievements (e.g., Improved performance by 40%).");

  if (experience < 80)
    improvements.push("Highlight relevant years of experience clearly.");

  if (stuffingPenalty > 0)
    improvements.push("Avoid excessive repetition of the same keywords.");

  return {
    score: Math.max(0, Math.round(finalScore)),
    breakdown: {
      keywordMatch: keyword.score,
      phraseMatch: phrase,
      structureScore: Math.round(structure),
      quantifiedAchievements: quantify,
      experienceMatch: experience,
      stuffingPenalty
    },
    missingKeywords: keyword.missingKeywords.slice(0, 20),
    improvements
  };
};
