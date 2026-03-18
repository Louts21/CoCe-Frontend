import { useEffect, useState } from "react"
import type { Car, CarExtra, Configuration, Order } from "../interfaces";
import axios from "axios";
import { NavLink } from "react-router";

const instance = axios.create({
    timeout: 3000,
    headers: { 'Content-Type': 'application/json' }
});

// TODO: Make some parameters dynamic via environment variables (e.g. backend URL)
export function Configuration() {

    const [configuration, setConfiguration] = useState<Configuration | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [car, setCar] = useState<Car>({
        id: crypto.randomUUID(),
        carModelDTO: { id: "", name: "", price: 0 },
        carEngineDTO: { id: "", name: "", price: 0 },
        carPaintDTO: { id: "", name: "", price: 0 },
        carWheelDTO: { id: "", name: "", price: 0 },
        carExtraDTOs: [],
        totalPrice: 0
    });
    const [order, setOrder] = useState<Order>({
        id: crypto.randomUUID(),
        car: car,
        url: ""
    });

    useEffect(() => {
        instance.get('http://localhost:8080/api/configuration').then(response => {
            const configData = response.data as Configuration;
            setConfiguration(configData);
            setCar(prev => ({
                ...prev,
                carModelDTO: configData.carModelDTO[0] ?? prev.carModelDTO,
                carEngineDTO: configData.carEngineDTO[0] ?? prev.carEngineDTO,
                carPaintDTO: configData.carPaintDTO[0] ?? prev.carPaintDTO,
                carWheelDTO: configData.carWheelDTO[0] ?? prev.carWheelDTO,
                totalPrice: (configData.carModelDTO[0]?.price ?? 0) + (configData.carEngineDTO[0]?.price ?? 0) + (configData.carPaintDTO[0]?.price ?? 0) + (configData.carWheelDTO[0]?.price ?? 0)
            }));
            setIsLoading(false);
        }).catch(() => {
            setIsError(true);
            setIsLoading(false);
        });
    }, []);

    function isCarExtraAlreadySelected(extra: CarExtra) {
        return car.carExtraDTOs.some(e => e.id === extra.id);
    }
    function isCarExtraUnderFive(configuration: Car) {
        return configuration.carExtraDTOs.length < 5;
    }
    function postOrder() {
        instance({
            method: "post",
            url: "http://localhost:8081/api/order",
            data: order
        }).then(response => {
            setOrder(response.data as Order);
            alert("Order placed successfully!");
        }).catch(() => {
            alert("Failed to place order!");
        });
    }

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Powerconfigurator</h1>
                <p>Konfigurationsdaten werden geladen...</p>
            </div>
        );
    }

    if (isError || !configuration) {
        return (
            <div className="flex flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Powerconfigurator</h1>
                <p className="text-red-500">API nicht erreichbar. Bitte versuche es später erneut.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Powerconfigurator</h1>
            <form>
                <label>
                    Modell:
                    <select value={car.carModelDTO.name} onChange={e => setCar({
                        ...car,
                        carModelDTO: configuration.carModelDTO.find(model => model.name === e.target.value) || configuration.carModelDTO[0],
                        totalPrice: (configuration.carModelDTO.find(model => model.name === e.target.value) || configuration.carModelDTO[0]).price + car.carEngineDTO.price + car.carPaintDTO.price + car.carWheelDTO.price + car.carExtraDTOs.reduce((sum, e) => sum + e.price, 0)
                    })}>
                        {configuration.carModelDTO.map(model => (
                            <option key={model.id} value={model.name}>{model.name} - {model.price}€</option>
                        ))}
                    </select>
                </label>
                <hr />
                <label>
                    Motorleistung:
                    <select value={car.carEngineDTO.name} onChange={e => setCar({
                        ...car,
                        carEngineDTO: configuration.carEngineDTO.find(engine => engine.name === e.target.value) || configuration.carEngineDTO[0],
                        totalPrice: car.carModelDTO.price + (configuration.carEngineDTO.find(engine => engine.name === e.target.value) || configuration.carEngineDTO[0]).price + car.carPaintDTO.price + car.carWheelDTO.price + car.carExtraDTOs.reduce((sum, e) => sum + e.price, 0)
                    })}>
                        {configuration.carEngineDTO.map(engine => (
                            <option key={engine.id} value={engine.name}>{engine.name} - {engine.price}€</option>
                        ))}
                    </select>
                </label>
                <hr />
                <label>
                    Lackierung:
                    <select value={car.carPaintDTO.name} onChange={e => setCar({
                        ...car,
                        carPaintDTO: configuration.carPaintDTO.find(paint => paint.name === e.target.value) || configuration.carPaintDTO[0],
                        totalPrice: car.carModelDTO.price + car.carEngineDTO.price + (configuration.carPaintDTO.find(paint => paint.name === e.target.value) || configuration.carPaintDTO[0]).price + car.carWheelDTO.price + car.carExtraDTOs.reduce((sum, e) => sum + e.price, 0)
                    })}>
                        {configuration.carPaintDTO.map(paint => (
                            <option key={paint.id} value={paint.name}>{paint.name} - {paint.price}€</option>
                        ))}
                    </select>
                </label>
                <hr />
                <label>
                    Felgen:
                    <select value={car.carWheelDTO.name} onChange={e => setCar({
                        ...car,
                        carWheelDTO: configuration.carWheelDTO.find(wheel => wheel.name === e.target.value) || configuration.carWheelDTO[0],
                        totalPrice: car.carModelDTO.price + car.carEngineDTO.price + car.carPaintDTO.price + (configuration.carWheelDTO.find(wheel => wheel.name === e.target.value) || configuration.carWheelDTO[0]).price + car.carExtraDTOs.reduce((sum, e) => sum + e.price, 0)
                    })}>
                        {configuration.carWheelDTO.map(wheel => (
                            <option key={wheel.id} value={wheel.name}>{wheel.name} - {wheel.price}€</option>
                        ))}
                    </select>
                </label>
                <hr />
                <label>
                    Sonderaustattungen:
                    {configuration.carExtraDTO.map(extra => (
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
            <a />
            {order.url.length > 0 &&
                <div>
                    <NavLink to={order.url} className="text-blue-500 underline">Bestellung ansehen</NavLink>
                </div>
            }
        </div>
    );
}
