<template>
  <div>
    <appbar></appbar>
    <v-main>
      <navdrawer :location="$route.params.location"></navdrawer>
      <v-col class="d-flex align-center justify-space-between">
        <h1>{{this.$route.params.location}}</h1>
        <v-btn @click="goToCreatePost" elevation="2" outlined>Create New Post</v-btn>
      </v-col>
      <v-col>
        <client-only placeholder="Loading....">
          <v-row v-for="(response, i) in responses" :key="i">
            <post :response="response"></post>
          </v-row>
        </client-only>
      </v-col>
    </v-main>
  </div>
</template>

<script lang='ts'>
import post from '~/components/post.vue';
import appbar from '~/components/appbar.vue';
import navdrawer from '~/components/navdrawer.vue';
import * as _ from 'lodash';
import { ref, defineComponent} from '@nuxtjs/composition-api';

export default defineComponent({
  components: { post, appbar, navdrawer },
  name: "LocationPosts",
  setup() {
    const responses = ref([]);
    function goToCreatePost(this: any) {
      this.$router.push('/createpost')
    }
    return { responses, goToCreatePost };
  },
  async fetch() {
    let data = await this.$axios.$get(`http://localhost:5000/post/location/${this.$route.params.location}`);
    this.responses = _.union(this.responses, data)
  },
  fetchOnServer: false
});
</script>

<style>

</style>
