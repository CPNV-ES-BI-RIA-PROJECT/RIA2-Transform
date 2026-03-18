declare module 'ms-drive-api/types/ical-js.js' {
    export class Component {
        constructor(jcalData: any);
        getAllSubcomponents(name: string): any[];
    }
    export function parse(jcal: string): any;
}