import type { UUID } from "crypto"

export interface CarModel {
    id: UUID,
    name: string,
    price: number
}
export interface CarEngine {
    id: UUID,
    name: string,
    price: number
}
export interface CarPaint {
    id: UUID,
    name: string,
    price: number
}
export interface CarWheel {
    id: UUID,
    name: string,
    price: number
}
export interface CarExtra {
    id: UUID,
    name: string,
    price: number
}

export interface Car {
    id: UUID,
    carModelDTO: CarModel,
    carEngineDTO: CarEngine,
    carPaintDTO: CarPaint,
    carWheelDTO: CarWheel,
    carExtraDTOs: CarExtra[],
    totalPrice: number
}

export interface Order {
    id: UUID,
    car: Car,
    url: string
}