import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false,
  }),
  persist: true,
  actions: {
    login(userData) {
      if (!userData || !userData.email) return
      this.user = userData
      this.isLoggedIn = true
    },
    logout() {
      this.user = null
      this.isLoggedIn = false
      this.$reset
      localStorage.removeItem('pinia')
    },
  },
})
