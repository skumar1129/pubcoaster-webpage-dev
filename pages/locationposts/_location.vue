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
      uuid: '681b2a2c-fe0a-4c4a-a7ad-7bea12477193',
      anonymous: false,
      location: 'Chicago',
      neighborhood: 'Niles',
      comments: [{createdBy: 'helga', text: 'heyyy girl', createdAt: 'Mon, 01 Feb 2021 21:21:29 GMT', uuid: 'e416cad9-20fb-4d97-8829-11959d6436d3'}],
      createdAt: 'Mon, 01 Feb 2021 21:21:29 GMT',
      numLikes: 1
  }"></post>
  <v-spacer></v-spacer>
  <feedpost v-bind:currentUser="String('helga')" v-bind:response="{
      createdBy: 'helga',
      //picLink: 'testing',
      bar: 'Cheers',
      description: 'Litty mc titty',
      rating: 5,
      anonymous: false,
      location: 'Chicago',
      uuid: '681b2a2c-fe0a-4c4a-a7ad-7bea12477193',
      //neighborhood: 'Park Ridge',
      numComments: 2,
      createdAt: 'Mon, 01 Feb 2021 21:21:29 GMT',
      numLikes: 1
  }"></feedpost>
  <editpost v-bind:currentUser="String('helga')" v-bind:response="{
      createdBy: 'helga',
      //picLink: 'testing',
      bar: 'Shakou',
      description: 'Litty mc titty',
      rating: 7,
      anonymous: false,
      uuid: '681b2a2c-fe0a-4c4a-a7ad-7bea12477193',
      location: 'Chicago',
      neighborhood: 'Park Ridge',
      comments: [{createdBy: 'helga', text: 'heyyy girl', createdAt: 'Mon, 01 Feb 2021 21:21:29 GMT', uuid: 'e416cad9-20fb-4d97-8829-11959d6436d3'}],
      createdAt: 'Mon, 01 Feb 2021 21:21:29 GMT',
      numLikes: 1
  }"></editpost>
  <v-spacer></v-spacer>
  </feedpost>
  </div>
</template>

<script>
import post from '~/components/post.vue';
import feedpost from '~/components/feed-post.vue';
import editpost from '~/components/edit-post.vue';

export default {
  components: { post, feedpost, editpost },
  name: "LocationPosts"
}
</script>

<style>

</style>
