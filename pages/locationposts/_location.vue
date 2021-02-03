<template>
  <div>
  <appbar></appbar>
  <h1>{{this.$route.params.location}}</h1>
    <client-only placeholder="Loading....">
      <v-row v-for="(response, i) in responses" :key="i">
        <post :response="response"></post>
      </v-row>
    </client-only>
  </div>
</template>

<script lang='ts'>
import post from '~/components/post.vue';
import appbar from '~/components/appbar.vue';
import * as _ from 'lodash';
import { ref, defineComponent} from '@nuxtjs/composition-api';

export default defineComponent({
  components: { post, appbar },
  name: "LocationPosts",
  setup() {
    const responses = ref([]);
    return { responses };
  },
  async fetch() {
    let data = await this.$axios.$get(`http://localhost:5000/post/location/${this.$route.params.location}`);
    this.responses = _.union(this.responses, data)
    console.log(this.responses);
  },
  fetchOnServer: false
});
</script>

<style>

</style>
