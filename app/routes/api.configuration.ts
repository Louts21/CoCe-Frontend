export async function loader() {
    const baseUrl = process.env.CONFIGURATION_URL ?? "http://localhost:8080";
    try {
        const response = await fetch(`${baseUrl}/api/configuration`);
        return new Response(response.body, {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Configuration service request failed:", error);
        return new Response(JSON.stringify({ error: "Configuration service unavailable" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
        });
    }
}
