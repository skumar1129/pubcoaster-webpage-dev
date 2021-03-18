<template>
  <v-app>
    <img src="../assets/splash_screen.jpg" alt="Splash Screen IMG">
  </v-app>
</template>

<script>
import { onMounted ,computed, defineComponent } from '@nuxtjs/composition-api';
export default defineComponent ({
  name: "Index",
  setup() {
    const user = computed(() => {
      return $nuxt.$store.state.user;
    });
    onMounted(() => {
      if (!user.value) {
        console.log('yo');
        $nuxt.$router.push('/signin');
      }
      else if (!user.value.emailVerified) {
        $nuxt.$router.push('/verifyemail');
      }
      else if (!user.value.displayName) {
        $nuxt.$router.push('/adduserinfo');
      }
      else {
        $nuxt.$router.push('/home');
      }
    });
  },
});
</script>

<style>
</style>
