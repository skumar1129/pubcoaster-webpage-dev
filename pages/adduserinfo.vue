<template>
  <v-app>
    <h1>Hold up, fill out a User Profile</h1>
    <v-form>
      <v-text-field
        v-model="username"
        label="Username*"
      ></v-text-field>
      <v-text-field
        v-model="fName"
        label="First Name*"
      ></v-text-field>
      <v-text-field
        v-model="lName"
        label="Last Name*"
      ></v-text-field>
      <v-file-input
        label="Profile Picture Picture (optional)"
        prepend-icon="mdi-camera"
        class="field"
        color="black"
      ></v-file-input>
      <v-row>
        <v-btn @click="signIn" color="red">Back to Sign In</v-btn>
        <v-btn @click="submit" color="red">Submit</v-btn>
      </v-row>
    </v-form>
  </v-app>
</template>

<script lang='ts'>
import { ref, defineComponent} from '@nuxtjs/composition-api';
// import firebaseApp from '~/plugins/firebase';
export default defineComponent({
  name: 'AddUserInfo',
  setup() {
    const username = ref('');
    const fName = ref('');
    const lName = ref('');
    function signIn(this: any) {
      this.$router.push('/signin');
    }
    async function submit(this: any) {
      try {
        // let email = firebaseApp.auth().currentUser?.email;
        let email = '';
        let fullName = `${fName} ${lName}`;
        let reqBody = {
          username: username.value,
          email: email,
          firstName: fName,
          lastName: lName,
          fullName: fullName,
          picLink: ''
        };
        await this.$axios.$post('http://localhost:8080/user', reqBody);
      } catch (e) {
        console.log(e);
      }
      // await firebaseApp.auth().currentUser?.updateProfile({ displayName: username.value });
      this.$router.push('/home');
    }
    return { username, fName, lName, signIn, submit };
  }
});
</script>

<style>
</style>
