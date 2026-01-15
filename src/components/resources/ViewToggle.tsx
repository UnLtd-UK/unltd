/**
 * ViewToggle Component
 * A segmented control for switching between "By Type" and "By Topic" views
 * Persists selection in localStorage
 */

import { useState, useEffect } from "react";
import { RadioGroup } from "@headlessui/react";

export type ViewMode = "type" | "topic";

interface ViewToggleProps {
    defaultView?: ViewMode;
    onChange?: (view: ViewMode) => void;
    storageKey?: string;
}

const views = [
    { id: "type" as const, label: "By Type", icon: "grid-2" },
    { id: "topic" as const, label: "By Topic", icon: "tags" },
];

export default function ViewToggle({
    defaultView = "type",
    onChange,
    storageKey = "space-view-mode",
}: ViewToggleProps) {
    const [selected, setSelected] = useState<ViewMode>(defaultView);
    const [mounted, setMounted] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem(storageKey);
        if (stored === "type" || stored === "topic") {
            setSelected(stored);
            onChange?.(stored);
        }
    }, [storageKey, onChange]);

    const handleChange = (value: ViewMode) => {
        setSelected(value);
        localStorage.setItem(storageKey, value);
        onChange?.(value);
    };

    // Prevent hydration mismatch by rendering placeholder until mounted
    if (!mounted) {
        return (
            <div className="inline-flex rounded-xl bg-violet-900/50 p-1 ring-1 ring-violet-700/50">
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600/80 text-white">
                    <span className="text-sm font-medium">By Type</span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg text-violet-400">
                    <span className="text-sm font-medium">By Topic</span>
                </div>
            </div>
        );
    }

    return (
        <RadioGroup
            value={selected}
            onChange={handleChange}
            className="inline-flex rounded-xl bg-violet-900/50 p-1 ring-1 ring-violet-700/50"
        >
            <RadioGroup.Label className="sr-only">View mode</RadioGroup.Label>
            {views.map((view) => (
                <RadioGroup.Option
                    key={view.id}
                    value={view.id}
                    className={({ checked }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 ${checked
                            ? "bg-violet-600/80 text-white ring-1 ring-violet-500/50 shadow-lg shadow-violet-500/20"
                            : "text-violet-400 hover:text-violet-300 hover:bg-violet-800/30"
                        }`
                    }
                >
                    {({ checked }) => (
                        <span
                            className={`text-sm font-medium ${checked ? "text-white" : ""}`}
                        >
                            {view.label}
                        </span>
                    )}
                </RadioGroup.Option>
            ))}
        </RadioGroup>
    );
}
