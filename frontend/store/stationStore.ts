import { create } from "zustand";

interface StationStore {
  selectedStation: string;
  stationStates: Record<string, any>;
  alerts: any[];
  setSelectedStation: (stationId: string) => void;
  updateStationState: (stationId: string, state: any) => void;
  setAlerts: (alerts: any[]) => void;
}

export const useStationStore = create<StationStore>((set) => ({
  selectedStation: "maitri",
  stationStates: {},
  alerts: [],
  setSelectedStation: (stationId) => set({ selectedStation: stationId }),
  updateStationState: (stationId, state) =>
    set((s) => ({
      stationStates: { ...s.stationStates, [stationId]: state },
    })),
  setAlerts: (alerts) => set({ alerts }),
}));
