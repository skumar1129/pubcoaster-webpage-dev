<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant.sync="mini"
    absolute
    permanent
    color="red"
    data-app
  >
    <v-list-item>
      <v-list-item-icon>
        <v-icon>mdi-account-search</v-icon>
      </v-list-item-icon>
      <v-list-item-title>Search by:  </v-list-item-title>
      <v-btn
        icon
        @click.stop="mini = !mini"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>
    <v-divider></v-divider>
    <v-list dense>

      <v-list-item>
        <v-list-item-icon>
          <v-icon medium class="mt-8">mdi-beer</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-text-field v-model="bar" placeholder="Bar"></v-text-field>
        </v-list-item-content>
        <v-btn icon @click="filterByBar">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-list-item>

      <!-- <v-divider> </v-divider> -->

      <v-list-item>
        <v-list-item-icon>
          <v-icon medium class="mt-8">mdi-account-question</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-text-field v-model="user" placeholder="User"></v-text-field>
        </v-list-item-content>
        <v-btn icon @click="filterByUser">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-list-item>

      <!-- <v-divider> </v-divider> -->

      <v-list-item>
        <v-list-item-icon>
          <v-icon medium class="mt-8">mdi-home-search</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-text-field v-model="nbhood" placeholder="Neighborhood"></v-text-field>
        </v-list-item-content>
        <v-btn icon @click="filterByNbhood">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang='ts'>
import { ref, defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: 'NavDrawer',
  props: {
    location: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const drawer = ref(true);
    const mini = ref(true);
    const bar = ref('');
    const user = ref('');
    const nbhood = ref('');
    function filterByNbhood(this: any) {
      this.$router.push(`/locnbhoodposts/${props.location + '-' + nbhood.value}`);
    }
    function filterByUser(this: any) {
      this.$router.push(`/locuserposts/${props.location + '-' + user.value}`);
    }
    function filterByBar(this: any) {
      this.$router.push(`/locbarposts/${props.location + '-' + bar.value}`);
    }
    return { drawer, mini, bar, user, nbhood,
    filterByNbhood, filterByUser, filterByBar };
  }

});
</script>

<style>
  .display {
    display: inline-block;
  }
</style>
