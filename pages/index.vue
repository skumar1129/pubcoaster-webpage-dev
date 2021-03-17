<template>
  <v-app>
    <img src="../assets/splash_screen.jpg" alt="Splash Screen IMG">
  </v-app>
</template>

<script>
import { onMounted ,computed, defineComponent } from '@nuxtjs/composition-api';
export default defineComponent ({
  // TODO: Change this along with the firebase calls
  name: "Index",
  // setup() {
  //   const authUser = computed(() => {
  //     return $nuxt.$store.getters.user;
  //   });
  //   onMounted(() => {
  //     if (!authUser.value) {
  //       $nuxt.$router.push('/signin');
  //     }
  //     else if (!authUser.value.emailVerified) {
  //       $nuxt.$router.push('/verifyemail');
  //     }
  //     else if (!authUser.value.displayName) {
  //       $nuxt.$router.push('/adduserinfo');
  //     }
  //     else {
  //       $nuxt.$router.push('/home');
  //     }
  //   })
  // }
  // fetch() {
  //   const authUser = $nuxt.$store.getters.user;
  //     if (!authUser) {
  //       $nuxt.$router.push('/signin');
  //     }
  //     else if (!authUser.emailVerified) {
  //       $nuxt.$router.push('/verifyemail');
  //     }
  //     else if (!authUser.displayName) {
  //       $nuxt.$router.push('/adduserinfo');
  //     }
  //     else {
  //       $nuxt.$router.push('/home');
  //     }
  // },
  // fetchOnServer: false
});
</script>

<style>
</style>
