<template>
  <div>
    <appbar></appbar>
    <h1>Welcome to New App Name!</h1>
    <h3>Check out the vibes of night venues and bars in your area</h3>
    <img src="../assets/home_page.jpg" alt="Home Page IMG">
  </div>
</template>

<script>
import { ref, defineComponent} from '@nuxtjs/composition-api';
import appbar from '~/components/appbar.vue';


export default defineComponent({
  components: { appbar },
  name: "Home"
});
</script>

<style>

</style>
