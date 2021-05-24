<template>
  <v-app>
    <appbar data-app :nav="false" :user_nav="true" :username="this.$route.params.user"></appbar>
      <div class="page">
        <userinfo :user_information="user_information" :user_post="user_post"></userinfo>
      <v-container grid-list data-app class="spacing">
        <v-row v-if="responses.length==0" class="titlearea">
          <h2 class="mb-2"><i>No posts yet for {{this.$route.params.user}} :(</i></h2>
          <img src="../../assets/city_page.jpg" alt="City Page IMG" height="100%" width="100%">
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
      </div>
       <v-snackbar multi-line v-model="snackFail" color="red" data-app>
      <div class="snack">
      {{ snackText }}
      </div>
    </v-snackbar>
  </v-app>
</template>

<script lang='ts'>
import { ref, defineComponent } from '@nuxtjs/composition-api';
import feedpost from '@/components/feed-post.vue';
import userinfo from '@/components/user-info.vue';
import appbar from '~/components/appbar.vue';
import * as _ from 'lodash';

export default defineComponent({
  name: 'UserPosts',
  components: { appbar, feedpost, userinfo },
  middleware: 'authenticate',
  setup() {
    const responses = ref([]);
    const offset = ref(1);
    const user_information = ref({});
    const user_post = ref(0);
    const snackFail = ref(false);
    const snackText = ref('');
    function goToCreatePost(this: any) {
      this.$router.push('/createpost');
    }
    async function infinteScroll(this: any, $state: any) {
      offset.value++;
      try {
        const token = await this.$fire.auth.currentUser.getIdToken();
        this.$axios.setHeader('Authorization', `Bearer ${token}`);
        let data = await this.$axios.$get(`/postapi/post/user/${this.$route.params.user}?offset=${offset.value}`);
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
    return { responses, goToCreatePost, infinteScroll, snackText, snackFail, user_post, user_information };
  },
  async fetch(this: any) {
    try {
      this.$fire.auth.onAuthStateChanged(async (user: any) => {
        if (user) {
          const token = await this.$fire.auth.currentUser.getIdToken();
          this.$axios.setHeader('Authorization', `Bearer ${token}`);
          let data = await this.$axios.$get(`/postapi/post/user/${this.$route.params.user}`);
          this.responses = _.union(this.responses, data.post);
          this.user_post = data.totalCount;
          //get user data
          let user_info = await this.$axios.$get(`/userapi/user/${this.$route.params.user}`);
          this.user_information = user_info;
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
    font-family: "Lucida Console", "Courier New", monospace;;
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
    margin-top: 1em;
  }
</style>
