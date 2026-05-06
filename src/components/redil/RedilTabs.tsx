import { useState } from "react";

interface Tab<T extends number> {
    id: T;
    label: string;
}

interface Props<T extends number> {
    tabs: readonly Tab<T>[];
    renderTab: (activeTab: T) => React.ReactNode;
    defaultTab?: T;
}

export default function RedilTabs<T extends number>({ tabs, renderTab, defaultTab }: Props<T>) {
    const [activeTab, setActiveTab] = useState<T>(defaultTab ?? tabs[0].id);

    return (
        <div className="space-y-3">
            <div className="flex border-b border-slate-200">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id
                                ? "border-b-2 border-blue-500 text-blue-600"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="pt-1">
                {renderTab(activeTab)}
            </div>
        </div>
    );
}