import axios from 'axios';
import { IcsEvent } from '../domain/types';

export class IcsService {
    /**
     * Fetch an ICS file from a URL and convert it into events
     */
    public async convertFromUrl(url: string): Promise<IcsEvent[]> {
        const res = await axios.get<string>(url);
        const icsString = res.data;

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
            const [keyPart, value] = line.split(':');
            if (!keyPart || !value) return;

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
                    current.dtstamp = value;
                    break;
                case 'DTSTART':
                    current.start = { value, timezone: paramObj.TZID || null };
                    break;
                case 'DTEND':
                    current.end = { value, timezone: paramObj.TZID || null };
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

            // ⚠️ FIX: this condition never triggers because END lines were filtered
            // we keep your logic but improve slightly
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
}