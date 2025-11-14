import { create } from 'zustand';
import { dashboardAPI } from '../lib/api';

const useDashboardStore = create((set, get) => ({
  // State
  widgets: [],
  isLoading: false,
  error: null,
  user: null,

  // Actions
  setUser: (user) => set({ user }),

  addWidget: (widget) =>
    set((state) => ({
      widgets: [...state.widgets, widget],
    })),

  removeWidget: (widgetId) =>
    set((state) => ({
      widgets: state.widgets.filter((w) => w.id !== widgetId),
    })),

  updateWidget: (widgetId, data) =>
    set((state) => ({
      widgets: state.widgets.map((w) =>
        w.id === widgetId ? { ...w, data: { ...w.data, ...data } } : w
      ),
    })),

  setWidgets: (widgets) => set({ widgets }),

  loadDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await dashboardAPI.getDashboard();
      set({ widgets: response.widgets || [], isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to load dashboard',
        isLoading: false,
      });
    }
  },

  saveDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const { widgets } = get();
      await dashboardAPI.saveDashboard(widgets);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to save dashboard',
        isLoading: false,
      });
      return { success: false, error: error.response?.data?.message };
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearStore: () =>
    set({
      widgets: [],
      isLoading: false,
      error: null,
      user: null,
    }),
}));

export default useDashboardStore;
