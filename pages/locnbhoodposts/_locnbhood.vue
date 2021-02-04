<template>
  <div>
    <appbar></appbar>
    <v-main>
      <navdrawer :location="location"></navdrawer>
      <client-only placeholder="Loading....">
        <h1>{{nbhood}} in {{location}}</h1>
        <v-row v-for="(response, i) in responses" :key="i">
          <post :response="response"></post>
        </v-row>
      </client-only>
    </v-main>
  </div>
</template>

<script lang="ts">
import { ref, defineComponent } from '@nuxtjs/composition-api';
import post from '~/components/post.vue';
import appbar from '~/components/appbar.vue'
import navdrawer from '~/components/navdrawer.vue';
import * as _ from 'lodash';

export default defineComponent({
  components: { post, appbar, navdrawer },
  name: "LocNbhoodPosts",
  setup() {
    let responses = ref();
    const nbhood = ref('');
    const location = ref('');
    return { responses, nbhood, location };
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


<style>

</style>
