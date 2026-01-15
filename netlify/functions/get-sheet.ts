
/**
 * Normalizes any Google Sheet link into a reliable CSV export link.
 */
const normalizeSheetUrl = (url: string): string => {
    if (!url) return '';
    const match = url.match(/[-\w]{25,}/);
    const gidMatch = url.match(/gid=([0-9]+)/);

    if (match && match[0]) {
        let baseUrl = `https://docs.google.com/spreadsheets/d/${match[0]}/export?format=csv`;
        if (gidMatch && gidMatch[1]) {
            baseUrl += `&gid=${gidMatch[1]}`;
        }
        return baseUrl;
    }
    return url;
};

export default async () => {
    const rawUrl = process.env.GOOGLE_SHEET_CSV_URL;

    if (!rawUrl) {
        console.error("DEBUG: GOOGLE_SHEET_CSV_URL is missing or empty.");
        return new Response("Configuration Error: Missing GOOGLE_SHEET_CSV_URL", { status: 500 });
    }

    const normalizedUrl = normalizeSheetUrl(rawUrl);
    console.log(`DEBUG: Fetching from ${normalizedUrl.substring(0, 50)}...`);

    try {
        const separator = normalizedUrl.includes('?') ? '&' : '?';
        const fetchUrl = `${normalizedUrl}${separator}t=${Date.now()}`;

        const response = await fetch(fetchUrl);

        if (!response.ok) {
            const errorBody = await response.text().catch(() => "No error body");
            console.error(`DEBUG: Fetch failed with status ${response.status}: ${errorBody.substring(0, 100)}`);
            return new Response(`Error fetching sheet: ${response.statusText}`, { status: response.status });
        }

        const data = await response.text();
        console.log(`DEBUG: Successfully fetched ${data.length} bytes of CSV data.`);

        return new Response(data, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Cache-Control": "no-store, max-age=0",
            },
        });
    } catch (error) {
        console.error("DEBUG: Internal error in function:", error);
        return new Response(`Internal Proxy Error: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
    }
};
