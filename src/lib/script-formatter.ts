// No imports needed

/**
 * Generate introduction based on tone
 */
export function generateIntroduction(firstName: string, fullName: string, jobInfo: string, tone: string): string {
  if (tone === 'friendly and casual') {
    const openers = [
      `Hey there! I'm ${firstName}, a ${jobInfo}.`,
      `Hi, I'm ${firstName}! I work as a ${jobInfo}.`,
      `What's up? I'm ${firstName}, and I'm a ${jobInfo}.`
    ];
    return openers[Math.floor(Math.random() * openers.length)];
  } else if (tone === 'professional but approachable') {
    const openers = [
      `Hello, I'm ${fullName}, a ${jobInfo}.`,
      `Hi there, my name is ${fullName}. I work as a ${jobInfo}.`,
      `Nice to meet you! I'm ${fullName}, a ${jobInfo}.`
    ];
    return openers[Math.floor(Math.random() * openers.length)];
  } else {
    const openers = [
      `Greetings, my name is ${fullName}. I'm a ${jobInfo}.`,
      `I'm ${fullName}, a professional ${jobInfo}.`,
      `Welcome. I'm ${fullName}, and I work as a ${jobInfo}.`
    ];
    return openers[Math.floor(Math.random() * openers.length)];
  }
}

/**
 * Format value section with industry and value propositions
 */
export function formatValueSection(industry: string, mainValue: string, secondaryValue: string, tone: string): string {
  let section = '';
  
  if (industry) {
    // Format differently based on tone
    if (tone === 'friendly and casual') {
      section += `\n\nI work in the ${industry} industry`;
    } else if (tone === 'professional but approachable') {
      section += `\n\nI specialize in the ${industry} industry`;
    } else {
      section += `\n\nMy expertise is centered in the ${industry} sector`;
    }
    
    // Add main value right after industry for coherence
    if (mainValue) {
      section += `, where ${mainValue.charAt(0).toLowerCase() + mainValue.slice(1)}`;
    }
    section += '.';
  } else if (mainValue) {
    // If no industry but has main value
    section += `\n\n${mainValue}`;
  }

  // Add secondary value if present
  if (secondaryValue) {
    if (tone === 'friendly and casual') {
      section += ` I also ${secondaryValue}!`;
    } else if (tone === 'professional but approachable') {
      section += ` I also ${secondaryValue}.`;
    } else {
      section += ` Additionally, I ${secondaryValue}.`;
    }
  }
  
  return section;
}

/**
 * Format audience section based on tone
 */
export function formatAudienceSection(audienceText: string, tone: string): string {
  if (!audienceText) return '';
  
  if (tone === 'friendly and casual') {
    return `\n\nI love helping ${audienceText}!`;
  } else if (tone === 'professional but approachable') {
    return `\n\nI'm particularly passionate about helping ${audienceText}.`;
  } else {
    return `\n\nMy practice focuses primarily on assisting ${audienceText}.`;
  }
}

/**
 * Format fun fact section based on tone
 */
export function formatFunFactSection(funFact: string, tone: string): string {
  if (!funFact) return '';
  
  if (tone === 'friendly and casual') {
    return `\n\nHere's a fun fact about me: ${funFact}`;
  } else if (tone === 'professional but approachable') {
    return `\n\nSomething you might not know about me: ${funFact}`;
  } else {
    return `\n\nAn interesting point of note: ${funFact}`;
  }
}

/**
 * Format asks section based on tone
 */
export function formatAsksSection(primaryAsk: string, secondaryAsk: string, tone: string): string {
  let section = '';
  
  if (primaryAsk) {
    if (tone === 'friendly and casual') {
      section += `\n\nRight now, I'm looking for ${primaryAsk}.`;
    } else if (tone === 'professional but approachable') {
      section += `\n\nCurrently, I'm seeking ${primaryAsk}.`;
    } else {
      section += `\n\nPresently, I am interested in opportunities involving ${primaryAsk}.`;
    }
    
    // Add secondary ask if available
    if (secondaryAsk) {
      if (tone === 'friendly and casual') {
        section += ` I'm also interested in ${secondaryAsk}!`;
      } else if (tone === 'professional but approachable') {
        section += ` Additionally, I'm looking for ${secondaryAsk}.`;
      } else {
        section += ` Furthermore, I would welcome opportunities related to ${secondaryAsk}.`;
      }
    }
  }
  
  return section;
}

/**
 * Format closing section based on tone
 */
export function formatClosingSection(contactMethod: string, _tone: string): string {
  let section = '';
  
  // Get the tone value for comparison
  const tone = _tone || 'professional but approachable';
  
  // Add contact method if available
  if (contactMethod) {
    if (tone === 'friendly and casual') {
      section += `\n\nWanna connect? You can reach me via ${contactMethod}.`;
    } else if (tone === 'professional but approachable') {
      section += `\n\nPlease feel free to reach out via ${contactMethod}.`;
    } else {
      section += `\n\nFor professional inquiries, you may contact me via ${contactMethod}.`;
    }
  } else {
    if (tone === 'friendly and casual') {
      section += `\n\nFeel free to reach out if you want to connect!`;
    } else if (tone === 'professional but approachable') {
      section += `\n\nPlease feel free to reach out if you'd like to connect.`;
    } else {
      section += `\n\nI welcome connections with professionals in the field.`;
    }
  }

  // Add closing based on tone
  if (tone === 'friendly and casual') {
    section += ` Looking forward to connecting with you!`;
  } else if (tone === 'professional but approachable') {
    section += ` I look forward to the opportunity to connect and explore potential collaborations.`;
  } else {
    section += ` Thank you for your consideration. I look forward to potential professional engagement.`;
  }
  
  return section;
}
