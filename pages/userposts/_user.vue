<template>
  <div>
  <appbar></appbar>
  <h1>{{this.$route.params.user}} in {{this.$route.params.location}}</h1>
  <v-spacer></v-spacer>
  <v-row v-for="(response, i) in responses" :key="i">
    <v-spacer></v-spacer>
    <post :response="response"></post>
    <v-spacer></v-spacer>
  </v-row>
  </div>
</template>

<script lang='ts'>
import post from '~/components/post.vue';
import appbar from '~/components/appbar.vue';
import * as _ from 'lodash';
import { ref, defineComponent} from '@nuxtjs/composition-api';

export default defineComponent({
  components: { post, appbar },
  name: "UserPosts",
  setup() {
    let responses = ref([]);
    return { responses };
  },
  async fetch() {
    let data = await this.$axios.$get(`http://localhost:5000/post/locuser/${this.$route.params.location}/${this.$route.params.user}`);
    this.responses = _.union(this.responses, data)
    console.log(this.responses);
  }
});
</script>

<style>

</style>
