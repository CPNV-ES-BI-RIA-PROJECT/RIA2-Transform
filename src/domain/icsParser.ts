// src/application/icsParser.ts

import { formatDate } from '../share/utils/dateUtils';

export interface IcsEvent {
    uid: string;
    dtstamp: string;
    start: { value: string; timezone?: string } | null;
    end: { value: string; timezone?: string } | null;
    summary?: string;
    description?: string;
    categories: string[];
    organizer?: string;
    attendees: string[];
    location?: string;
    extra?: Record<string, any>;
}

/**
 * Parse an ICS string and return an array of events
 * @param icsString - raw ICS content
 */
export function parseIcs(icsString: string): IcsEvent[] {
    const events: IcsEvent[] = [];
    let current: Partial<IcsEvent> & Record<string, any> | null = null;

    // split lines and clean
    const lines = icsString
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(l => l);

    for (const line of lines) {
        if (line.startsWith('BEGIN:VEVENT')) {
            current = { attendees: [], categories: [] };
            continue;
        }

        if (line.startsWith('END:VEVENT')) {
            if (current) {
                // cast to full IcsEvent (required fields)
                events.push({
                    uid: current.uid || '',
                    dtstamp: current.dtstamp || '',
                    start: current.start || null,
                    end: current.end || null,
                    summary: current.summary,
                    description: current.description,
                    categories: current.categories || [],
                    organizer: current.organizer,
                    attendees: current.attendees || [],
                    location: current.location,
                    extra: current.extra,
                });
            }
            current = null;
            continue;
        }

        if (!current) continue;

        // key parsing
        const [keyPart, ...rest] = line.split(':');
        const value = rest.join(':'); // in case value contains ':'
        const [key, ...params] = keyPart.split(';');

        const paramObj: Record<string, string> = {};
        params.forEach(p => {
            const [k, v] = p.split('=');
            if (k && v) paramObj[k] = v;
        });

        switch (key.toUpperCase()) {
            case 'UID':
                current.uid = value;
                break;
            case 'DTSTAMP':
                current.dtstamp = formatDate(value);
                break;
            case 'DTSTART':
                current.start = { value : formatDate(value), timezone: paramObj.TZID };
                break;
            case 'DTEND':
                current.end = { value : formatDate(value), timezone: paramObj.TZID };
                break;
            case 'SUMMARY':
                current.summary = value;
                break;
            case 'DESCRIPTION':
                current.description = value;
                break;
            case 'CATEGORIES':
                current.categories = current.categories || [];
                current.categories.push(...value.split(','));
                break;
            case 'ORGANIZER':
                current.organizer = value.replace('MAILTO:', '');
                break;
            case 'ATTENDEE':
                current.attendees = current.attendees || [];
                current.attendees.push(value.replace('MAILTO:', ''));
                break;
            case 'LOCATION':
                current.location = value;
                break;
            default:
                current[key.toLowerCase()] = value; // Solution 1: dynamic field
        }
    }

    return events;
}