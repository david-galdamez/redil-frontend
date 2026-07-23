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
        <div className="space-y-4">
            <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`px-5 py-3 text-sm font-semibold transition-all whitespace-nowrap border-b-2 -mb-[1px] ${activeTab === tab.id
                                ? "border-[#003366] text-[#003366]"
                                : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
                            }`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="pt-2 animate-in fade-in duration-300">
                {renderTab(activeTab)}
            </div>
        </div>
    );
}