import { defindeStore } from 'pinia'

export const useAuthStore = defindeStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false,
  }),
  actions: {
    login(userData) {
      this.user = userData
      this.isLoggedIn = true
    },
    logout() {
      this.user = null
      this.isLoggedIn = false
    },
  },
})
