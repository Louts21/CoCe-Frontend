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

export interface Configuration {
    id: UUID,
    carModel: CarModel,
    carEngine: CarEngine,
    carPaint: CarPaint,
    carWheel: CarWheel,
    carExtra: CarExtra,
    totalPrice: number
}

export interface Order {
    id: UUID,
    configuration: Configuration
}