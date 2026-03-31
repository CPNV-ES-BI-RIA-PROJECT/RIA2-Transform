import { IcsEvent } from './types.js';
import { formatDate } from "../share/utils/dateUtils.js";

export { IcsEvent };

export function parseIcs(icsString: string): IcsEvent[] {
    const lines = icsString
        .split('\n')
        .map(l => l.trim())
        .filter(l => l && !l.startsWith('BEGIN'));

    const events: IcsEvent[] = [];
    let current: Partial<IcsEvent> & {
        categories?: string[];
        attendees?: string[];
    } = {};

    lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) return;

        const keyPart = line.slice(0, colonIndex);
        const value = line.slice(colonIndex + 1);

        const [key, ...params] = keyPart.split(';');
        const paramObj: Record<string, string> = {};
        params.forEach(p => {
            const [k, v] = p.split('=');
            if (k && v) paramObj[k] = v;
        });

        switch (key) {
            case 'UID':
                current.uid = value;
                break;
            case 'DTSTAMP':
                current.dtstamp = formatDate(value);
                break;
            case 'DTSTART':
                current.start = {
                    value: formatDate(value),  // ✅ use the line value directly
                    timezone: paramObj.TZID || null
                };
                break;
            case 'DTEND':
                current.end = {
                    value: formatDate(value),  // ✅ use the line value directly
                    timezone: paramObj.TZID || null
                };
                break;
            case 'SUMMARY':
                current.summary = value;
                break;
            case 'DESCRIPTION':
                current.description = value;
                break;
            case 'CATEGORIES':
                current.categories = value.split(',');
                break;
            case 'ORGANIZER':
                current.organizer = value.replace('MAILTO:', '');
                break;
            case 'ATTENDEE':
                current.attendees = (current.attendees || []).concat(
                    value.replace('MAILTO:', '')
                );
                break;
            case 'LOCATION':
                current.location = value;
                break;
            default:
                break;
        }

        // ✅ capture event when END:VEVENT
        if (line === 'END:VEVENT') {
            if (current.uid) {
                events.push({
                    uid: current.uid!,
                    dtstamp: current.dtstamp!,
                    start: current.start!,
                    end: current.end!,
                    summary: current.summary,
                    description: current.description,
                    categories: current.categories || [],
                    organizer: current.organizer,
                    attendees: current.attendees || [],
                    location: current.location
                });
            }
            current = {};
        }
    });

    return events;
}