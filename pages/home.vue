<template>
  <div>
    <appbar></appbar>
  </div>
</template>

<script>
import { ref, defineComponent} from '@nuxtjs/composition-api';
import appbar from '~/components/appbar.vue';
import AppBar from '../components/appbar';

export default defineComponent({
  components: { appbar },
  name: "Home"
});
</script>

<style>

</style>
