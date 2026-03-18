import { useState } from "react"
import type { Car, CarEngine, CarExtra, CarModel, CarPaint, CarWheel, Order } from "../interfaces";
import axios from "axios";
import { NavLink } from "react-router";


// TODO: Fetch car configuration options from backend
// TODO: URL system needs to be implemented, so that the configuration can be shared
// TODO: Enable routing to a summary page, where the configuration can be reviewed
export function Configuration() {
    const instance = axios.create({
        baseURL: 'http://localhost:8080/api',
        timeout: 1000,
        headers: { 'Content-Type': 'application/json' }
    });

    const carModels: CarModel[] = [{
        id: "a175d83d-09d9-405b-950a-49cc0a6e5ac2",
        name: "CS1",
        price: 23
    }];
    const carEngines: CarEngine[] = [{
        id: "b175d83d-09d9-405b-950a-49cc0a6e5ac2",
        name: "Lieblich",
        price: 25
    }];
    const carPaints: CarPaint[] = [{
        id: "c175d83d-09d9-405b-950a-49cc0a6e5ac2",
        name: "Green",
        price: 256
    }];
    const carWheels: CarWheel[] = [{
        id: "d175d83d-09d9-405b-950a-49cc0a6e5ac2",
        name: "Round",
        price: 2
    }, {
        id: "e175d83d-09d9-405b-950a-49cc0a6e5ac2",
        name: "Square",
        price: 3
    }];
    const carExtras: CarExtra[] = [{
        id: "f175d83d-09d9-405b-950a-49cc0a6e5ac2",
        name: "Heat",
        price: 256
    }, {
        id: "g175d83d-09d9-405b-950a-49cc0a6e5ac2",
        name: "Air Conditioning",
        price: 256
    }, {
        id: "h175d83d-09d9-405b-950a-49cc0a6e5ac2",
        name: "Sunroof",
        price: 256
    }, {
        id: "i175d83d-09d9-405b-950a-49cc0a6e5ac2",
        name: "Leather Seats",
        price: 256
    }, {
        id: "j175d83d-09d9-405b-950a-49cc0a6e5ac2",
        name: "Navigation System",
        price: 256
    }, {
        id: "k175d83d-09d9-405b-950a-49cc0a6e5ac2",
        name: "Premium Sound System",
        price: 256
    }];

    const [car, setCar] = useState<Car>({
        id: crypto.randomUUID(),
        carModelDTO: carModels[0], carEngineDTO: carEngines[0], carPaintDTO: carPaints[0], carWheelDTO: carWheels[0], carExtraDTOs: [],
        totalPrice: carModels[0].price + carEngines[0].price + carPaints[0].price + carWheels[0].price
    });
    let [order, setOrder] = useState<Order>({
        id: crypto.randomUUID(),
        car: car,
        url: ""
    });

    function isCarExtraAlreadySelected(extra: CarExtra) {
        return car.carExtraDTOs.some(e => e.id === extra.id);
    }
    function isCarExtraUnderFive(configuration: Car) {
        return configuration.carExtraDTOs.length < 5;
    }
    function postOrder() {        
        instance({
            method: "post",
            url: "/order",
            data: order
        }).then(response => {
            setOrder(response.data as Order);
            alert("Order placed successfully! Your order ID is: " + order.id);
        }).catch(error => {
            alert("Failed to place order: " + error.message);
        });
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Powerconfigurator</h1>
            <form>
                <label>
                    Model:
                    <select value={car.carModelDTO.name} onChange={e => setCar({
                        ...car,
                        carModelDTO: carModels.find(model => model.name === e.target.value) || carModels[0],
                        totalPrice: (carModels.find(model => model.name === e.target.value) || carModels[0]).price + car.carEngineDTO.price + car.carPaintDTO.price + car.carWheelDTO.price + car.carExtraDTOs.reduce((sum, e) => sum + e.price, 0)
                    })}>
                        {carModels.map(model => (
                            <option key={model.id} value={model.name}>{model.name} - {model.price}€</option>
                        ))}
                    </select>
                </label>
                <hr />
                <label>
                    Engine:
                    <select value={car.carEngineDTO.name} onChange={e => setCar({
                        ...car,
                        carEngineDTO: carEngines.find(engine => engine.name === e.target.value) || carEngines[0],
                        totalPrice: car.carModelDTO.price + (carEngines.find(engine => engine.name === e.target.value) || carEngines[0]).price + car.carPaintDTO.price + car.carWheelDTO.price + car.carExtraDTOs.reduce((sum, e) => sum + e.price, 0)
                    })}>
                        {carEngines.map(engine => (
                            <option key={engine.id} value={engine.name}>{engine.name} - {engine.price}€</option>
                        ))}
                    </select>
                </label>
                <hr />
                <label>
                    Paint:
                    <select value={car.carPaintDTO.name} onChange={e => setCar({
                        ...car,
                        carPaintDTO: carPaints.find(paint => paint.name === e.target.value) || carPaints[0],
                        totalPrice: car.carModelDTO.price + car.carEngineDTO.price + (carPaints.find(paint => paint.name === e.target.value) || carPaints[0]).price + car.carWheelDTO.price + car.carExtraDTOs.reduce((sum, e) => sum + e.price, 0)
                    })}>
                        {carPaints.map(paint => (
                            <option key={paint.id} value={paint.name}>{paint.name} - {paint.price}€</option>
                        ))}
                    </select>
                </label>
                <hr />
                <label>
                    Wheel:
                    <select value={car.carWheelDTO.name} onChange={e => setCar({
                        ...car,
                        carWheelDTO: carWheels.find(wheel => wheel.name === e.target.value) || carWheels[0],
                        totalPrice: car.carModelDTO.price + car.carEngineDTO.price + car.carPaintDTO.price + (carWheels.find(wheel => wheel.name === e.target.value) || carWheels[0]).price + car.carExtraDTOs.reduce((sum, e) => sum + e.price, 0)
                    })}>
                        {carWheels.map(wheel => (
                            <option key={wheel.id} value={wheel.name}>{wheel.name} - {wheel.price}€</option>
                        ))}
                    </select>
                </label>
                <hr />
                <label>
                    Extra:
                    {carExtras.map(extra => (
                        <div key={extra.id}>
                            <input
                                type="checkbox"
                                checked={isCarExtraAlreadySelected(extra)}
                                onChange={e => {
                                    if (!isCarExtraUnderFive(car) && e.target.checked) {
                                        alert('You can only select up to 5 extras!');
                                        return;
                                    }
                                    else {
                                        const newExtras = e.target.checked
                                            ? [...car.carExtraDTOs, extra]
                                            : car.carExtraDTOs.filter(e => e.id !== extra.id);
                                        setCar({
                                            ...car,
                                            carExtraDTOs: newExtras,
                                            totalPrice: car.carModelDTO.price + car.carEngineDTO.price + car.carPaintDTO.price + car.carWheelDTO.price + newExtras.reduce((sum, e) => sum + e.price, 0)
                                        });
                                    }
                                }}
                            />
                            {extra.name} - {extra.price}€
                        </div>
                    ))}
                </label>
                <hr />
            </form>
            <p>Der Gesamtpreis beträgt: {car.totalPrice}€</p>
            <button type="submit" onClick={postOrder}>Bestellen</button>
            <a/>
            {order.url.length > 0 &&
                <div>
                    <NavLink to={order.url} className="text-blue-500 underline">View Order</NavLink>
                </div>
            }
        </div>
    );
}
