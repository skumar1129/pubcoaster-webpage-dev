<template>
  <v-app class="page">
    <appbar data-app :nav="true"></appbar>
      <v-container grid-list data-app>
        <client-only placeholder="Loading....">
          <v-row class="title-button">
             <h1 class="header">{{bar}} in {{location}}</h1>
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
        data-app
      ><span slot="no-more"></span>
      <div slot="no-results">No Posts Yet!! :(</div></infinite-loading>
  </v-app>
</template>

<script lang='ts'>
import feedpost from '~/components/feed-post.vue';
import appbar from '~/components/appbar.vue';
import navdrawer from '~/components/navdrawer.vue';
import * as _ from 'lodash';
import { ref, defineComponent} from '@nuxtjs/composition-api';

export default defineComponent({
  components: { feedpost, appbar, navdrawer },
  name: "LocBarPosts",
  setup() {
    const responses = ref([]);
    const bar = ref('');
    const location = ref('');
    const offset = ref(1);
    function goToCreatePost(this: any) {
      this.$router.push('/createpost');
    }
    async function infinteScroll(this: any, $state: any) {
      offset.value++;
      let data = await this.$axios.$get(`http://localhost:5000/post/locbar/${location.value}/${bar.value}?offset=${offset.value}`);
      if (data.length > 0) {
        responses.value = _.union(responses.value, data);
        $state.loaded();
      } else {
        $state.loaded();
        $state.complete();
      }
    }
    return { responses, bar, location, goToCreatePost, infinteScroll };
  },
  async fetch() {
    let params = this.$route.params.locbar.split('-');
    this.location = params[0];
    this.bar = params[1];
    let data = await this.$axios.$get(`http://localhost:5000/post/locbar/${this.location}/${this.bar}`);
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
  }
</style>
