import ical from 'node-ical';
import fetch from 'node-fetch';

const SINGLE_EVENT_URL =
  process.env.SINGLE_EVENT_URL ??
  'https://bi1-nicolas.s3.eu-west-1.amazonaws.com/single-event.json';
const MULTIPLE_EVENTS_URL =
  process.env.MULTIPLE_EVENTS_URL ??
  'https://bi1-nicolas.s3.eu-west-1.amazonaws.com/multiple-events.json';

export class TransformError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export type TransformResult = {
  url: string;
  eventCount: number;
};

export async function fetchIcsFromUrl(url: string): Promise<string> {
  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new TransformError(400, 'FETCH_FAILED', 'Invalid URL or fetch failed');
  }

  if (!response.ok) {
    throw new TransformError(400, 'FETCH_FAILED', 'Failed to fetch file from URL');
  }

  return response.text();
}

export async function transformIcsContent(fileContent: string): Promise<TransformResult> {
  let data;
  try {
    data = await ical.async.parseICS(fileContent);
  } catch {
    throw new TransformError(422, 'INVALID_ICS', 'Invalid ICS format');
  }

  const events = Object.values(data).filter((entry) => entry.type === 'VEVENT');

  if (events.length === 0) {
    throw new TransformError(422, 'NO_EVENTS', 'No events found in ICS');
  }

  if (events.length === 1) {
    return {
      url: SINGLE_EVENT_URL,
      eventCount: 1,
    };
  }

  return {
    url: MULTIPLE_EVENTS_URL,
    eventCount: events.length,
  };
}
