import type { Question, Verb, Tense, Person, QuizSettings } from '../../types/index';
import { verbBe } from '../../data/verbBe';
import { verbGoConjugations, GO_PREFIXES } from '../../data/verbGo';
import { randomItem } from '../../utils/random';

const TENSES: Tense[] = ['present', 'past', 'future'];
const PERSONS: Person[] = ['1s', '2s', '3s', '1p', '2p', '3p'];

function generateBeQuestion(): Question {
  const tense = randomItem(TENSES);
  const person = randomItem(PERSONS);
  return { verb: 'be', tense, person, answer: verbBe[tense][person] };
}

function generateGoQuestion(): Question {
  const prefix = randomItem(GO_PREFIXES);
  const tense = randomItem(TENSES);
  const person = randomItem(PERSONS);
  return { verb: 'go', tense, person, prefix, answer: verbGoConjugations[prefix][tense][person] };
}

export function generateQuestions(settings: QuizSettings): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < settings.questionCount; i++) {
    const verb: Verb = randomItem(settings.verbs);
    questions.push(verb === 'be' ? generateBeQuestion() : generateGoQuestion());
  }
  return questions;
}
