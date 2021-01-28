<template>
  <div>
    <h1><NuxtLink to="/home">Home Screen Vibes Homies</NuxtLink></h1>
    <button @click="goToLocationPost">Go to location posts</button>
  </div>
</template>

<script>
import { ref, defineComponent} from '@nuxtjs/composition-api';

export default defineComponent ({
  name: "Index",
  setup(props, context) {
    function goToLocationPost() {
      this.$router.push({path: '/locationPosts/Chicago'})
    }
    return { goToLocationPost };
  }

});
</script>

<style>

</style>
