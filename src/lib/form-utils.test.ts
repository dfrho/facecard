// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeProfile } from '@/test/profile-fixture';
import {
  defaultFormData,
  getLastEditedTimestamp,
  isStepCompleted,
  loadCurrentStep,
  loadFormData,
  markStepAsCompleted,
  mergeFormData,
  saveCurrentStep,
  saveFormData,
  saveFormDraft,
} from './form-utils';

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe('saveFormData / loadFormData', () => {
  it('returns null when nothing has been saved', () => {
    expect(loadFormData()).toBeNull();
  });

  it('round-trips saved data', () => {
    const profile = makeProfile({ jobTitle: 'Designer' });
    saveFormData(profile);

    expect(loadFormData()).toEqual(profile);
    expect(JSON.parse(localStorage.getItem('profileFormData') ?? '{}').jobTitle).toBe('Designer');
  });

  it('fills fields missing from older saved data with defaults', () => {
    sessionStorage.setItem('profileFormData', JSON.stringify({ firstName: 'Ada' }));

    const loaded = loadFormData();
    expect(loaded?.firstName).toBe('Ada');
    expect(loaded?.toneValue).toBe(defaultFormData.toneValue);
    expect(loaded?.interests).toEqual([]);
  });

  it('prefers session data, then local data, then a draft', () => {
    localStorage.setItem('profileFormDraft', JSON.stringify({ firstName: 'Draft' }));
    expect(loadFormData()?.firstName).toBe('Draft');

    localStorage.setItem('profileFormData', JSON.stringify({ firstName: 'Local' }));
    expect(loadFormData()?.firstName).toBe('Local');

    sessionStorage.setItem('profileFormData', JSON.stringify({ firstName: 'Session' }));
    expect(loadFormData()?.firstName).toBe('Session');
  });

  it('returns null and logs when stored data is corrupted', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    sessionStorage.setItem('profileFormData', '{not json');

    expect(loadFormData()).toBeNull();
    expect(errorSpy).toHaveBeenCalled();
  });

  it('records when the form was last edited', () => {
    expect(getLastEditedTimestamp()).toBeNull();

    saveFormData(makeProfile());

    const edited = getLastEditedTimestamp();
    expect(edited).toBeInstanceOf(Date);
    expect(Math.abs(Date.now() - (edited as Date).getTime())).toBeLessThan(5000);
  });
});

describe('saveFormDraft', () => {
  it('is loaded when no other form data exists', () => {
    saveFormDraft(makeProfile({ firstName: 'Drafty' }));
    expect(loadFormData()?.firstName).toBe('Drafty');
  });
});

describe('step tracking', () => {
  it('marks a step completed when saving with a step', () => {
    saveFormData(makeProfile(), 'basic');

    const loaded = loadFormData();
    expect(isStepCompleted(loaded, 'basic')).toBe(true);
    expect(isStepCompleted(loaded, 'interests')).toBe(false);
  });

  it('does not record the same step twice', () => {
    const profile = makeProfile();
    markStepAsCompleted(profile, 'basic');
    markStepAsCompleted(profile, 'basic');

    expect(profile.completedSteps).toEqual(['basic']);
  });

  it('treats missing data as no completed steps', () => {
    expect(isStepCompleted(null, 'basic')).toBe(false);
  });

  it('remembers the current step', () => {
    expect(loadCurrentStep()).toBeNull();
    saveCurrentStep('script');
    expect(loadCurrentStep()).toBe('script');
  });
});

describe('mergeFormData', () => {
  it('overrides fields with the new values', () => {
    const merged = mergeFormData(makeProfile(), { jobTitle: 'CTO' });
    expect(merged.jobTitle).toBe('CTO');
    expect(merged.firstName).toBe('Ada');
  });

  it('keeps existing arrays when the update leaves them out', () => {
    const existing = makeProfile({ interests: ['Chess'], languages: ['French'] });

    const merged = mergeFormData(existing, { skills: 'TypeScript' });

    expect(merged.interests).toEqual(['Chess']);
    expect(merged.languages).toEqual(['French']);
  });

  it('replaces arrays the update provides, even with an empty array', () => {
    const existing = makeProfile({ interests: ['Chess'] });

    expect(mergeFormData(existing, { interests: ['Go'] }).interests).toEqual(['Go']);
    expect(mergeFormData(existing, { interests: [] }).interests).toEqual([]);
  });
});
