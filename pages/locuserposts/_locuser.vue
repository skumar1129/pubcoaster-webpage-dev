<template>
  <v-app>
    <appbar></appbar>
    <v-main>
      <navdrawer :location="location"></navdrawer>
      <v-container>
        <client-only placeholder="Loading....">
          <h1>{{user}} in {{location}}</h1>
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
  name: "LocUserPosts",
  setup() {
    let responses = ref();
    const user = ref('');
    const location = ref('');
    return { responses, user, location };
  },
  async fetch() {
    let params = this.$route.params.locuser.split('-');
    this.location = params[0];
    this.user = params[1];
    let data = await this.$axios.$get(`http://localhost:5000/post/locuser/${this.location}/${this.user}`);
    this.responses = _.union(this.responses, data)
  },
  fetchOnServer: false
});
</script>

<style>

</style>
