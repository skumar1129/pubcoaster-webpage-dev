<template>
  <div>
    <h1>User Page</h1>
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
