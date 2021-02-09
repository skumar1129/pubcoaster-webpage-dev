<template>

</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api';
import feedpost from '@/components/feed-post.vue';

export default defineComponent({
  name: 'UserPosts',
  components: { feedpost },
  setup() {

  },
  async fetch() {

  }
});
</script>

<style>

</style>
