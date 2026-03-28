import type { Question, Verb, Tense, Person, GoPrefix, QuizSettings } from '../../types/index';
import { verbBe } from '../../data/verbBe';
import { verbGoConjugations, GO_PREFIXES } from '../../data/verbGo';
import { randomItem, shuffle } from '../../utils/random';

const PERSONS: Person[] = ['1s', '2s', '3s', '1p', '2p', '3p'];

// და- (habitual movement) only exists in the present tense
const DA: GoPrefix = 'da';

function generateBeQuestion(tenses: Tense[]): Question {
  const tense = randomItem(tenses);
  const person = randomItem(PERSONS);
  return { verb: 'be', tense, person, answer: verbBe[tense][person] };
}

function generateGoQuestion(prefix: GoPrefix, tenses: Tense[]): Question {
  // da- only exists in present — caller must ensure 'present' is available when passing DA
  const tense: Tense = prefix === DA ? 'present' : randomItem(tenses);
  const person = randomItem(PERSONS);

  // Accepted answers: all prefixes that have forms for this tense
  // (da- has no past/future, so it is excluded when tense ≠ present)
  const validPrefixes = tense === 'present'
    ? GO_PREFIXES
    : GO_PREFIXES.filter(p => p !== DA);
  const validAnswers = validPrefixes.map(p => verbGoConjugations[p][tense][person]);

  return {
    verb: 'go',
    tense,
    person,
    prefix,
    answer: verbGoConjugations[prefix][tense][person],
    validAnswers,
  };
}

export function generateQuestions(settings: QuizSettings): Question[] {
  const { questionCount, verbs, tenses } = settings;

  // Exclude da- from go questions if present tense isn't selected
  const availablePrefixes = tenses.includes('present')
    ? GO_PREFIXES
    : GO_PREFIXES.filter(p => p !== DA);

  // Build a balanced, shuffled verb pool so verbs are evenly distributed
  const verbPool: Verb[] = [];
  for (let i = 0; i < questionCount; i++) {
    verbPool.push(verbs[i % verbs.length]);
  }
  shuffle(verbPool);

  // Pre-build a balanced, shuffled prefix pool for all 'go' questions
  const goCount = verbPool.filter(v => v === 'go').length;
  const prefixPool: GoPrefix[] = [];
  for (let i = 0; i < goCount; i++) {
    prefixPool.push(availablePrefixes[i % availablePrefixes.length]);
  }
  shuffle(prefixPool);

  let prefixIdx = 0;
  return verbPool.map(verb => {
    if (verb === 'be') return generateBeQuestion(tenses);
    return generateGoQuestion(prefixPool[prefixIdx++], tenses);
  });
}
