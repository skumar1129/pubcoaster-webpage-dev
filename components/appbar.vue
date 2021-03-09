<template>
  <div data-app>
    <v-app-bar color="red">

      <v-app-bar-nav-icon v-if="nav"></v-app-bar-nav-icon>

      <v-btn text @click="goHome">
        <v-toolbar-title class="title"><b><i>New App Name</i></b></v-toolbar-title>
      </v-btn>

      <v-spacer></v-spacer>

      <v-text-field
        placeholder="Search for users"
        v-model="user"
        class="mt-4 font-weight-medium"
        color="white"
      >
      </v-text-field>
      <v-btn icon @click="searchUser">
        <v-icon color="white">mdi-magnify</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <v-menu>
        <template v-slot:activator="{ on: onMenu }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: onToolTip }">
              <v-btn icon v-on="{ ...onMenu, ...onToolTip }">
                <v-icon color="white">mdi-city</v-icon>
              </v-btn>
            </template>
            <span>Locations</span>
          </v-tooltip>
        </template>
        <v-list>
            <v-list-item
              v-for="(item, index) in locations"
              :key="index"
            >
              <v-btn text @click="goToLocationPage(locations[index])">
                <v-list-item-title>{{ locations[index] }}</v-list-item-title>
              </v-btn>
            </v-list-item>
          </v-list>
      </v-menu>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            v-bind="attrs"
            v-on="on"
            @click="goToCreatePost"
          >
            <v-icon color="white">mdi-text-box-plus</v-icon>
          </v-btn>
        </template>
        <span>Create new post</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            v-bind="attrs"
            v-on="on"
            @click="goToUserPage"
          >
            <v-icon color="white">mdi-account-circle</v-icon>
          </v-btn>
        </template>
         <span>Go to your account</span>
      </v-tooltip>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon color="white">mdi-export</v-icon>
          </v-btn>
        </template>
        <span>Log out</span>
      </v-tooltip>


    </v-app-bar>

    <navdrawer :location="location" data-app v-if="nav"></navdrawer>
  </div>
</template>

<script lang='ts'>
import { ref, defineComponent} from '@nuxtjs/composition-api';
import navdrawer from '~/components/navdrawer.vue';

export default defineComponent({
  components: { navdrawer },
  name: "AppBar",
  props: {
    nav: {
      type: Boolean,
      required: false
    },
    location: {
      type: String,
      required: false
    }
  },
  setup() {
    const user = ref('');
    function goHome(this: any) {
      this.$router.push('/home')
    }
    function goToCreatePost(this: any) {
      this.$router.push('/createpost');
    }
    function goToUserPage(this: any){
      this.$router.push('/user')
    }
    function goToLocationPage(this: any, location: string) {
      this.$router.push(`/locationPosts/${location}`)
    }
    const locations = ['Chicago', 'Columbus', 'Denver', 'New York',
    'San Francisco', 'Orlando', 'Phoenix', 'Boston', 'Los Angeles', 'Washington DC'];
    function searchUser(this: any) {
      this.$router.push(`/userposts/${user.value}`);
    }
    // TODO: implement after we have user profiles and authenication
    // function logOut(){

    // }

    return { user, searchUser, goToUserPage, goHome, goToLocationPage, locations, goToCreatePost }
  }
});
</script>

<style>

</style>
