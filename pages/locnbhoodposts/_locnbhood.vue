<template>
  <v-app class="page">
    <appbar :nav="true" :location="location" data-app></appbar>
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
    function goToCreatePost(this: any) {
      this.$router.push('/createpost');
    }
    async function infinteScroll(this: any, $state: any) {
      offset.value++;
      let data = await this.$axios.$get(`http://localhost:5000/post/locnbhood/${location.value}/${nbhood.value}?offset=${offset.value}`);
      if (data.length > 0) {
        responses.value = _.union(responses.value, data);
        $state.loaded();
      } else {
        $state.loaded();
        $state.complete();
      }
    }
    return { responses, nbhood, location, goToCreatePost, infinteScroll };
  },
  async fetch() {
    let params = this.$route.params.locnbhood.split('-');
    this.location = params[0];
    this.nbhood = params[1];
    let data = await this.$axios.$get(`http://localhost:5000/post/locnbhood/${this.location}/${this.nbhood}`);
    this.responses = _.union(this.responses, data)
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
</style>
