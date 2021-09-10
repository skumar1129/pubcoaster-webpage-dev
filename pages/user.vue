<template>
  <v-app>
    <appbar :nav="false" :userNav="false" data-app></appbar>
      <div class="page" data-app>
        <client-only>
          <myinfo :userInformation="userInformation" :userPost="userPost"></myinfo>
        </client-only>
      <v-container grid-list data-app class="spacing">
        <v-row v-if="!loading && responses.length==0" class="titlearea">
          <h2 class="mb-2"><i>No posts yet :(</i></h2>
          <img src="../assets/city_page.jpg" alt="City Page IMG" height="100%" width="100%">
        </v-row>
        <v-col v-else-if="!loading && responses.length!=0">
          <client-only placeholder="Loading....">
            <v-row v-for="(response, i) in responses" :key="i">
              <editpost :response="response"></editpost>
            </v-row>
          </client-only>
        </v-col>
      </v-container>
      <infinite-loading
        v-if="responses.length"
        spinner="spiral"
        @infinite="infinteScroll"
        data-app
      ><span slot="no-more"></span>
      </infinite-loading>
      </div>
       <v-snackbar multi-line v-model="snackFail" color="red" data-app>
      <div class="snack">
      {{ snackText }}
      </div>
    </v-snackbar>
     <v-overlay :value="loading">
      <div class="center-it">
          <v-progress-circular
            indeterminate
            color="black"
            size="110"
          ></v-progress-circular>
      </div>
      </v-overlay>
  </v-app>
</template>

<script lang='ts'>
import { ref, defineComponent } from '@nuxtjs/composition-api';
import appbar from '~/components/appbar.vue';
import editpost from '@/components/edit-post.vue';
import myinfo from '@/components/my-info.vue';
import * as _ from 'lodash';

export default defineComponent({
  name: 'UserFeed',
  components: { editpost, appbar, myinfo },
  middleware: 'authenticate',
  setup() {
    const responses = ref([]);
    const userInformation = ref({});
    const userPost = ref(0);
    const offset = ref(1);
    const snackFail = ref(false);
    const snackText = ref('');
    const loading = ref(true);

    async function infinteScroll(this: any, $state: any) {
      offset.value++;
      try {
        const token = await this.$fire.auth.currentUser.getIdToken();
        this.$axios.setHeader('Authorization', `Bearer ${token}`);
        let data = await this.$axios.$get(`/postapi/mypost/user?offset=${offset.value}`);
        if (data.post.length > 0) {
          responses.value = _.union(responses.value, data.post);
          $state.loaded();
        } else {
          $state.loaded();
          $state.complete();
        }
      } catch (e) {
         this.snackText = 'Error: could not retrieve posts';
        this.snackFail = true;
      }
    }
    return { responses, infinteScroll, snackText, snackFail, userInformation, userPost, loading };
  },
  async fetch(this: any) {
    try {
      const username = this.$store.state.user.displayName;
      this.$axios.setHeader('username', username);
      this.$fire.auth.onAuthStateChanged(async (user: any) => {
        if (user) {
          const token = await this.$fire.auth.currentUser.getIdToken();
          this.$axios.setHeader('Authorization', `Bearer ${token}`);
          let data = await this.$axios.$get('/postapi/mypost/user');
          this.loading = false;
          this.responses = _.union(this.responses, data.post);
          this.userPost = data.totalCount;
          //get user data
          let userInfo = await this.$axios.$get(`/userapi/user/${username}`);
          this.userInformation = userInfo;
        } else {
          this.loading = false;
          this.snackText = 'Error: User authentication failed. Please sign in again.';
          this.snackFail = true;
          await this.$store.dispatch('signOut');
          this.$router.push('/signin');
        }
      });
    } catch (e) {
      this.loading = false;
       this.snackText = 'Error: could not retrieve posts';
      this.snackFail = true;
    }
  },
  fetchOnServer: false,
  watchQuery: ['offset']
});
</script>

<style scoped>
  .page {
    background-color: white;
    color: black;
    font-size: 1.5em;
    height: 100%;
    width: 100%;
  }
  .titlearea {
    justify-content: center;
    font-family: "Lucida Console", "Courier New", monospace;
  }
  .snack {
    width: 100%;
    font-weight: bold;
    font-size: 1.5em;
    color: white;
    text-align: center;
    font-style: italic;
  }
  .spacing {
    margin-top: 1.5em;
  }
</style>
