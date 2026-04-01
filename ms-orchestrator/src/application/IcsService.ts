// src/application/IcsService.ts
export interface IcsEvent {
    uid: string;
    summary: string;
    start: { value: string; timezone: string | null };
    end: { value: string; timezone: string | null };
}

export class IcsService {
    private readonly baseUrl: string;

    constructor() {
        // Read base URL from environment variable
        const url = process.env.ICS_CONVERTER_URL;
        if (!url) {
            throw new Error("ICS_CONVERTER_URL environment variable is not set");
        }
        this.baseUrl = url;
    }

    /**
     * Calls the external ICS microservice to convert an ICS file to JSON events.
     * @param url Publicly accessible ICS file URL
     */
    async convertFromUrl(url: string): Promise<IcsEvent[]> {
        const response = await fetch(this.baseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`ICS conversion failed: ${response.status} ${text}`);
        }

        const events: IcsEvent[] = await response.json();
        return events;
    }
}