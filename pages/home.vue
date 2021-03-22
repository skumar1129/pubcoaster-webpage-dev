<template>
  <v-app>
    <appbar data-app :nav="false"></appbar>
    <v-main data-app class="page">
    <h1 class="heading">Welcome to Knew Barz!</h1>
    <h3 class="heading">Check out the vibes of night venues and bars in your area</h3>
    <v-spacer></v-spacer>
    <img src="../assets/home_page.jpg" alt="Home Page IMG" height="100%" width="100%" class="image">
    </v-main>
  </v-app>
</template>

<script>
import { ref, defineComponent, computed, onMounted} from '@nuxtjs/composition-api';
import appbar from '~/components/appbar.vue';


export default defineComponent({
  components: { appbar },
  name: "Home",
  middleware: 'authenticate'
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
