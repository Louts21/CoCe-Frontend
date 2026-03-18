import type { UUID } from "crypto"

export interface CarModel {
    id: string,
    name: string,
    price: number
}
export interface CarEngine {
    id: string,
    name: string,
    price: number
}
export interface CarPaint {
    id: string,
    name: string,
    price: number
}
export interface CarWheel {
    id: string,
    name: string,
    price: number
}
export interface CarExtra {
    id: string,
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

export interface Configuration {
    carModelDTO: CarModel[],
    carEngineDTO: CarEngine[],
    carPaintDTO: CarPaint[],
    carWheelDTO: CarWheel[],
    carExtraDTO: CarExtra[]
}

export interface Order {
    id: UUID,
    car: Car,
    url: string
}