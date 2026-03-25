// src/domain/types.ts

export class ConvertIcsRequest {
    /** Public URL of the ICS file to convert */
    url!: string;
}

export class IcsDateTime {
    value!: string;
    timezone!: string | null;
}

export class IcsEvent {
    uid!: string;
    dtstamp!: string;
    start!: IcsDateTime;
    end!: IcsDateTime;
    summary?: string;
    description?: string;
    categories!: string[];
    organizer?: string;
    attendees!: string[];
    location?: string;
}

export class ConvertIcsResponse {
    events!: IcsEvent[];
}