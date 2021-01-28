<template>
  <div>
    <h1><NuxtLink to="userPosts/Sahil">User Page</NuxtLink></h1>
    <v-btn @click="goBack">Go back</v-btn>
  </div>
</template>

<script>
export default {
  methods: {
    goBack() {
      this.$router.push('/home');
    }
  }
}
</script>

<style>

</style>
