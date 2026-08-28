import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface RecentSearchItem {
  title: string
  subtitle?: string
  path: string
  type: 'state' | 'district' | 'pincode' | 'office' | 'query'
  timestamp: number
}

const STORAGE_KEY = 'pin_directory_recent_searches'
const MAX_RECENT_ITEMS = 5

export const useRecentSearchesStore = defineStore('recentSearches', () => {
  const history = ref<RecentSearchItem[]>([])
  const isLoaded = ref(false)

  const loadFromStorage = () => {
    if (!import.meta.client) return
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          history.value = parsed.slice(0, MAX_RECENT_ITEMS)
        }
      }
    } catch (err) {
      console.warn('Failed to load recent searches from localStorage:', err)
    } finally {
      isLoaded.value = true
    }
  }

  const saveToStorage = () => {
    if (!import.meta.client) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
    } catch (err) {
      console.warn('Failed to save recent searches to localStorage:', err)
    }
  }

  const addSearch = (item: Omit<RecentSearchItem, 'timestamp'>) => {
    if (!import.meta.client) return
    if (!isLoaded.value) {
      loadFromStorage()
    }

    // Filter out duplicate if existing by path or title
    const filtered = history.value.filter(
      (h) => h.path !== item.path && h.title.toLowerCase() !== item.title.toLowerCase()
    )

    const newItem: RecentSearchItem = {
      ...item,
      timestamp: Date.now(),
    }

    history.value = [newItem, ...filtered].slice(0, MAX_RECENT_ITEMS)
    saveToStorage()
  }

  const removeSearch = (path: string) => {
    history.value = history.value.filter((h) => h.path !== path)
    saveToStorage()
  }

  const clearHistory = () => {
    history.value = []
    if (import.meta.client) {
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch (err) {
        console.warn('Failed to clear recent searches from localStorage:', err)
      }
    }
  }

  // Automatically initialize on client
  if (import.meta.client) {
    loadFromStorage()
  }

  return {
    history,
    isLoaded,
    addSearch,
    removeSearch,
    clearHistory,
    loadFromStorage,
  }
})
