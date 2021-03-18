import Vuex from 'vuex';
// import createPersistedState from 'vuex-persistedstate';

const createStore = () => {
  return new Vuex.Store({
    // plugins: [
    //   createPersistedState()
    // ],
    state: {
      user: '',
    },

    getters: {
      user(state) {
        return state.user;
      },

      // TODO: may not need?
      // isAuthenticated(state) {
      //   return !!state.user
      // },

      isEmailVerified(state) {
        return state.user.emailVerified;
      },

      hasDisplayName(state) {
        return state.user.displayName;
      }

    },

    mutations: {
      setUser(state, payload) {
        if (payload) {
          const { email, displayName, emailVerified } = payload;
          state.user = { email, displayName, emailVerified };
        }
        else {
          state.user = null;
        }
      },

      setDisplayName(state, payload) {
        if (payload) {
          state.user.displayName = payload;
        }
      },

      ON_AUTH_STATE_CHANGED_MUTATION(state, { authUser }) {
        if (!authUser) {
          state.user = null;
        } else {
          const { email, emailVerified, displayName } = authUser;
          state.user = { email, emailVerified, displayName };
        }
      }

    },

    actions: {
      nuxtServerInit({ commit }, { res }){
        if (res && res.locals && res.locals.user) {
          const { allClaims: claims, idToken: token, ...authUser } = res.locals.user;
          commit('ON_AUTH_STATE_CHANGED_MUTATION', { authUser });
        }
      },
      async setUserName({ commit }, { displayName }) {
        await this.$fire.auth.currentUser.updateProfile({displayName: displayName});
        commit('setDisplayName', displayName);
      },
      async signUp({ commit }, { email, password }) {
        let userCredentials = await this.$fire.auth.createUserWithEmailAndPassword(email, password);
        if (userCredentials.user) {
          userCredentials.user.sendEmailVerification();
          commit('setUser', userCredentials.user);
        }
      },

      async signIn({ commit }, { email, password }) {
        let userCredentials = await this.$fire.auth.signInWithEmailAndPassword(email, password);
        if (userCredentials.user) {
          commit('setUser', userCredentials.user);
        }
      },

      async signOut({ commit }) {
        await this.$fire.auth.signOut();
        commit('setUser', null);
      }
    }
  })
};

export default createStore;
