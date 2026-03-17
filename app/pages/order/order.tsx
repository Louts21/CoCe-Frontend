import { useLoaderData } from "react-router";
import type { Order } from "../interfaces";
import axios from "axios";

export default function Order() {
    const data = useLoaderData() as Order | null;

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Es liegt unter dieser ID keine Bestellung vor!</h1>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Deine Bestellung</h1>
            <p>Order ID: {data.id}</p>
            <hr />
            <p>Model: {data.configurationDTO.carModelDTO.name}, {data.configurationDTO.carModelDTO.price}€</p>
            <p>Engine: {data.configurationDTO.carEngineDTO.name}, {data.configurationDTO.carEngineDTO.price}€</p>
            <p>Paint: {data.configurationDTO.carPaintDTO.name}, {data.configurationDTO.carPaintDTO.price}€</p>
            <p>Wheel: {data.configurationDTO.carWheelDTO.name}, {data.configurationDTO.carWheelDTO.price}€</p>
            <p>Extras: {data.configurationDTO.carExtraDTOs.map(extra => `${extra.name} (${extra.price}€)`).join(", ")}</p>
            <hr />
            <p>Total Price: {data.configurationDTO.totalPrice}€</p>
        </div>
    );
}

export async function loader({ params }: { params: Record<string, string> }) {
    const id = params?.id;
    if (!id) return null;

    const instance = axios.create({
        baseURL: 'http://localhost:8080/api',
        timeout: 3000,
        headers: { 'Content-Type': 'application/json' }
    });

    try {
        const response = await instance.get(`/order/${id}`);
        return response.data as Order;
    } catch (err) {
        return null;
    }
}