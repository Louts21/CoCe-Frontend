import type { Route } from "./+types/api.order.$id";

export async function loader({ params }: Route.LoaderArgs) {
    const baseUrl = process.env.ORDER_URL ?? "http://localhost:8081";
    try {
        const response = await fetch(`${baseUrl}/api/order/${params.id}`);
        return new Response(response.body, {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Order service GET request failed:", error);
        return new Response(JSON.stringify({ error: "Order service unavailable" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
        });
    }
}
