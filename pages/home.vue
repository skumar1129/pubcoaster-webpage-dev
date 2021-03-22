<template>
  <v-app>
    <appbar data-app :nav="false"></appbar>
    <v-main data-app class="page">
    <h1 class="heading">Welcome to New App Name!</h1>
    <h3 class="heading">Check out the vibes of night venues and bars in your area</h3>
    <v-spacer></v-spacer>
    <img src="imageUrl" alt="Home Page IMG" height="100%" width="100%" class="image">
    </v-main>
  </v-app>
</template>

<script>
import { ref, defineComponent, computed, onMounted} from '@nuxtjs/composition-api';
import appbar from '~/components/appbar.vue';


export default defineComponent({
  components: { appbar },
  name: "Home",
  middleware: 'authenticate',
  setup() {
    const imageUrl = ref('');
    onMounted(() => {

      $nuxt.$fire.storage.ref().child('splash_screen.jpg').getDownloadUrl()
      .then((url) => {
        imageUrl.value = url;
      })
      .catch(e => console.log(e));
    });
    return { imageUrl };
  }

});
</script>

<style>
  .heading {
    text-align: center;
    padding: .15em;
    justify-content: center;
    color: black;
    font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  }
  .image {
    border: 1em solid black;
  }
  .page {
    background-color: white;
  }

</style>
