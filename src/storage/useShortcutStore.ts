import { create } from 'zustand'

interface ShortcutStore {
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
}

export const useShortcutStore = create<ShortcutStore>(set => ({
  isEditing: false,
  setIsEditing: isEditing => set({ isEditing }),
}))
