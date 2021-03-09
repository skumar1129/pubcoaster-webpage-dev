<template>
  <v-app class="page">
    <appbar data-app :nav="false"></appbar>
      <v-container grid-list data-app>
        <v-row class="title-button">
          <h1 class="header">Posts for {{this.$route.params.user}}</h1>
        </v-row>
        <v-col>
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
      <div slot="no-results">No Posts Yet!! :(</div></infinite-loading>
  </v-app>
</template>

<script lang='ts'>
import { ref, defineComponent } from '@nuxtjs/composition-api';
import feedpost from '@/components/feed-post.vue';
import appbar from '~/components/appbar.vue';
import * as _ from 'lodash';

export default defineComponent({
  name: 'UserPosts',
  components: { appbar, feedpost },
  setup() {
     const responses = ref([]);
    const offset = ref(1);
    function goToCreatePost(this: any) {
      this.$router.push('/createpost');
    }
    async function infinteScroll(this: any, $state: any) {
      offset.value++;
      let data = await this.$axios.$get(`http://localhost:5000/post/user/${this.$route.params.user}?offset=${offset.value}`);
      if (data.length > 0) {
        responses.value = _.union(responses.value, data);
        $state.loaded();
      } else {
        $state.loaded();
        $state.complete();
      }
    }
    return { responses, goToCreatePost, infinteScroll };
  },
  async fetch() {
    let data = await this.$axios.$get(`http://localhost:5000/post/user/${this.$route.params.user}`);
    this.responses = _.union(this.responses, data);
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
