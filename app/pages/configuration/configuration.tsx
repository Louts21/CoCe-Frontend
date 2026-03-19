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
    const [orderSuccess, setOrderSuccess] = useState(false);

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
            data: { ...order, car: car }
        }).then(response => {
            setOrder(response.data as Order);
            setOrderSuccess(true);
        }).catch(() => {
            alert("Bestellung fehlgeschlagen. Bitte versuche es erneut.");
        });
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                    <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Powerconfigurator</h1>
                    <p className="text-gray-400">Konfigurationsdaten werden geladen...</p>
                </div>
            </div>
        );
    }

    if (isError || !configuration) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center max-w-md">
                    <div className="text-red-500 text-5xl mb-4">⚠</div>
                    <h1 className="text-2xl font-bold text-white mb-2 tracking-widest uppercase">Powerconfigurator</h1>
                    <p className="text-red-400">API nicht erreichbar. Bitte versuche es später erneut.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Header */}
            <header className="bg-black border-b border-gray-800 py-4 px-8 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-black text-sm">P</span>
                    </div>
                    <span className="text-xl font-bold tracking-widest uppercase text-white">
                        Power<span className="text-red-500">configurator</span>
                    </span>
                </div>
                <p className="text-gray-400 text-sm hidden md:block">Gestalte dein Traumauto</p>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Configuration Options */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    {/* Model Selection */}
                    <section className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">01</span>
                            <h2 className="text-lg font-semibold uppercase tracking-wider">Modell</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {configuration.carModelDTO.map(model => (
                                <label key={model.id} className={`cursor-pointer rounded-xl border p-4 transition-all ${car.carModelDTO.id === model.id ? 'border-red-500 bg-red-950/30' : 'border-gray-700 hover:border-gray-500'}`}>
                                    <input type="radio" name="model" value={model.name} checked={car.carModelDTO.id === model.id} className="sr-only" onChange={() => setCar({
                                        ...car,
                                        carModelDTO: model,
                                        totalPrice: model.price + car.carEngineDTO.price + car.carPaintDTO.price + car.carWheelDTO.price + car.carExtraDTOs.reduce((sum, e) => sum + e.price, 0)
                                    })} />
                                    <div className="font-semibold text-white">{model.name}</div>
                                    <div className="text-red-400 font-bold mt-1">{model.price.toLocaleString('de-DE')} €</div>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Engine Selection */}
                    <section className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">02</span>
                            <h2 className="text-lg font-semibold uppercase tracking-wider">Motorleistung</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {configuration.carEngineDTO.map(engine => (
                                <label key={engine.id} className={`cursor-pointer rounded-xl border p-4 transition-all ${car.carEngineDTO.id === engine.id ? 'border-red-500 bg-red-950/30' : 'border-gray-700 hover:border-gray-500'}`}>
                                    <input type="radio" name="engine" value={engine.name} checked={car.carEngineDTO.id === engine.id} className="sr-only" onChange={() => setCar({
                                        ...car,
                                        carEngineDTO: engine,
                                        totalPrice: car.carModelDTO.price + engine.price + car.carPaintDTO.price + car.carWheelDTO.price + car.carExtraDTOs.reduce((sum, e) => sum + e.price, 0)
                                    })} />
                                    <div className="font-semibold text-white"><span aria-hidden="true">⚡</span> {engine.name}</div>
                                    <div className="text-red-400 font-bold mt-1">{engine.price.toLocaleString('de-DE')} €</div>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Paint Selection */}
                    <section className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">03</span>
                            <h2 className="text-lg font-semibold uppercase tracking-wider">Lackierung</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {configuration.carPaintDTO.map(paint => (
                                <label key={paint.id} className={`cursor-pointer rounded-xl border p-4 transition-all ${car.carPaintDTO.id === paint.id ? 'border-red-500 bg-red-950/30' : 'border-gray-700 hover:border-gray-500'}`}>
                                    <input type="radio" name="paint" value={paint.name} checked={car.carPaintDTO.id === paint.id} className="sr-only" onChange={() => setCar({
                                        ...car,
                                        carPaintDTO: paint,
                                        totalPrice: car.carModelDTO.price + car.carEngineDTO.price + paint.price + car.carWheelDTO.price + car.carExtraDTOs.reduce((sum, e) => sum + e.price, 0)
                                    })} />
                                    <div className="font-semibold text-white"><span aria-hidden="true">🎨</span> {paint.name}</div>
                                    <div className="text-red-400 font-bold mt-1">{paint.price.toLocaleString('de-DE')} €</div>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Wheels Selection */}
                    <section className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">04</span>
                            <h2 className="text-lg font-semibold uppercase tracking-wider">Felgen</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {configuration.carWheelDTO.map(wheel => (
                                <label key={wheel.id} className={`cursor-pointer rounded-xl border p-4 transition-all ${car.carWheelDTO.id === wheel.id ? 'border-red-500 bg-red-950/30' : 'border-gray-700 hover:border-gray-500'}`}>
                                    <input type="radio" name="wheel" value={wheel.name} checked={car.carWheelDTO.id === wheel.id} className="sr-only" onChange={() => setCar({
                                        ...car,
                                        carWheelDTO: wheel,
                                        totalPrice: car.carModelDTO.price + car.carEngineDTO.price + car.carPaintDTO.price + wheel.price + car.carExtraDTOs.reduce((sum, e) => sum + e.price, 0)
                                    })} />
                                    <div className="font-semibold text-white"><span aria-hidden="true">🔘</span> {wheel.name}</div>
                                    <div className="text-red-400 font-bold mt-1">{wheel.price.toLocaleString('de-DE')} €</div>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Extras Selection */}
                    <section className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">05</span>
                            <h2 className="text-lg font-semibold uppercase tracking-wider">Sonderausstattungen</h2>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">Wähle bis zu 5 Extras ({car.carExtraDTOs.length}/5 ausgewählt)</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {configuration.carExtraDTO.map(extra => {
                                const selected = isCarExtraAlreadySelected(extra);
                                const disabled = !selected && !isCarExtraUnderFive(car);
                                return (
                                    <label key={extra.id} className={`rounded-xl border p-4 transition-all flex items-start gap-3 ${selected ? 'border-red-500 bg-red-950/30 cursor-pointer' : disabled ? 'border-gray-800 opacity-40 cursor-not-allowed' : 'border-gray-700 hover:border-gray-500 cursor-pointer'}`}>
                                        <input
                                            type="checkbox"
                                            checked={selected}
                                            disabled={disabled}
                                            className="mt-1 accent-red-500"
                                            onChange={e => {
                                                if (!isCarExtraUnderFive(car) && e.target.checked) {
                                                    alert('Du kannst maximal 5 Extras auswählen!');
                                                    return;
                                                }
                                                const newExtras = e.target.checked
                                                    ? [...car.carExtraDTOs, extra]
                                                    : car.carExtraDTOs.filter(e => e.id !== extra.id);
                                                setCar({
                                                    ...car,
                                                    carExtraDTOs: newExtras,
                                                    totalPrice: car.carModelDTO.price + car.carEngineDTO.price + car.carPaintDTO.price + car.carWheelDTO.price + newExtras.reduce((sum, e) => sum + e.price, 0)
                                                });
                                            }}
                                        />
                                        <div>
                                            <div className="font-semibold text-white">{extra.name}</div>
                                            <div className="text-red-400 font-bold mt-1">+ {extra.price.toLocaleString('de-DE')} €</div>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </section>
                </div>

                {/* Right: Order Summary */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                            <h2 className="text-lg font-bold uppercase tracking-wider mb-6 text-white">Deine Konfiguration</h2>
                            <div className="flex flex-col gap-3 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                    <span className="text-gray-400">Modell</span>
                                    <div className="text-right">
                                        <div className="font-semibold">{car.carModelDTO.name || "–"}</div>
                                        {car.carModelDTO.price > 0 && <div className="text-gray-400">{car.carModelDTO.price.toLocaleString('de-DE')} €</div>}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                    <span className="text-gray-400">Motor</span>
                                    <div className="text-right">
                                        <div className="font-semibold">{car.carEngineDTO.name || "–"}</div>
                                        {car.carEngineDTO.price > 0 && <div className="text-gray-400">{car.carEngineDTO.price.toLocaleString('de-DE')} €</div>}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                    <span className="text-gray-400">Lackierung</span>
                                    <div className="text-right">
                                        <div className="font-semibold">{car.carPaintDTO.name || "–"}</div>
                                        {car.carPaintDTO.price > 0 && <div className="text-gray-400">{car.carPaintDTO.price.toLocaleString('de-DE')} €</div>}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-800">
                                    <span className="text-gray-400">Felgen</span>
                                    <div className="text-right">
                                        <div className="font-semibold">{car.carWheelDTO.name || "–"}</div>
                                        {car.carWheelDTO.price > 0 && <div className="text-gray-400">{car.carWheelDTO.price.toLocaleString('de-DE')} €</div>}
                                    </div>
                                </div>
                                {car.carExtraDTOs.length > 0 && (
                                    <div className="py-2 border-b border-gray-800">
                                        <div className="text-gray-400 mb-2">Extras</div>
                                        {car.carExtraDTOs.map(extra => (
                                            <div key={extra.id} className="flex justify-between text-sm mt-1">
                                                <span>{extra.name}</span>
                                                <span className="text-gray-400">+ {extra.price.toLocaleString('de-DE')} €</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-700">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-gray-300 font-semibold">Gesamtpreis</span>
                                    <span className="text-2xl font-black text-red-500">{car.totalPrice.toLocaleString('de-DE')} €</span>
                                </div>
                                {orderSuccess ? (
                                    <div className="text-center">
                                        <div className="text-green-400 font-bold mb-3">✓ Bestellung aufgegeben!</div>
                                        {order.url.length > 0 && (
                                            <NavLink to={order.url} className="text-red-400 underline hover:text-red-300 text-sm">
                                                Bestellung ansehen →
                                            </NavLink>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={postOrder}
                                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                                    >
                                        Jetzt bestellen
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
