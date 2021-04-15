<template>
  <v-app>
    <appbar :nav="true" :location="location" data-app></appbar>
      <div class="page">
      <v-container grid-list data-app>
        <v-row class="title-button">
             <h1 class="header">{{nbhood}} in {{location}}</h1>
        </v-row>
        <v-row v-if="responses.length==0" class="titlearea">
          <h2 class="mb-2"><i>No posts yet for {{nbhood}} :(</i></h2>
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

<script lang="ts">
import { ref, defineComponent } from '@nuxtjs/composition-api';
import feedpost from '~/components/feed-post.vue';
import appbar from '~/components/appbar.vue'
import navdrawer from '~/components/navdrawer.vue';
import * as _ from 'lodash';

export default defineComponent({
  components: { feedpost, appbar, navdrawer },
  name: "LocNbhoodPosts",
  middleware: 'authenticate',
  setup() {
    let responses = ref([]);
    const nbhood = ref('');
    const location = ref('');
    const offset = ref(1);
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
        let data = await this.$axios.$get(`/postapi/post/locnbhood/${location.value}/${nbhood.value}?offset=${offset.value}`);
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
    return { responses, nbhood, location, goToCreatePost, infinteScroll, snackFail, snackText };
  },
  async fetch(this: any) {
    let params = this.$route.params.locnbhood.split('-');
    this.location = params[0];
    this.nbhood = params[1];
    try {
      const token = await this.$fire.auth.currentUser.getIdToken();
      this.$axios.setHeader('Authorization', `Bearer ${token}`);
      let data = await this.$axios.$get(`/postapi/post/locnbhood/${this.location}/${this.nbhood}`);
      this.responses = _.union(this.responses, data);
    } catch (e) {
      this.snackText = 'Error: could not retrieve posts';
      this.snackFail = true;
    }
  },
  fetchOnServer: false
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
</style>
