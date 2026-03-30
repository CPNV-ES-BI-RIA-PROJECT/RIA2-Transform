/**
 * Format a date string into "YYYY-MM-DD HH:mm:ss"
 * @param dateString - input date string (ISO or ICS)
 * @returns formatted date string
 */
export function formatDate(icsDate: string): string {
    // Remove optional Z
    const clean = icsDate.replace(/Z$/, '');

    let year = 0, month = 0, day = 0, hours = 0, minutes = 0, seconds = 0;

    if (/^\d{8}T\d{6}$/.test(clean)) {
        // Format: YYYYMMDDTHHMMSS
        year = parseInt(clean.slice(0, 4), 10);
        month = parseInt(clean.slice(4, 6), 10);
        day = parseInt(clean.slice(6, 8), 10);
        hours = parseInt(clean.slice(9, 11), 10);
        minutes = parseInt(clean.slice(11, 13), 10);
        seconds = parseInt(clean.slice(13, 15), 10);
    } else if (/^\d{8}$/.test(clean)) {
        // All-day event: YYYYMMDD
        year = parseInt(clean.slice(0, 4), 10);
        month = parseInt(clean.slice(4, 6), 10);
        day = parseInt(clean.slice(6, 8), 10);
    } else {
        // fallback to Date.parse
        const d = new Date(clean);
        if (isNaN(d.getTime())) throw new RangeError(`Invalid ICS date: ${icsDate}`);
        return `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')} ${d.getHours().toString().padStart(2,'0')}:${d.getMinutes().toString().padStart(2,'0')}:${d.getSeconds().toString().padStart(2,'0')}`;
    }

    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${year}-${pad(month)}-${pad(day)} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}