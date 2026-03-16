import { useState } from "react"
import type { CarEngine, CarExtra, CarModel, CarPaint, CarWheel, Configuration } from "./interfaces";


// TODO: Fetch car configuration options from backend
// TODO: URL system needs to be implemented, so that the configuration can be shared
// TODO: Enable routing to a summary page, where the configuration can be reviewed and ordered
export function Configuration() {
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
    }];

    const [configuration, setConfiguration] = useState<Configuration>({
        id: "g175d83d-09d9-405b-950a-49cc0a6e5ac2",
        carModel: carModels[0], carEngine: carEngines[0], carPaint: carPaints[0], carWheel: carWheels[0], carExtra: carExtras[0],
        totalPrice: carModels[0].price + carEngines[0].price + carPaints[0].price + carWheels[0].price + carExtras[0].price
    });

    function handleClick() {
        alert('Not yet!');
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Powerconfigurator</h1>
            <form>
                <label>
                    Model:
                    <select value={configuration.carModel.name} onChange={e => setConfiguration({
                        ...configuration,
                        carModel: carModels.find(model => model.name === e.target.value) || carModels[0],
                        totalPrice: (carModels.find(model => model.name === e.target.value) || carModels[0]).price + configuration.carEngine.price + configuration.carPaint.price + configuration.carWheel.price + configuration.carExtra.price
                    })}>
                        {carModels.map(model => (
                            <option key={model.id} value={model.name}>{model.name} - {model.price}€</option>
                        ))}
                    </select>
                </label>
                <hr/>
                <label>
                    Engine:
                    <select value={configuration.carEngine.name} onChange={e => setConfiguration({
                        ...configuration,
                        carEngine: carEngines.find(engine => engine.name === e.target.value) || carEngines[0],
                        totalPrice: configuration.carModel.price + (carEngines.find(engine => engine.name === e.target.value) || carEngines[0]).price + configuration.carPaint.price + configuration.carWheel.price + configuration.carExtra.price
                    })}>
                        {carEngines.map(engine => (
                            <option key={engine.id} value={engine.name}>{engine.name} - {engine.price}€</option>
                        ))}
                    </select>
                </label>
                <hr/>
                <label>
                    Paint:
                    <select value={configuration.carPaint.name} onChange={e => setConfiguration({
                        ...configuration,
                        carPaint: carPaints.find(paint => paint.name === e.target.value) || carPaints[0],
                        totalPrice: configuration.carModel.price + configuration.carEngine.price + (carPaints.find(paint => paint.name === e.target.value) || carPaints[0]).price + configuration.carWheel.price + configuration.carExtra.price
                    })}>
                        {carPaints.map(paint => (
                            <option key={paint.id} value={paint.name}>{paint.name} - {paint.price}€</option>
                        ))}
                    </select>
                </label>
                <hr/>
                <label>
                    Wheel:
                    <select value={configuration.carWheel.name} onChange={e => setConfiguration({
                        ...configuration,
                        carWheel: carWheels.find(wheel => wheel.name === e.target.value) || carWheels[0],
                        totalPrice: configuration.carModel.price + configuration.carEngine.price + configuration.carPaint.price + (carWheels.find(wheel => wheel.name === e.target.value) || carWheels[0]).price + configuration.carExtra.price
                    })}>
                        {carWheels.map(wheel => (
                            <option key={wheel.id} value={wheel.name}>{wheel.name} - {wheel.price}€</option>
                        ))}
                    </select>
                </label>
                <hr/>
                <label>
                    Extra:
                    <select value={configuration.carExtra.name} onChange={e => setConfiguration({
                        ...configuration,
                        carExtra: carExtras.find(extra => extra.name === e.target.value) || carExtras[0],
                        totalPrice: configuration.carModel.price + configuration.carEngine.price + configuration.carPaint.price + configuration.carWheel.price + (carExtras.find(extra => extra.name === e.target.value) || carExtras[0]).price
                    })}>
                        {carExtras.map(extra => (
                            <option key={extra.id} value={extra.name}>{extra.name} - {extra.price}€</option>
                        ))}
                    </select>
                </label>
                <hr/>
                <p>Der Gesamtpreis beträgt: {configuration.totalPrice}€</p>
                <button type="submit" onClick={handleClick}>Bestellen</button>
            </form>
        </div>
    );
}
