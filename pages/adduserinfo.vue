<template>
  <v-app>
    <v-main data-app class="page">
    <h1 class="heading">Hold up, fill out a User Profile</h1>
    <v-form class="form">
      <v-text-field
        v-model="username"
        label="Username*"
        color="white"
        clearable
        class="field"
        @keypress.enter="submit"
      ></v-text-field>
      <v-text-field
        v-model="fName"
        label="First Name*"
        color="white"
        clearable
        class="field"
        @keypress.enter="submit"
      ></v-text-field>
      <v-text-field
        v-model="lName"
        label="Last Name*"
        color="white"
        clearable
        class="field"
        @keypress.enter="submit"
      ></v-text-field>
      <v-file-input
        label="Profile Picture Picture (optional)"
        prepend-icon="mdi-camera"
        class="field"
        color="white"
        accept="image/*"
        v-model="picFile"
      ></v-file-input>
      <v-row class="btn-row">
        <v-btn @click="signIn" color="red" class="mt-6 mb-6">Back to Sign In</v-btn>
        <v-btn @click="submit" color="red" class="mt-6 mb-6">Submit</v-btn>
      </v-row>
    </v-form>
    <v-snackbar multi-line v-model="snackFail" color="red">
      <div class="snack">
      {{ snackText }}
      </div>
    </v-snackbar>
    <v-snackbar multi-line v-model="snackSuccess" color="green">
      <div class="snack">
      {{ snackText }}
      </div>
    </v-snackbar>
    </v-main>
  </v-app>
</template>

<script lang='ts'>
import { ref, defineComponent} from '@nuxtjs/composition-api';
import { v4 } from 'uuid';

export default defineComponent({
  name: 'AddUserInfo',
  setup() {
    const username = ref('');
    const fName = ref('');
    const lName = ref('');
    const snackFail = ref(false);
    const snackText = ref('');
    const snackSuccess = ref(false);
    const picFile = ref();

    function signIn(this: any) {
      this.$router.push('/signin');
    }
    async function submit(this: any) {
      if (fName == null || fName.value == '' || lName == null || lName.value == '' || username == null || username.value == '') {
        this.snackText = 'Please fill out all required fields before submitting the form.';
        this.snackFail = true;
      } else {
        let picLink = '';
        if (picFile.value) {
          try {
            let id = v4();
            let storageRef = this.$fire.storage.ref().child(`prof_pics/${username.value}-${id}`);
            await storageRef.put(picFile.value);
            picLink = await storageRef.getDownloadURL();
            let email = this.$store.state.user.email;
            let fullName = `${fName.value} ${lName.value}`;
            let reqBody = {
              username: username.value,
              email: email,
              firstName: fName.value,
              lastName: lName.value,
              fullName: fullName,
              picLink: picLink
            };
            const token = await this.$fire.auth.currentUser.getIdToken();
            this.$axios.setHeader('Authorization', `Bearer ${token}`);
            await this.$axios.$post('/userapi/user', reqBody);
            await this.$store.dispatch('setUserName', { displayName: username.value, profPicUrl: picLink });
            this.snackText = 'Successfully created profile!';
            this.snackSuccess = true;
            //TODO: do I put a wait call here?
            this.$router.push('/home');
          } catch (e) {
            this.snackText = 'Error: could not create user. Check network connection.';
            this.snackFail = true;
          }
        }
        else {
          try {
            let email = this.$store.state.user.email;
            let fullName = `${fName.value} ${lName.value}`;
            let reqBody = {
              username: username.value,
              email: email,
              firstName: fName.value,
              lastName: lName.value,
              fullName: fullName,
              picLink: picLink
            };
            const token = await this.$fire.auth.currentUser.getIdToken();
            this.$axios.setHeader('Authorization', `Bearer ${token}`);
            await this.$axios.$post('/userapi/user', reqBody);
            await this.$store.dispatch('setUserName', { displayName: username.value, profPicUrl: picLink });
            this.snackText = 'Successfully created profile!';
            this.snackSuccess = true;
            //TODO: do I put a wait call here?
            this.$router.push('/home');
          } catch (e) {
            this.snackText = 'Error: could not create user. Check network connection.';
            this.snackFail = true;
          }
        }
      }
    }
    return { username, fName, lName, signIn, submit, snackFail, snackText, snackSuccess, picFile };
  }
});
</script>

<style>
  .btn-row {
    display: flex;
    justify-content: space-around;
    margin-top: .2em;
    margin-bottom: 1em;
  }
  .heading {
    text-align: center;
    padding: .15em;
    justify-content: center;
    color: white;
    font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  }
  .page {
    background-color: grey;
    color: white;
    font-size: 1.5em;
  }
  .field {
    font-weight: bold;
    width: 65%;
    margin-left: auto;
    margin-right: auto;
  }
  .form {
    padding: 1em;
    border: .355em solid black;
    margin-left: .5em;
    margin-right: .5em;
  }
  .snack {
    width: 100%;
    font-weight: bold;
    font-size: 1.5em;
    color: white;
    text-align: center;
    font-style: italic;
  }
</style>
