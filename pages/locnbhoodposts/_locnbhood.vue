<template>
  <div>
    <appbar></appbar>
    <v-main>
      <navdrawer :location="location"></navdrawer>
      <v-container grid-list>
        <client-only placeholder="Loading....">
          <v-row class="title-button">
             <h1>{{nbhood}} in {{location}}</h1>
         </v-row>
          <v-col>
            <v-row v-for="(response, i) in responses" :key="i">
              <feedpost :response="response"></feedpost>
            </v-row>
          </v-col>
        </client-only>
      </v-container>
      <infinite-loading
        v-if="responses.length"
        spinner="spiral"
        @infinite="infinteScroll"
      ></infinite-loading>
    </v-main>
  </div>
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
    console.log(data);
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
</style>
