//
// Formats:
// moose
// taco~
// tomatoe[s]
// |goose|geese|
// go[es]

const RE_BRACKETS = /\[(\w+)(?:\|(\w+))?\]/;
const RE_ALTS = /\|(\w+)\|(\w+)\|/;

// VERBS

export function toSingularVerb(text: string): string {
    if (text.includes('~')) {
        return text.replace('~', 's');
    }

    let match = RE_BRACKETS.exec(text);
    if (match) {
        return text.replace(match[0], match[1]);
    }

    match = RE_ALTS.exec(text);
    if (match) {
        return match[1];
    }

    return text;
}

export function toPluralVerb(text: string): string {
    if (text.includes('~')) {
        return text.replace('~', '');
    }

    let match = RE_BRACKETS.exec(text);
    if (match) {
        return text.replace(match[0], match[2] || '');
    }

    match = RE_ALTS.exec(text);
    if (match) {
        return match[2];
    }
    return text;
}

// NOUNS

export function toSingularNoun(text: string): string {
    text = text.replace('& ', '');

    if (text.includes('~')) {
        return text.replace('~', '');
    }

    let match = RE_BRACKETS.exec(text);
    if (match) {
        return text.replace(match[0], match[2] || '');
    }

    match = RE_ALTS.exec(text);
    if (match) {
        return match[1];
    }

    return text;
}

export function toPluralNoun(text: string): string {
    text = text.replace('& ', '');

    if (text.includes('~')) {
        return text.replace('~', 's');
    }

    let match = RE_BRACKETS.exec(text);
    if (match) {
        return text.replace(match[0], match[1]);
    }

    match = RE_ALTS.exec(text);
    if (match) {
        return match[2];
    }
    return text;
}

export function toQuantity(text: string, count: number): string {
    if (count == 1) {
        text = toSingularNoun(text);
    } else {
        text = toPluralNoun(text);
    }

    const countText = count > 1 ? '' + count : 'a';

    if (text.includes('&')) {
        return text.replace('&', countText);
    }

    return countText + ' ' + text;
}
