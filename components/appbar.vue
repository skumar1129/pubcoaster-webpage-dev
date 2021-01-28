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
      >
      </v-text-field>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-city</v-icon>
          </v-btn>
        </template>
        <span>Locations</span>
      </v-tooltip>

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
    function goHome(this: any) {
      this.$router.push('/home')
    }
    function goToUserPage(this: any){
      this.$router.push('/user')
    }
    // TODO: implement after we have user profiles and authenication
    // function searchUser() {

    //}
    // function logOut(){

    // }

    return { goToUserPage, goHome }
  }
});
</script>

<style>

</style>
