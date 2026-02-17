import { defineStore } from "pinia"

export type SearchLayout = 'card' | 'list'

export const useSearchViewStore = defineStore('searchView', {
  state: () => ({
    layout: 'card' as SearchLayout,
  }),
  actions: {
    setLayout(layout: SearchLayout) {
      this.layout = layout
    },
    toggleLayout() {
      this.layout = this.layout === 'card' ? 'list' : 'card'
    },
  },
  persist: {
    key: 'travelhub-search-view',
  },
})
