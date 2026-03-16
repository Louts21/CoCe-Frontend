import { useState } from "react"
import type { CarEngine, CarExtra, CarModel, CarPaint, CarWheel, Configuration, Order } from "../interfaces";
import axios from "axios";


// TODO: Fetch car configuration options from backend
// TODO: URL system needs to be implemented, so that the configuration can be shared
// TODO: Enable routing to a summary page, where the configuration can be reviewed and ordered
export function Configuration() {
    const instance = axios.create({
        baseURL: 'http://localhost:8080/api/v1',
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

    const [configuration, setConfiguration] = useState<Configuration>({
        id: "g175d83d-09d9-405b-950a-49cc0a6e5ac2",
        carModelDTO: carModels[0], carEngineDTO: carEngines[0], carPaintDTO: carPaints[0], carWheelDTO: carWheels[0], carExtraDTOs: [],
        totalPrice: carModels[0].price + carEngines[0].price + carPaints[0].price + carWheels[0].price
    });

    function isCarExtraAlreadySelected(extra: CarExtra) {
        return configuration.carExtraDTOs.some(e => e.id === extra.id);
    }
    function isCarExtraUnderFive(configuration: Configuration) {
        return configuration.carExtraDTOs.length < 5;
    }
    function postOrder() {
        const order: Order = {
            id: "h175d83d-09d9-405b-950a-49cc0a6e5ac2",
            configurationDTO: configuration
        };
        
        instance({
            method: "post",
            url: "/order",
            data: order
        }).then(response => {
            alert('Order placed successfully!');
            console.log(response.data);
        }).catch(error => {
            alert('Failed to place order!');
            console.error(error);
        });
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Powerconfigurator</h1>
            <form>
                <label>
                    Model:
                    <select value={configuration.carModelDTO.name} onChange={e => setConfiguration({
                        ...configuration,
                        carModelDTO: carModels.find(model => model.name === e.target.value) || carModels[0],
                        totalPrice: (carModels.find(model => model.name === e.target.value) || carModels[0]).price + configuration.carEngineDTO.price + configuration.carPaintDTO.price + configuration.carWheelDTO.price + configuration.carExtraDTOs.reduce((sum, e) => sum + e.price, 0)
                    })}>
                        {carModels.map(model => (
                            <option key={model.id} value={model.name}>{model.name} - {model.price}€</option>
                        ))}
                    </select>
                </label>
                <hr />
                <label>
                    Engine:
                    <select value={configuration.carEngineDTO.name} onChange={e => setConfiguration({
                        ...configuration,
                        carEngineDTO: carEngines.find(engine => engine.name === e.target.value) || carEngines[0],
                        totalPrice: configuration.carModelDTO.price + (carEngines.find(engine => engine.name === e.target.value) || carEngines[0]).price + configuration.carPaintDTO.price + configuration.carWheelDTO.price + configuration.carExtraDTOs.reduce((sum, e) => sum + e.price, 0)
                    })}>
                        {carEngines.map(engine => (
                            <option key={engine.id} value={engine.name}>{engine.name} - {engine.price}€</option>
                        ))}
                    </select>
                </label>
                <hr />
                <label>
                    Paint:
                    <select value={configuration.carPaintDTO.name} onChange={e => setConfiguration({
                        ...configuration,
                        carPaintDTO: carPaints.find(paint => paint.name === e.target.value) || carPaints[0],
                        totalPrice: configuration.carModelDTO.price + configuration.carEngineDTO.price + (carPaints.find(paint => paint.name === e.target.value) || carPaints[0]).price + configuration.carWheelDTO.price + configuration.carExtraDTOs.reduce((sum, e) => sum + e.price, 0)
                    })}>
                        {carPaints.map(paint => (
                            <option key={paint.id} value={paint.name}>{paint.name} - {paint.price}€</option>
                        ))}
                    </select>
                </label>
                <hr />
                <label>
                    Wheel:
                    <select value={configuration.carWheelDTO.name} onChange={e => setConfiguration({
                        ...configuration,
                        carWheelDTO: carWheels.find(wheel => wheel.name === e.target.value) || carWheels[0],
                        totalPrice: configuration.carModelDTO.price + configuration.carEngineDTO.price + configuration.carPaintDTO.price + (carWheels.find(wheel => wheel.name === e.target.value) || carWheels[0]).price + configuration.carExtraDTOs.reduce((sum, e) => sum + e.price, 0)
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
                                    if (!isCarExtraUnderFive(configuration) && e.target.checked) {
                                        alert('You can only select up to 5 extras!');
                                        return;
                                    }
                                    else {
                                        const newExtras = e.target.checked
                                            ? [...configuration.carExtraDTOs, extra]
                                            : configuration.carExtraDTOs.filter(e => e.id !== extra.id);
                                        setConfiguration({
                                            ...configuration,
                                            carExtraDTOs: newExtras,
                                            totalPrice: configuration.carModelDTO.price + configuration.carEngineDTO.price + configuration.carPaintDTO.price + configuration.carWheelDTO.price + newExtras.reduce((sum, e) => sum + e.price, 0)
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
            <p>Der Gesamtpreis beträgt: {configuration.totalPrice}€</p>
            <button type="submit" onClick={postOrder}>Bestellen</button>
        </div>
    );
}
