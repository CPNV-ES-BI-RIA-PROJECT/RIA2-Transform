import { readFileSync } from 'fs';
import { join } from 'path';
import { parseIcs, IcsEvent } from '../src/domain/icsParser.js';

describe('ICS Parser Service', () => {
    const loadIcs = (filename: string) =>
        readFileSync(join(__dirname, './data', filename), 'utf-8');

    const loadJson = (filename: string): IcsEvent[] =>
        JSON.parse(readFileSync(join(__dirname, './data', filename), 'utf-8'));

    describe('Single event ICS', () => {
        let sampleIcs: string;
        let expectedJson: IcsEvent[];

        beforeAll(() => {
            sampleIcs = loadIcs('singleEvent.ics');
            expectedJson = loadJson('expectedSingleEvent.json');
        });

        it('should parse a single event correctly', () => {
            const events: IcsEvent[] = parseIcs(sampleIcs);
            expect(events).toHaveLength(expectedJson.length);
            expect(events).toEqual(expectedJson);
        });
    });

    describe('Multi-event ICS', () => {
        let sampleIcs: string;
        let expectedJson: IcsEvent[];

        beforeAll(() => {
            sampleIcs = loadIcs('multiEvents.ics');
            expectedJson = loadJson('expectedMultiEvents.json');
        });

        it('should parse multiple events correctly', () => {
            const events: IcsEvent[] = parseIcs(sampleIcs);
            expect(events).toHaveLength(expectedJson.length);
            expect(events).toEqual(expectedJson);
        });
    });
});