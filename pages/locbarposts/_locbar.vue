<template>
  <v-app>
    <appbar></appbar>
    <v-main>
      <navdrawer :location="location"></navdrawer>
      <v-container>
        <client-only placeholder="Loading....">
          <h1>{{bar}} in {{location}}</h1>
          <v-row v-for="(response, i) in responses" :key="i">
            <post :response="response"></post>
          </v-row>
        </client-only>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang='ts'>
import post from '~/components/post.vue';
import appbar from '~/components/appbar.vue';
import navdrawer from '~/components/navdrawer.vue';
import * as _ from 'lodash';
import { ref, defineComponent} from '@nuxtjs/composition-api';

export default defineComponent({
  components: { post, appbar, navdrawer },
  name: "LocBarPosts",
  setup() {
    let responses = ref();
    const bar = ref('');
    const location = ref('');
    return { responses, bar, location };
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

<style>

</style>
