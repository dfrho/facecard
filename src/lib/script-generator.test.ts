import { beforeEach, describe, expect, it, vi } from 'vitest';
import { makeFullProfile, makeProfile } from '@/test/profile-fixture';
import { createEnhancedPrompt, generateEnhancedScript } from './script-generator';

describe('generateEnhancedScript', () => {
  beforeEach(() => {
    // Pin the randomly chosen opener so the output is deterministic.
    vi.spyOn(Math, 'random').mockReturnValue(0);
  });

  it('builds every section in order for a full profile', () => {
    const script = generateEnhancedScript(makeFullProfile());

    const sections = [
      "Hello, I'm Ada Lovelace, a Engineer at Analytical Engines.",
      'I specialize in the Fintech industry, where building payment APIs.',
      'I also mentor junior engineers.',
      'My professional superpower is solving impossible problems.',
      'My key areas of expertise include Payments, Security, Open source.',
      "I'm particularly passionate about helping people looking for their next big career move.",
      'Something you might not know about me: I once debugged a mainframe by ear',
      "Currently, I'm seeking intros to seed-stage founders. Additionally, I'm looking for speaking slots.",
      'Please feel free to reach out via LinkedIn.',
    ];

    let lastIndex = -1;
    for (const section of sections) {
      const index = script.indexOf(section);
      expect(index, `missing or out of order: ${section}`).toBeGreaterThan(lastIndex);
      lastIndex = index;
    }
    expect(script).not.toContain('Chess');
  });

  it('keeps only the introduction and closing for a minimal profile', () => {
    const script = generateEnhancedScript(makeProfile({ company: '' }));

    expect(script).toBe(
      "Hello, I'm Ada Lovelace, a Engineer." +
        "\n\nPlease feel free to reach out if you'd like to connect." +
        ' I look forward to the opportunity to connect and explore potential collaborations.'
    );
  });

  it('follows the tone slider', () => {
    expect(generateEnhancedScript(makeProfile({ toneValue: 1 }))).toMatch(/^Hey there! I'm Ada,/);
    expect(generateEnhancedScript(makeProfile({ toneValue: 9 }))).toMatch(
      /^Greetings, my name is Ada Lovelace\./
    );
  });
});

describe('createEnhancedPrompt', () => {
  it('includes tone, style, personality and profile details', () => {
    const prompt = createEnhancedPrompt(makeFullProfile());

    expect(prompt).toContain('TONE: professional but approachable');
    // "Fintech" contains "tech", so it gets the tech writing style.
    expect(prompt).toContain('WRITING STYLE: technical yet accessible');
    expect(prompt).toContain('Is an analytical problem-solver');
    expect(prompt).toContain('Has an interesting background: I once debugged a mainframe by ear');
    expect(prompt).toContain('- Name: Ada Lovelace');
    expect(prompt).toContain('- Interests: Payments, Security, Open source, Chess');
  });

  it('marks blank fields as not specified', () => {
    const prompt = createEnhancedPrompt(makeProfile({ company: '' }));

    expect(prompt).toContain('- Company: Not specified');
    expect(prompt).toContain('- Fun Fact: Not specified');
    expect(prompt).toContain('- Interests: Not specified');
    expect(prompt).toContain('PERSONALITY: Professional and authentic');
  });

  it('uses the custom superpower text for "other"', () => {
    const prompt = createEnhancedPrompt(
      makeProfile({ superpower: 'other', otherSuperpower: 'herding cats' })
    );

    expect(prompt).toContain('Describes their superpower as: herding cats');
    expect(prompt).toContain('- Professional Superpower: herding cats');
  });
});
