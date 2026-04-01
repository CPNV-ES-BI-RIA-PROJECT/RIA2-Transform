// src/application/IcsService.ts
import axios from "axios";
import { parseIcs } from "../domain/icsParser.js";

export class IcsService {

    /**
     * Convert ICS from a URL, upload JSON to bucket, and return presigned URL
     */
    public async convertFromUrl(url: string): Promise<{ events: any[] }> {
        if (!url || url.trim().length === 0) {
            throw new Error("Missing url");
        }

        // 1. Fetch ICS
        const res = await axios.get<string>(url);
        const icsString = res.data;

        // 2. Convert to JSON
        const events = parseIcs(icsString);

        return { events };
    }
}