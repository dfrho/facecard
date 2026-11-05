import { describe, expect, it, vi } from 'vitest';
import {
  formatAsksSection,
  formatAudienceSection,
  formatClosingSection,
  formatFunFactSection,
  formatValueSection,
  generateIntroduction,
} from './script-formatter';

const CASUAL = 'friendly and casual';
const PROFESSIONAL = 'professional but approachable';
const FORMAL = 'formal and business-focused';

describe('generateIntroduction', () => {
  it('uses the first name for a casual tone', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(generateIntroduction('Ada', 'Ada Lovelace', 'Engineer', CASUAL)).toBe(
      "Hey there! I'm Ada, a Engineer."
    );
  });

  it('uses the full name for a professional tone', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(generateIntroduction('Ada', 'Ada Lovelace', 'Engineer', PROFESSIONAL)).toBe(
      "Hello, I'm Ada Lovelace, a Engineer."
    );
  });

  it('uses the full name for a formal tone', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    expect(generateIntroduction('Ada', 'Ada Lovelace', 'Engineer', FORMAL)).toBe(
      "Welcome. I'm Ada Lovelace, and I work as a Engineer."
    );
  });
});

describe('formatValueSection', () => {
  it('joins industry and main value, lowercasing the value', () => {
    expect(formatValueSection('Fintech', 'Building payment APIs', '', PROFESSIONAL)).toBe(
      '\n\nI specialize in the Fintech industry, where building payment APIs.'
    );
  });

  it('phrases the industry differently per tone', () => {
    expect(formatValueSection('Fintech', '', '', CASUAL)).toBe('\n\nI work in the Fintech industry.');
    expect(formatValueSection('Fintech', '', '', FORMAL)).toBe(
      '\n\nMy expertise is centered in the Fintech sector.'
    );
  });

  it('uses the main value alone when there is no industry', () => {
    expect(formatValueSection('', 'Building payment APIs', '', PROFESSIONAL)).toBe(
      '\n\nBuilding payment APIs'
    );
  });

  it('appends the secondary value with tone-specific wording', () => {
    expect(formatValueSection('', '', 'mentor', CASUAL)).toBe(' I also mentor!');
    expect(formatValueSection('', '', 'mentor', PROFESSIONAL)).toBe(' I also mentor.');
    expect(formatValueSection('', '', 'mentor', FORMAL)).toBe(' Additionally, I mentor.');
  });

  it('returns an empty string when nothing is provided', () => {
    expect(formatValueSection('', '', '', PROFESSIONAL)).toBe('');
  });
});

describe('formatAudienceSection', () => {
  it('phrases the audience per tone', () => {
    expect(formatAudienceSection('founders', CASUAL)).toBe('\n\nI love helping founders!');
    expect(formatAudienceSection('founders', PROFESSIONAL)).toBe(
      "\n\nI'm particularly passionate about helping founders."
    );
    expect(formatAudienceSection('founders', FORMAL)).toBe(
      '\n\nMy practice focuses primarily on assisting founders.'
    );
  });

  it('returns an empty string without an audience', () => {
    expect(formatAudienceSection('', CASUAL)).toBe('');
  });
});

describe('formatFunFactSection', () => {
  it('phrases the fun fact per tone', () => {
    expect(formatFunFactSection('I juggle', CASUAL)).toBe(
      "\n\nHere's a fun fact about me: I juggle"
    );
    expect(formatFunFactSection('I juggle', PROFESSIONAL)).toBe(
      '\n\nSomething you might not know about me: I juggle'
    );
    expect(formatFunFactSection('I juggle', FORMAL)).toBe(
      '\n\nAn interesting point of note: I juggle'
    );
  });

  it('returns an empty string without a fun fact', () => {
    expect(formatFunFactSection('', FORMAL)).toBe('');
  });
});

describe('formatAsksSection', () => {
  it('includes the primary ask on its own', () => {
    expect(formatAsksSection('intros', '', PROFESSIONAL)).toBe("\n\nCurrently, I'm seeking intros.");
  });

  it('adds the secondary ask after the primary one', () => {
    expect(formatAsksSection('intros', 'mentors', CASUAL)).toBe(
      "\n\nRight now, I'm looking for intros. I'm also interested in mentors!"
    );
    expect(formatAsksSection('intros', 'mentors', FORMAL)).toBe(
      '\n\nPresently, I am interested in opportunities involving intros.' +
        ' Furthermore, I would welcome opportunities related to mentors.'
    );
  });

  it('drops a secondary ask when there is no primary ask', () => {
    expect(formatAsksSection('', 'mentors', PROFESSIONAL)).toBe('');
  });
});

describe('formatClosingSection', () => {
  it('includes the contact method per tone', () => {
    expect(formatClosingSection('email', CASUAL)).toBe(
      '\n\nWanna connect? You can reach me via email. Looking forward to connecting with you!'
    );
    expect(formatClosingSection('email', FORMAL)).toContain(
      'For professional inquiries, you may contact me via email.'
    );
  });

  it('uses a generic invitation without a contact method', () => {
    expect(formatClosingSection('', PROFESSIONAL)).toBe(
      "\n\nPlease feel free to reach out if you'd like to connect." +
        ' I look forward to the opportunity to connect and explore potential collaborations.'
    );
  });

  it('defaults to the professional tone when none is given', () => {
    expect(formatClosingSection('', '')).toBe(formatClosingSection('', PROFESSIONAL));
  });
});
