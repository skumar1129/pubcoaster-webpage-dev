<template>
    <v-app>
    <div class="page">
      <appbar data-app :nav="true" :location="$route.params.location" :user_nav="false"></appbar>
        <v-container grid-list data-app>
          <v-row class="title-button">
            <h1 class="header">{{this.$route.params.location}}</h1>
            <v-btn class="busy-button" medium color="grey darken-1" @click="goToBarBusy">See what's poppin'</v-btn>
          </v-row>
          <v-row v-if="!loading && responses.length==0" class="titlearea">
            <h2 class="mb-2"><i>No posts yet for {{this.$route.params.location}} :(</i></h2>
            <img src="../../assets/city_page.jpg" alt="City Page IMG" height="100%" width="100%">
          </v-row>
          <v-col v-else-if="!loading && responses.length!=0">
            <client-only placeholder="Loading....">
              <v-row v-for="(response, i) in responses" :key="i">
                <feedpost :response="response"></feedpost>
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
      </div>
    </v-app>
</template>

<script lang='ts'>
import feedpost from '~/components/feed-post.vue';
import appbar from '~/components/appbar.vue';
import * as _ from 'lodash';
import { ref, defineComponent} from '@nuxtjs/composition-api';

export default defineComponent({
  components: { feedpost, appbar },
  name: "LocationPosts",
  middleware: 'authenticate',
  setup() {
    const responses = ref([]);
    const offset = ref(1);
    const snackFail = ref(false);
    const snackText = ref('');
    const loading = ref(true);

    function goToBarBusy(this: any) {
      this.$router.push(`/barbusyform/${this.$route.params.location}`);
    }

    async function infinteScroll(this: any, $state: any) {
      offset.value++;
      try {
        const token = await this.$fire.auth.currentUser.getIdToken();
        this.$axios.setHeader('Authorization', `Bearer ${token}`);
        let data = await this.$axios.$get(`/postapi/post/location/${this.$route.params.location}?offset=${offset.value}`);
        if (data.length > 0) {
          responses.value = _.union(responses.value, data);
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
    return { responses, infinteScroll, snackFail, snackText, loading, goToBarBusy };
  },
  async fetch(this: any) {
    try {
      this.$fire.auth.onAuthStateChanged(async (user: any) => {
        if (user) {
          const token = await this.$fire.auth.currentUser.getIdToken();
          this.$axios.setHeader('Authorization', `Bearer ${token}`);
          let data = await this.$axios.$get(`/postapi/post/location/${this.$route.params.location}`);
          this.loading = false; 
          this.responses = _.union(this.responses, data);
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
  .title-button {
    display: flex;
    position: relative;   
    margin-bottom: 2.75rem;
    margin-top: 2rem;
  }
  .page {
    background-color: white;
    color: black;
    font-size: 1.5em;
    height: 100%;
    width: 100%;
  }
  .header {
    font-family: fantasy;
    text-decoration: underline;
    flex: 0 1 auto;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
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
  .busy-button {
    flex: 0 1 auto;
    margin-left: auto;  
    font-weight: bold;
    color: white;
  }
</style>
