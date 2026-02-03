export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // Attempt to fetch the asset from the static site build
        let response = await env.ASSETS.fetch(request);

        // If not found (404) and is a GET request, serve index.html (SPA Fallback)
        if (response.status === 404 && request.method === "GET") {
            // Optional: Add logic to ignore /api/ requests if necessary
            // For now, assume any 404 GET is a client-side route
            const indexUrl = new URL("/index.html", request.url);
            response = await env.ASSETS.fetch(indexUrl);
        }

        return response;
    }
};
