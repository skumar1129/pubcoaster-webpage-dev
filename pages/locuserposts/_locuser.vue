<template>
  <v-app class="page">
    <appbar data-app :nav="true" :location="location"></appbar>
      <v-container grid-list data-app>
        <v-row class="title-button">
          <h1 class="header">{{user}} in {{location}}</h1>
        </v-row>
        <v-row v-if="responses.length==0" class="titlearea">
          <h2 class="mb-2"><i>No posts yet for {{user}} :(</i></h2>
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
      <v-snackbar multi-line v-model="snackFail" color="red" data-app>
      <div class="snack">
      {{ snackText }}
      </div>
    </v-snackbar>
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
  name: "LocUserPosts",
  middleware: 'authenticate',
  setup() {
    let responses = ref([]);
    const user = ref('');
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
        let data = await this.$axios.$get(`http://localhost:5000/post/locuser/${location.value}/${user.value}?offset=${offset.value}`);
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
        console.log(e);
      }
    }
    return { responses, user, location, goToCreatePost, infinteScroll, snackText, snackFail };
  },
  async fetch() {
    let params = this.$route.params.locuser.split('-');
    this.location = params[0];
    this.user = params[1];
    try {
      let data = await this.$axios.$get(`http://localhost:5000/post/locuser/${this.location}/${this.user}`);
      this.responses = _.union(this.responses, data)
    } catch (e) {
      this.snackText = 'Error: could not retrieve posts';
      this.snackFail = true;
      console.log(e);
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
