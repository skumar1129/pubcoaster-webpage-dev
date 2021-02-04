<template>
  <div>
  <h1>{{this.$route.params.location}}</h1>
  <v-spacer> </v-spacer>
  <post v-bind:currentUser="String('helga')" v-bind:response="{
      createdBy: 'helga',
      //picLink: 'testing',
      bar: 'Cheers',
      description: 'Litty mc titty',
      rating: 10,
      anonymous: false,
      location: 'Chicago',
      neighborhood: 'Niles',
      comments: [{createdBy: 'helga', text: 'heyyy girl'}],
      createdAt: '2021-01-27 20:26:25',
      likes: 1
  }"></post>
  </div>
</template>

<script>
import post from '~/components/post.vue';

export default {
  components: { post },
  name: "LocationPosts"
}
</script>

<style>

</style>
