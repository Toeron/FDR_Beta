
export default async () => {
    const url = process.env.GOOGLE_SHEET_CSV_URL;

    if (!url) {
        return new Response("Missing GOOGLE_SHEET_CSV_URL environment variable", { status: 500 });
    }

    try {
        // Add cache busting to the proxied request
        const separator = url.includes('?') ? '&' : '?';
        const fetchUrl = `${url}${separator}t=${Date.now()}`;

        const response = await fetch(fetchUrl);

        if (!response.ok) {
            return new Response(`Error fetching sheet: ${response.statusText}`, { status: response.status });
        }

        const data = await response.text();

        return new Response(data, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Cache-Control": "no-store, max-age=0",
            },
        });
    } catch (error) {
        return new Response(`Internal Server Error: ${error instanceof Error ? error.message : String(error)}`, { status: 500 });
    }
};
