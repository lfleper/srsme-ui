import fetcher from '@/api/Api'
import { User, VuexData } from '@/types'
import { createStore } from 'vuex'

const defaultState: VuexData = {
  user: undefined
}

export default createStore({
  state: defaultState,
  mutations: {
    user: (state: VuexData, user: User) => {
      state.user = user
    }
  },
  actions: {
    async getUser() {
      fetcher<User>('GET', '/user/self')
          .then(resp => {
            if (!resp.data) {
              throw new Error('No user data')
            }
            this.commit('user', resp.data)
          })
          .catch(err => {
            console.error(err)
            throw new Error('No user data')
          })
    }
  },
  getters: {
    getUser: (state: VuexData) => state.user
  },
  modules: {
  }
})
