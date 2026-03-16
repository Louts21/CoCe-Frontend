export interface CarModel {
    id: number,
    name: string,
    price: number
}
export interface CarEngine {
    id: number,
    name: string,
    price: number
}
export interface CarPaint {
    id: number,
    name: string,
    price: number
}
export interface CarWheel {
    id: number,
    name: string,
    price: number
}
export interface CarExtra {
    id: number,
    name: string,
    price: number
}

export interface Configuration {
    carModel: CarModel,
    carEngine: CarEngine,
    carPaint: CarPaint,
    carWheel: CarWheel,
    carExtra: CarExtra,
    totalPrice: number
}

export interface Order {
    configuration: Configuration,
    totalPrice: number
}