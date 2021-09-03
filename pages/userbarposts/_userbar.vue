<template>
  <v-app>
    <appbar data-app :nav="false" :user_nav="true" :username="user" ></appbar>
      <div class="page">
        <userinfo :user_information="user_information" :user_post="user_post"></userinfo>
      <v-container grid-list data-app>
        <v-row class="title-button">
          <h1 class="header">{{user}}'s Posts with {{bar}}</h1>
        </v-row>
        <v-row v-if="!loading && responses.length==0" class="titlearea">
          <h2 class="mb-2"><i>No posts yet for {{user}} with {{bar}} :(</i></h2>
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
import feedpost from '~/components/feed-post.vue';
import appbar from '~/components/appbar.vue';
import userinfo from '~/components/user-info.vue';
import * as _ from 'lodash';
import { ref, defineComponent} from '@nuxtjs/composition-api';

export default defineComponent({
  components: { feedpost, appbar, userinfo },
  name: "UserBarPosts",
  middleware: 'authenticate',
  setup() {
    const responses = ref([]);
    const bar = ref('');
    const user = ref('');
    const offset = ref(1);
    const user_information = ref({});
    const user_post = ref(0);
    const snackFail = ref(false);
    const snackText = ref('');
    const loading = ref(true);

    async function infinteScroll(this: any, $state: any) {
      offset.value++;
      try {
        const token = await this.$fire.auth.currentUser.getIdToken();
        this.$axios.setHeader('Authorization', `Bearer ${token}`);
        let data = await this.$axios.$get(`/postapi/post/userbar/${user.value}/${bar.value}?offset=${offset.value}`);
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
    return { responses, bar, user, infinteScroll, snackText, snackFail, user_information, user_post, loading };
  },
  async fetch(this: any) {
    let params = this.$route.params.userbar.split('-');
    this.user = params[0];
    this.bar = params[1];
    try {
      this.$fire.auth.onAuthStateChanged(async (user: any) => {
        if (user) {
          const token = await this.$fire.auth.currentUser.getIdToken();
          this.$axios.setHeader('Authorization', `Bearer ${token}`);
          let data = await this.$axios.$get(`/postapi/post/userbar/${this.user}/${this.bar}`);
          this.loading = false;
          this.responses = _.union(this.responses, data.post);
          this.user_post = data.totalCount;
          //get user data
          let user_info = await this.$axios.$get(`/userapi/user/${this.user}`);
          this.user_information = user_info;
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
