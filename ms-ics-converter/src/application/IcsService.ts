import axios from 'axios';
import { parseIcs } from '../domain/icsParser';
import { IcsEvent } from '../domain/types';

export class IcsService {
    public async convertFromUrl(url: string): Promise<IcsEvent[]> {
        if (!url || url.trim().length === 0) {
            throw new Error('Missing url');
        }

        const res = await axios.get<string>(url);
        const icsString = res.data;

        return parseIcs(icsString);
    }
}