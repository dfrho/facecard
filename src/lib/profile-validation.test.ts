import { describe, expect, it } from 'vitest';
import { makeFullProfile, makeProfile } from '@/test/profile-fixture';
import { MAX_INTERESTS, validateScriptRequest } from './profile-validation';

function errorFor(input: unknown) {
  const result = validateScriptRequest(input);
  return result.ok ? undefined : result.error;
}

describe('validateScriptRequest', () => {
  it('accepts a complete profile', () => {
    const result = validateScriptRequest(makeFullProfile());

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.profile.firstName).toBe('Ada');
      expect(result.profile.interests).toEqual(['Payments', 'Security', 'Open source', 'Chess']);
      expect(result.profile.toneValue).toBe(5);
    }
  });

  it('fills fields the request leaves out with defaults', () => {
    const result = validateScriptRequest({ firstName: 'Ada', lastName: 'Lovelace', jobTitle: 'Engineer' });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.profile.company).toBe('');
      expect(result.profile.interests).toEqual([]);
      expect(result.profile.toneValue).toBe(5);
    }
  });

  it('copies only the fields used for the script', () => {
    const result = validateScriptRequest({
      ...makeProfile(),
      generatedScript: 'x'.repeat(50_000),
      somethingElse: { nested: true },
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.profile.generatedScript).toBeUndefined();
      expect(result.profile).not.toHaveProperty('somethingElse');
    }
  });

  it('rejects anything that is not a profile object', () => {
    expect(errorFor(undefined)).toBe('Expected a profile.');
    expect(errorFor(null)).toBe('Expected a profile.');
    expect(errorFor('Ada')).toBe('Expected a profile.');
    expect(errorFor([makeProfile()])).toBe('Expected a profile.');
  });

  it('requires a name and job title', () => {
    expect(errorFor(makeProfile({ jobTitle: '   ' }))).toBe(
      'First name, last name and job title are required.'
    );
  });

  it('enforces text types and length limits', () => {
    expect(errorFor(makeProfile({ firstName: 'x'.repeat(201) }))).toBe(
      '"firstName" is too long (maximum 200 characters).'
    );
    expect(errorFor(makeProfile({ funFact: 'x'.repeat(1000) }))).toBeUndefined();
    expect(errorFor(makeProfile({ funFact: 'x'.repeat(1001) }))).toBe(
      '"funFact" is too long (maximum 1000 characters).'
    );
    expect(errorFor({ ...makeProfile(), company: 42 })).toBe('"company" must be text.');
  });

  it('checks the tone value', () => {
    expect(errorFor(makeProfile({ toneValue: 11 }))).toBe('"toneValue" must be a number from 0 to 10.');
    expect(errorFor({ ...makeProfile(), toneValue: '5' })).toBe(
      '"toneValue" must be a number from 0 to 10.'
    );
    expect(errorFor({ ...makeProfile(), toneValue: Number.NaN })).toBeDefined();
  });

  it('checks interests', () => {
    expect(errorFor({ ...makeProfile(), interests: 'Chess' })).toBe('"interests" must be a list of text.');
    expect(errorFor({ ...makeProfile(), interests: ['Chess', 3] })).toBe('"interests" must be a list of text.');
    expect(errorFor(makeProfile({ interests: Array(MAX_INTERESTS + 1).fill('Chess') }))).toBe(
      `"interests" can have at most ${MAX_INTERESTS} items.`
    );
    expect(errorFor(makeProfile({ interests: ['x'.repeat(101)] }))).toBe(
      'Each interest must be at most 100 characters.'
    );
  });
});
