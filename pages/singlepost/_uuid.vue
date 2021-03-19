<template>
  <v-app>
    <appbar data-app :nav="false"></appbar>
    <v-main class="page">
      <client-only placeholder="Loading...">
        <post :response="response" :currentUser="user"></post>
      </client-only>
    </v-main>
  </v-app>
</template>

<script lang='ts'>
import { ref, computed, defineComponent } from '@nuxtjs/composition-api';
import appbar from '~/components/appbar.vue';
import post from '~/components/post.vue';

export default defineComponent({
  components: { post, appbar },
  name: "LocationPosts",
  middleware: 'authenticate',
  setup() {
    const response = ref({});
    const user = computed(function(this: any){
      return this.$store.state.user.displayName;
    });
    return { response, user };
  },
  async fetch() {
    let data = await this.$axios.$get(`http://localhost:5000/post/${this.$route.params.uuid}`);
    this.response = data;
  },
  fetchOnServer: false
});

</script>

<style>

  .page {
    background-color: white;
  }

</style>
