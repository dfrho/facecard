import { describe, expect, it } from 'vitest';
import {
  formatAudience,
  formatSkills,
  formatSuperpower,
  generateUniqueId,
  getIndustryStyle,
  getToneDescription,
} from './script-utils';

describe('getToneDescription', () => {
  it.each([
    [0, 'friendly and casual'],
    [3, 'friendly and casual'],
    [4, 'professional but approachable'],
    [7, 'professional but approachable'],
    [8, 'formal and business-focused'],
    [10, 'formal and business-focused'],
  ])('maps tone %i to "%s"', (value, expected) => {
    expect(getToneDescription(value)).toBe(expected);
  });
});

describe('getIndustryStyle', () => {
  const casual = 'friendly and casual';
  const professional = 'professional but approachable';

  it('uses the tech style for tech, software and AI industries', () => {
    expect(getIndustryStyle('Tech', casual)).toContain('innovative and forward-thinking');
    expect(getIndustryStyle('Enterprise Software', professional)).toContain('technical yet accessible');
    expect(getIndustryStyle('AI', professional)).toContain('technical yet accessible');
  });

  it('uses the finance style for finance, banking and investment', () => {
    expect(getIndustryStyle('Finance', casual)).toContain('trustworthy and knowledgeable');
    expect(getIndustryStyle('Investment Banking', professional)).toContain('authoritative and precise');
  });

  it('uses the health style for health and medical industries', () => {
    expect(getIndustryStyle('Healthcare', casual)).toContain('empathetic and reassuring');
    expect(getIndustryStyle('Medical Devices', professional)).toContain('caring undertone');
  });

  it('falls back to a tone-based default for other industries', () => {
    expect(getIndustryStyle('Real Estate', casual)).toBe(
      'authentic and conversational, highlighting personal strengths'
    );
    expect(getIndustryStyle('Real Estate', professional)).toBe(
      'professional and articulate, emphasizing expertise'
    );
    expect(getIndustryStyle('', professional)).toBe(
      'professional and articulate, emphasizing expertise'
    );
  });
});

describe('formatSuperpower', () => {
  it.each([
    ['connect', 'connecting people like a human LinkedIn'],
    ['ideas', 'turning ideas into businesses'],
    ['creative', 'making things look and sound amazing'],
    ['problems', 'solving impossible problems'],
    ['inspire', 'inspiring people to take action'],
    ['vibes', 'bringing the good vibes'],
  ])('maps "%s" to its description', (value, expected) => {
    expect(formatSuperpower(value, '')).toBe(expected);
  });

  it('uses the custom text for "other"', () => {
    expect(formatSuperpower('other', 'herding cats')).toBe('herding cats');
  });

  it('returns an empty string when there is nothing to show', () => {
    expect(formatSuperpower('', '')).toBe('');
    expect(formatSuperpower('other', '')).toBe('');
    expect(formatSuperpower('unknown', '')).toBe('');
  });
});

describe('formatAudience', () => {
  it.each([
    ['aspiring', "aspiring entrepreneurs who don't know where to start"],
    ['retention', 'businesses struggling with customer retention'],
    ['career', 'people looking for their next big career move'],
    ['likeminded', 'cool, like-minded professionals looking to connect'],
  ])('maps "%s" to its description', (value, expected) => {
    expect(formatAudience(value, '')).toBe(expected);
  });

  it('uses the custom text for "other"', () => {
    expect(formatAudience('other', 'indie game studios')).toBe('indie game studios');
  });

  it('returns an empty string when there is nothing to show', () => {
    expect(formatAudience('', '')).toBe('');
    expect(formatAudience('other', '')).toBe('');
    expect(formatAudience('unknown', '')).toBe('');
  });
});

describe('formatSkills', () => {
  it('lists at most the first three interests', () => {
    expect(formatSkills(['Payments', 'Security', 'Open source', 'Chess'])).toBe(
      'My key areas of expertise include Payments, Security, Open source.'
    );
  });

  it('returns an empty string for no interests', () => {
    expect(formatSkills([])).toBe('');
  });
});

describe('generateUniqueId', () => {
  it('returns non-empty lowercase alphanumeric ids', () => {
    expect(generateUniqueId()).toMatch(/^[a-z0-9]+$/);
  });

  it('does not repeat across many calls', () => {
    const ids = new Set(Array.from({ length: 500 }, () => generateUniqueId()));
    expect(ids.size).toBe(500);
  });
});
