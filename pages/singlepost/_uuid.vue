<template>
  <v-app>
    <appbar data-app :nav="false"></appbar>
    <v-main class="page">
      <client-only placeholder="Loading...">
        <post :response="response"></post>
      </client-only>
      <v-snackbar multi-line v-model="snackFail" color="red">
      <div class="snack">
      {{ snackText }}
      </div>
    </v-snackbar>
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
    const snackFail = ref(false);
    const snackText = ref('');
    return { response, snackFail, snackText };
  },
  async fetch(this: any) {
    try{
      this.$fire.auth.onAuthStateChanged(async (user: any) => {
        if (user) {
          const token = await this.$fire.auth.currentUser.getIdToken();
          this.$axios.setHeader('Authorization', `Bearer ${token}`);
          let data = await this.$axios.$get(`/postapi/post/${this.$route.params.uuid}`);
          this.response = data;
        } else {
          this.snackText = 'Error: User authentication failed. Please sign in again.';
          this.snackFail = true;
          await this.$store.dispatch('signOut');
          this.$router.push('/signin');
        }
      });
    } catch (e) {
      this.snackText = 'Error: could not retrieve posts';
      this.snackFail = true;
    }
  },
  fetchOnServer: false
});

</script>

<style>

  .page {
    background-color: white;
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
