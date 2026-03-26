export async function fetchIcsFromUrl(url: string): Promise<string> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch ICS: ${response.status}`);
    }

    return await response.text();
}