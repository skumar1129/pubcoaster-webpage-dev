<template>
  <div>
    <appbar></appbar>
    <v-main>
      <v-container grid-list>
        <v-row class="title-button">
          <h1>My Posts</h1>
          <v-btn @click="goToCreatePost" elevation="2" outlined>Create New Post</v-btn>
        </v-row>
        <v-col>
          <client-only placeholder="Loading....">
            <v-row v-for="(response, i) in responses" :key="i">
              <editpost :response="response"></editpost>
            </v-row>
          </client-only>
        </v-col>
      </v-container>
      <infinite-loading
        v-if="responses.length"
        spinner="spiral"
        @infinite="infinteScroll"
      ></infinite-loading>
    </v-main>
  </div>
</template>

<script lang='ts'>
import { ref, defineComponent } from '@nuxtjs/composition-api';
import appbar from '~/components/appbar.vue';
import editpost from '@/components/edit-post.vue';
import * as _ from 'lodash';

export default defineComponent({
  name: 'UserFeed',
  components: { editpost, appbar },
  setup() {
    const responses = ref([]);
    const offset = ref(1);
    function goToCreatePost(this: any) {
      this.$router.push('/createpost');
    }
    async function infinteScroll(this: any, $state: any) {
      offset.value++;
      let data = await this.$axios.$get(`http://localhost:5000/mypost/user?offset=${offset.value}`);
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
    // TODO: Make username come from local storage
    this.$axios.setHeader('username', 'helga');
    let data = await this.$axios.$get('http://localhost:5000/mypost/user');
    this.responses = _.union(this.responses, data);
  },
  fetchOnServer: false
});
</script>

<style scoped>
  .title-button {
    display: flex;
    justify-content: space-around;
    margin-bottom: 2rem;
    margin-top: 2rem;
  }
</style>
