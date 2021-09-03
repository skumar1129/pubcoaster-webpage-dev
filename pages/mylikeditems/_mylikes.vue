<template>
  <v-app>
    <appbar data-app :nav="false" :user_nav="false" ></appbar>
      <div class="page">
      <v-container grid-list data-app>
        <v-row class="title-button">
        <v-col align="left">
          <h1 class="header" align="left">Your Liked {{shownItem}}s</h1>
        </v-col>
        <v-col align="right">
          <v-btn color="secondary" class="add-new" x-large align="right" @click="addANewLike"><v-icon large class="pr-3">mdi-heart</v-icon>Like a new {{shownItem}}</v-btn>
        </v-col>
        </v-row>
        <v-row v-if="!loading && responses.length==0" class="titlearea">
          <h2 class="mb-2"><i>No {{shownItem}}s Liked Yet :(</i></h2>
          <img src="../../assets/city_page.jpg" alt="City Page IMG" height="100%" width="100%">
        </v-row>
        <v-col v-else-if="!loading && responses.length!=0">
        <client-only placeholder="Loading....">
            <v-row v-for="(response, i) in responses" :key="i">
              <likeditem :response="response" :item="item.toLowerCase()" :mylikes="true" :newlike="true"></likeditem>
            </v-row>
        </client-only>
        </v-col>
      </v-container>
      <infinite-loading
        v-if="responses.length"
        spinner="spiral"
        @infinite="infinteScroll"
        data-app
      ><span slot="no-more"></span>
      </infinite-loading>
      </div>
      <v-snackbar multi-line v-model="snackFail" color="red" data-app>
      <div class="snack">
      {{ snackText }}
      </div>
    </v-snackbar>
     <v-overlay :value="loading">
      <div class="center-it">
          <v-progress-circular
            indeterminate
            color="black"
            size="110"
          ></v-progress-circular>
      </div>
      </v-overlay>
  </v-app>
</template>

<script lang='ts'>
import appbar from '~/components/appbar.vue';
import likeditem from '~/components/liked-item.vue';
import * as _ from 'lodash';
import { ref, defineComponent, computed } from '@nuxtjs/composition-api';

export default defineComponent({
  components: { appbar, likeditem },
  name: "MyLikes",
  middleware: 'authenticate',
  setup() {
    const responses = ref([]);
    const item = ref('');
    const user = ref('');
    const offset = ref(1);
    const snackFail = ref(false);
    const snackText = ref('');
    const loading = ref(true);

    const shownItem = computed(function(this: any) {
        if (this.item) {
          return this.item.charAt(0).toUpperCase() + this.item.slice(1);
        } else {
          return '';
        }
    })

    function addANewLike(this: any) {
        this.$router.push(`/newlikeditems/${this.item.toLowerCase()}`);
    }

    async function infinteScroll(this: any, $state: any) {
      offset.value++;
      try {
        const token = await this.$fire.auth.currentUser.getIdToken();
        this.$axios.setHeader('Authorization', `Bearer ${token}`);
        let data = await this.$axios.$get(`/userapi/${this.item.toLowerCase()}/${this.user}&offset=${offset.value}`);
        if (data.length > 0) {
          if (this.item.toLowerCase() == 'brand') {
            responses.value = _.union(responses.value, data.brands);
          } else if (this.item.toLowerCase() == 'drink') {
            responses.value = _.union(responses.value, data.drinks);
          } else {
            responses.value = _.union(responses.value, data.bars);
          }
          $state.loaded();
        } else {
          $state.loaded();
          $state.complete();
        }
      } catch (e) {
        this.snackText = 'Error: could not retrieve posts';
        this.snackFail = true;
      }
    }
    return { responses, user, infinteScroll, snackText, snackFail, item, shownItem, addANewLike, loading };
  },
  async fetch(this: any) {
    this.item = this.$route.params.mylikes;
    this.user = this.$store.state.user.displayName;
    try {
      this.$fire.auth.onAuthStateChanged(async (user: any) => {
        if (user) {
          const token = await this.$fire.auth.currentUser.getIdToken();
          this.$axios.setHeader('Authorization', `Bearer ${token}`);
          let data = await this.$axios.$get(`/userapi/${this.item.toLowerCase()}/${this.user}`);
          this.loading = false;
          if (this.item.toLowerCase() == 'brand') {
            this.responses = _.union(this.responses, data.brands);
          } else if (this.item.toLowerCase() == 'drink') {
            this.responses = _.union(this.responses, data.drinks);
          } else {
            this.responses = _.union(this.responses, data.bars);
          }
        } else {
          this.loading = false;
          this.snackText = 'Error: User authentication failed. Please sign in again.';
          this.snackFail = true;
          await this.$store.dispatch('signOut');
          this.$router.push('/signin');
        }
      });
    } catch (e) {
      this.loading = false;
      this.snackText = 'Error: could not retrieve posts';
      this.snackFail = true;
    }
  },
  fetchOnServer: false,
  watchQuery: ['offset']
});
</script>

<style scoped>
  .title-button {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
    margin-top: 2rem;
  }
  .page {
    background-color: white;
    color: black;
    font-size: 1.5em;
    height: 100%;
    width: 100%;
  }
  .header {
    font-family: fantasy;
    text-decoration: underline;
    font-size: 2.5em;
  }
  .titlearea {
    justify-content: center;
    font-family: "Lucida Console", "Courier New", monospace;
  }
  .snack {
    width: 100%;
    font-weight: bold;
    font-size: 1.5em;
    color: white;
    text-align: center;
    font-style: italic;
  }
  .add-new {
      width: 18em;
      font-weight: bold;
      font-size: .78em;
  }
</style>
