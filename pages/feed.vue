<template>
    <v-app>
    <div class="page">
      <appbar data-app :nav="false" :user_nav="false"></appbar>
        <v-container grid-list data-app>
          <v-row class="title-button">
            <h1 class="header">Your Feed</h1>
          </v-row>
          <v-row v-if="responses.length==0" class="titlearea">
            <h2 class="mb-2"><i>No posts yet for your followers :(</i></h2>
            <img src="../assets/city_page.jpg" alt="City Page IMG" height="100%" width="100%">
          </v-row>
          <v-col v-else>
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
  name: "Feed",
  middleware: 'authenticate',
  setup() {
    const responses = ref([]);
    const offset = ref(1);
    const snackFail = ref(false);
    const snackText = ref('');

    async function infinteScroll(this: any, $state: any) {
      offset.value++;
      try {
        const token = await this.$fire.auth.currentUser.getIdToken();
        this.$axios.setHeader('Authorization', `Bearer ${token}`);
        this.$axios.setHeader('user', this.$store.state.user.displayName);
        let data = await this.$axios.$get(`/followersapi/followingposts?offset=${offset.value}`);
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
    return { responses, infinteScroll, snackFail, snackText };
  },
  async fetch(this: any) {
    try {
      this.$fire.auth.onAuthStateChanged(async (user: any) => {
        if (user) {
          const token = await this.$fire.auth.currentUser.getIdToken();
          this.$axios.setHeader('Authorization', `Bearer ${token}`);
          this.$axios.setHeader('user', this.$store.state.user.displayName);
          let data = await this.$axios.$get(`/followersapi/followingposts`);
          this.responses = _.union(this.responses, data);
        } else {
          this.snackText = 'Error: User authentication failed. Please sign in again.';
          this.snackFail = true;
          await this.$store.dispatch('signOut');
          this.$router.push('/signin');
        }
      });
    } catch (e) {
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
    justify-content: center;
    margin-bottom: 2rem;
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
</style>
