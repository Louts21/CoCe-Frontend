import type { Route } from "./+types/api.order";

export async function action({ request }: Route.ActionArgs) {
    const baseUrl = process.env.ORDER_URL ?? "http://localhost:8081";
    try {
        const body = await request.text();
        const response = await fetch(`${baseUrl}/api/order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
        });
        return new Response(response.body, {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Order service POST request failed:", error);
        return new Response(JSON.stringify({ error: "Order service unavailable" }), {
            status: 503,
            headers: { "Content-Type": "application/json" },
        });
    }
}
