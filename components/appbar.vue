<template>
  <div data-app>
    <v-app-bar>

      <v-btn text @click="goHome">
        <v-toolbar-title>New App Name</v-toolbar-title>
      </v-btn>

      <v-spacer></v-spacer>

      <v-text-field
        label="Users"
        placeholder="Search for users"
        v-model="user"
      >
      </v-text-field>
      <v-btn icon @click="searchUser">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <v-menu>
        <template v-slot:activator="{ on: onMenu }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on: onToolTip }">
              <v-btn icon v-on="{ ...onMenu, ...onToolTip }">
                <v-icon>mdi-city</v-icon>
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
            @click="goToUserPage"
          >
            <v-icon>mdi-account-circle</v-icon>
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
            <v-icon>mdi-export</v-icon>
          </v-btn>
        </template>
        <span>Log out</span>
      </v-tooltip>


    </v-app-bar>
  </div>
</template>

<script lang='ts'>
import { ref, defineComponent} from '@nuxtjs/composition-api';

export default defineComponent({
  name: "AppBar",
  setup() {
    const user = ref('');
    function goHome(this: any) {
      this.$router.push('/home')
    }
    function goToUserPage(this: any){
      this.$router.push('/user')
    }
    function goToLocationPage(this: any, location: string) {
      this.$router.push(`/locationPosts/${location}`)
    }
    const locations = ['Chicago', 'Columbus', 'Denver', 'New York',
    'San Francisco', 'Orlando', 'Phoenix', 'Boston', 'Los Angeles']
    function searchUser(this: any) {
      this.$router.push(`/userposts/${user.value}`);
    }
    // TODO: implement after we have user profiles and authenication
    // function logOut(){

    // }

    return { user, searchUser, goToUserPage, goHome, goToLocationPage, locations }
  }
});
</script>

<style>

</style>
