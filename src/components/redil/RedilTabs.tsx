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
      <div className="no-scrollbar flex overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`-mb-[1px] border-b-2 px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? "border-[#003366] text-[#003366]"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="animate-in fade-in pt-2 duration-300">{renderTab(activeTab)}</div>
    </div>
  );
}
