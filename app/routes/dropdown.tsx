import { useState } from "react";
import type { Route } from "./+types/dropdown";
import { Link } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dropdown Page" },
    { name: "description", content: "A page with a dropdown select element" },
  ];
}

const options = [
  { value: "", label: "Bitte auswählen..." },
  { value: "option1", label: "Option 1" },
  { value: "option2", label: "Option 2" },
  { value: "option3", label: "Option 3" },
  { value: "option4", label: "Option 4" },
];

export default function DropdownPage() {
  const [selected, setSelected] = useState("");

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-12 min-h-0">
        <header className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Dropdown-Seite
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Wähle eine Option aus der Dropbox:
          </p>
        </header>

        <div className="w-full max-w-sm px-4 space-y-6">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="dropbox"
              className="text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Dropbox
            </label>
            <select
              id="dropbox"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-4 py-2.5 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
            >
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <p className="rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/30 px-4 py-3 text-green-800 dark:text-green-300 text-sm">
              Ausgewählt:{" "}
              <span className="font-semibold">
                {options.find((o) => o.value === selected)?.label}
              </span>
            </p>
          )}

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-blue-700 dark:text-blue-500 hover:underline text-sm"
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </main>
  );
}
