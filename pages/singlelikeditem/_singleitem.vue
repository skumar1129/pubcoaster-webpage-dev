<template>
  <v-app>
    <appbar data-app :nav="false" :user_nav="false" ></appbar>
      <div class="page">
      <v-container grid-list data-app>
        <v-row class="ze-search-bar">
          <v-text-field
            :placeholder="'Search for ' + this.shownItem"
            :label="'Search for ' + this.shownItem"
            @keypress.enter="searchItem"
            color="white"
            v-model="searchedItem"
          >
          </v-text-field>
          <v-btn icon @click="searchItem" class="magnify">
            <v-icon color="white">mdi-magnify</v-icon>
          </v-btn>
        </v-row>
          <h1 class="header" align="middle">Results for {{shownLookingAtItem}}</h1>
        <v-row v-if="!loading && responses.length==0" class="titlearea">
          <h2 class="mb-2"><i>No Results for {{shownLookingAtItem}} :(</i></h2>
          <img src="../../assets/city_page.jpg" alt="City Page IMG" height="100%" width="100%">
          <v-btn color="secondary" class="add-new" x-large align="right" @click="newItem"><v-icon x-large>mdi-plus</v-icon>Add a new {{shownItem}}</v-btn>
        </v-row>
        <v-col v-else-if="!loading && responses.length!=0">
        <client-only placeholder="Loading....">
            <v-row v-for="(response, i) in responses" :key="i">
              <likeditem :response="response" :item="item.toLowerCase()" :mylikes="false" :newlike="true"></likeditem>
            </v-row>
        </client-only>
        </v-col>
      </v-container>
      <infinite-loading
        v-if="item=='bar' && responses.length"
        spinner="spiral"
        @infinite="infinteScroll"
        data-app
      ><span slot="no-more"></span>
      </infinite-loading>
      <v-row>
          <v-col align='middle'>
            <v-btn v-if="responses.length!=0" color="secondary" class="add-new-bottom" x-large @click="newItem"><v-icon x-large>mdi-plus</v-icon>Add a new {{shownItem}}</v-btn>
          </v-col>
      </v-row>
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
  name: "singleitem",
  middleware: 'authenticate',
  setup() {
    const responses = ref([]);
    const item = ref('');
    const user = ref('');
    const offset = ref(1);
    const snackFail = ref(false);
    const searchedItem = ref('');
    const lookingAtItem = ref('');
    const snackText = ref('');
    const loading = ref(true);

    function searchItem(this: any) {
        this.$router.push(`/singlelikeditem/${this.item.toLowerCase() + '-' + this.searchedItem}`);
    }
    function newItem(this: any) {
      this.$router.push(`/createnewitem/${this.item.toLowerCase()}`);
    }

    const shownItem = computed(function(this: any) {
        if (this.item) {
          return this.item.charAt(0).toUpperCase() + this.item.slice(1);
        } else {
          return '';
        }
    })

    const shownLookingAtItem = computed(function(this: any) {
        if (this.lookingAtItem) {
         return this.lookingAtItem.toLowerCase()
          .split(' ')
          .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ');
        } else {
          return '';
        }
    })

    async function infinteScroll(this: any, $state: any) {
      if (this.item.toLowerCase() == 'bar') {
        offset.value++;
        try {
            const token = await this.$fire.auth.currentUser.getIdToken();
            this.$axios.setHeader('Authorization', `Bearer ${token}`);
            let data = await this.$axios.$get(`/itemsapi/bar/${this.lookingAtItem}?user=${this.user}&offset=${offset.value}`);
            if (data.length > 0) {
            responses.value = _.union(responses.value, data);
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
    }

  
    return { newItem, offset, infinteScroll, responses, user, snackText, snackFail, item, shownItem, searchItem, searchedItem, lookingAtItem, shownLookingAtItem, loading };
  },
  async fetch(this: any) {
    let params = this.$route.params.singleitem.split('-');
    this.item = params[0];
    this.lookingAtItem = params[1];
    this.user = this.$store.state.user.displayName;
    try {
      this.$fire.auth.onAuthStateChanged(async (user: any) => {
        if (user) {
          const token = await this.$fire.auth.currentUser.getIdToken();
          this.$axios.setHeader('Authorization', `Bearer ${token}`);
          let data = await this.$axios.$get(`/itemsapi/${this.item.toLowerCase()}/${this.lookingAtItem}?user=${this.user}`)
          this.loading = false;
          this.responses = _.union(this.responses, data);
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
    margin-bottom: .3em;
    margin-top: 0;
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
      margin-top: 1.2em;
      margin-bottom: 1.7em;
      font-weight: bold;
      font-size: .78em;
  }
  .ze-search-bar {
    color: white;
    border: black solid .3em;
    border-radius: 1em;
    font-weight: bold;
    background-color: darkgrey;
    padding-right: .5em;
    padding-left: .5em;
    padding-top: .5em;
    padding-bottom: .5em;
    margin-bottom: 1.4em;
    margin-top: 2em;
  }
  .magnify {
    margin-top: .9em;
    margin-right: .4em;
  }
  .add-new-bottom {
      width: 18em;
      margin-top: 1em;
      margin-bottom: 1.7em;
      font-weight: bold;
      font-size: .78em;
  }
</style>
