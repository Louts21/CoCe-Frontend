import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router";
import type { Order } from "../interfaces";
import axios from "axios";

export default function Order() {
    const { id } = useParams() as { id?: string };
    const [data, setData] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setData(null);
            setLoading(false);
            return;
        }

        const instance = axios.create({
            baseURL: `${import.meta.env.VITE_ORDER_URL}/api`,
            timeout: 3000,
            headers: { 'Content-Type': 'application/json' }
        });

        let mounted = true;
        setLoading(true);
        instance.get(`/order/${id}`)
            .then(response => { if (mounted) setData(response.data as Order); })
            .catch(() => { if (mounted) setData(null); })
            .finally(() => { if (mounted) setLoading(false); });

        return () => { mounted = false; };
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center max-w-md">
                    <div className="text-yellow-500 text-5xl mb-4">⏳</div>
                    <h1 className="text-xl font-bold text-white">Lade Bestellung...</h1>
                    <p className="text-gray-400 mt-2">Bitte einen Moment warten.</p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-10 text-center max-w-md">
                    <div className="text-yellow-500 text-5xl mb-4">🔍</div>
                    <h1 className="text-xl font-bold text-white">Keine Bestellung gefunden</h1>
                    <p className="text-gray-400 mt-2">Es liegt unter dieser ID keine Bestellung vor.</p>
                    <NavLink to="/" className="mt-6 inline-block text-red-400 hover:text-red-300 underline text-sm">
                        ← Zurück zum Konfigurator
                    </NavLink>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950 text-white">
            {/* Header */}
            <header className="bg-black border-b border-gray-800 py-4 px-8 flex items-center gap-3 sticky top-0 z-10">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-black text-sm">P</span>
                </div>
                <span className="text-xl font-bold tracking-widest uppercase text-white">
                    Power<span className="text-red-500">configurator</span>
                </span>
            </header>

            <div className="max-w-2xl mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl font-bold">✓</span>
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-wider">Deine Bestellung</h1>
                    <p className="text-gray-400 mt-2 text-sm font-mono">{data.id}</p>
                </div>

                <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-800 border-b border-gray-700">
                        <h2 className="font-semibold uppercase tracking-wider text-sm text-gray-300">Fahrzeugkonfiguration</h2>
                    </div>
                    <div className="divide-y divide-gray-800">
                        <div className="flex justify-between items-center px-6 py-4">
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Modell</div>
                                <div className="font-semibold">{data.car.carModelDTO.name}</div>
                            </div>
                            <div className="text-red-400 font-bold">{data.car.carModelDTO.price.toLocaleString('de-DE')} €</div>
                        </div>
                        <div className="flex justify-between items-center px-6 py-4">
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Motorleistung</div>
                                <div className="font-semibold">{data.car.carEngineDTO.name}</div>
                            </div>
                            <div className="text-red-400 font-bold">{data.car.carEngineDTO.price.toLocaleString('de-DE')} €</div>
                        </div>
                        <div className="flex justify-between items-center px-6 py-4">
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Lackierung</div>
                                <div className="font-semibold">{data.car.carPaintDTO.name}</div>
                            </div>
                            <div className="text-red-400 font-bold">{data.car.carPaintDTO.price.toLocaleString('de-DE')} €</div>
                        </div>
                        <div className="flex justify-between items-center px-6 py-4">
                            <div>
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Felgen</div>
                                <div className="font-semibold">{data.car.carWheelDTO.name}</div>
                            </div>
                            <div className="text-red-400 font-bold">{data.car.carWheelDTO.price.toLocaleString('de-DE')} €</div>
                        </div>
                        {data.car.carExtraDTOs.length > 0 && (
                            <div className="px-6 py-4">
                                <div className="text-xs text-gray-500 uppercase tracking-wider mb-3">Sonderausstattungen</div>
                                <div className="flex flex-col gap-2">
                                    {data.car.carExtraDTOs.map(extra => (
                                        <div key={extra.id} className="flex justify-between items-center">
                                            <span className="text-gray-300">{extra.name}</span>
                                            <span className="text-red-400 font-semibold">+ {extra.price.toLocaleString('de-DE')} €</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex justify-between items-center px-6 py-5 bg-gray-800">
                            <span className="font-bold uppercase tracking-wider">Gesamtpreis</span>
                            <span className="text-2xl font-black text-red-500">{data.car.totalPrice.toLocaleString('de-DE')} €</span>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <NavLink to="/" className="text-red-400 hover:text-red-300 text-sm underline">
                        ← Neues Fahrzeug konfigurieren
                    </NavLink>
                </div>
            </div>
        </div>
    );
}
