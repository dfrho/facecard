import { defaultFormData } from '@/lib/form-utils';
import { ProfileFormData } from '@/types/profile';

/**
 * Limits for the profile fields the script generator puts into its prompt. They bound
 * how much text (and so how many paid tokens) a single request can send to Claude.
 */
const SHORT_TEXT = 200;
const LONG_TEXT = 1000;

const STRING_FIELD_LIMITS: Partial<Record<keyof ProfileFormData, number>> = {
  firstName: SHORT_TEXT,
  lastName: SHORT_TEXT,
  jobTitle: SHORT_TEXT,
  company: SHORT_TEXT,
  industry: SHORT_TEXT,
  superpower: SHORT_TEXT,
  audience: SHORT_TEXT,
  contactMethod: SHORT_TEXT,
  otherSuperpower: LONG_TEXT,
  otherAudience: LONG_TEXT,
  funFact: LONG_TEXT,
  mainValue: LONG_TEXT,
  secondaryValue: LONG_TEXT,
  primaryAsk: LONG_TEXT,
  secondaryAsk: LONG_TEXT,
  skills: LONG_TEXT,
  achievements: LONG_TEXT,
  seeking: LONG_TEXT,
  idealConnection: LONG_TEXT,
};

export const MAX_INTERESTS = 20;
export const MAX_INTEREST_LENGTH = 100;
const MIN_TONE = 0;
const MAX_TONE = 10;

export type ScriptRequestValidation =
  | { ok: true; profile: ProfileFormData }
  | { ok: false; error: string };

function invalid(error: string): ScriptRequestValidation {
  return { ok: false, error };
}

/**
 * Check a script-generation request body and build the profile used for the prompt.
 * Only the fields the generator uses are copied over; anything else in the body is ignored.
 */
export function validateScriptRequest(input: unknown): ScriptRequestValidation {
  if (typeof input !== 'object' || input === null || Array.isArray(input)) {
    return invalid('Expected a profile.');
  }
  const data = input as Record<string, unknown>;
  const profile: ProfileFormData = structuredClone(defaultFormData);

  for (const [field, maxLength] of Object.entries(STRING_FIELD_LIMITS)) {
    const value = data[field];
    if (value === undefined || value === null) continue;
    if (typeof value !== 'string') {
      return invalid(`"${field}" must be text.`);
    }
    if (value.length > (maxLength as number)) {
      return invalid(`"${field}" is too long (maximum ${maxLength} characters).`);
    }
    (profile as unknown as Record<string, unknown>)[field] = value;
  }

  if (data.toneValue !== undefined && data.toneValue !== null) {
    const tone = data.toneValue;
    if (typeof tone !== 'number' || !Number.isFinite(tone) || tone < MIN_TONE || tone > MAX_TONE) {
      return invalid(`"toneValue" must be a number from ${MIN_TONE} to ${MAX_TONE}.`);
    }
    profile.toneValue = tone;
  }

  if (data.interests !== undefined && data.interests !== null) {
    const interests = data.interests;
    if (!Array.isArray(interests) || interests.some(item => typeof item !== 'string')) {
      return invalid('"interests" must be a list of text.');
    }
    if (interests.length > MAX_INTERESTS) {
      return invalid(`"interests" can have at most ${MAX_INTERESTS} items.`);
    }
    if (interests.some(item => item.length > MAX_INTEREST_LENGTH)) {
      return invalid(`Each interest must be at most ${MAX_INTEREST_LENGTH} characters.`);
    }
    profile.interests = [...interests];
  }

  if (!profile.firstName.trim() || !profile.lastName.trim() || !profile.jobTitle.trim()) {
    return invalid('First name, last name and job title are required.');
  }

  return { ok: true, profile };
}
