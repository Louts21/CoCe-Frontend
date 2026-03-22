import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("order/:id", "pages/order/order.tsx"),
    route("api/configuration", "routes/api.configuration.ts"),
    route("api/order/:id", "routes/api.order.$id.ts"),
    route("api/order", "routes/api.order.ts"),
] satisfies RouteConfig;
