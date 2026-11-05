import { defaultFormData } from '@/lib/form-utils';
import { ProfileFormData } from '@/types/profile';

/**
 * Build a profile for tests. Starts from a deep copy of the app's defaults so tests
 * never share (and mutate) the default arrays.
 */
export function makeProfile(overrides: Partial<ProfileFormData> = {}): ProfileFormData {
  return {
    ...structuredClone(defaultFormData),
    firstName: 'Ada',
    lastName: 'Lovelace',
    jobTitle: 'Engineer',
    company: 'Analytical Engines',
    email: 'ada@example.com',
    ...overrides,
  };
}

/** A profile with every optional section filled in. */
export function makeFullProfile(overrides: Partial<ProfileFormData> = {}): ProfileFormData {
  return makeProfile({
    toneValue: 5,
    industry: 'Fintech',
    mainValue: 'Building payment APIs',
    secondaryValue: 'mentor junior engineers',
    superpower: 'problems',
    funFact: 'I once debugged a mainframe by ear',
    interests: ['Payments', 'Security', 'Open source', 'Chess'],
    audience: 'career',
    primaryAsk: 'intros to seed-stage founders',
    secondaryAsk: 'speaking slots',
    contactMethod: 'LinkedIn',
    ...overrides,
  });
}
