<template>
  <v-app>
    <v-main data-app class="page">
      <h1 class="heading">Welcome to Knew Barz!</h1>
      <h3 class="heading">Sign in or sign up and start posting!</h3>
      <div class="sign-up">
        <v-btn @click="signUp" color="red" class="mt-3">Go to Sign Up Page</v-btn>
      </div>
    <v-form>
      <v-text-field
        v-model="email"
        label="Email"
        class="field"
        clearable
        color="white"
        @keypress.enter="signIn"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        class="field"
        clearable
        @keypress.enter="signIn"
        color="white"
      ></v-text-field>
      <v-row class="btn-row">
        <v-btn @click="forgotPassword" color="red" class="ml-10">Forgot Password</v-btn>
        <v-btn @click="signIn" color="red" class="mr-10">Sign In</v-btn>
      </v-row>
    </v-form>
    <img src="../assets/sign_in.jpg" alt="Sign In Page IMG" height="100%" width="100%" class="image">
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
export default defineComponent({
  name: 'SignIn',
  setup() {
    const email = ref('');
    const password = ref('');
    const snackFail = ref(false);
    const snackText = ref('');
    const snackSuccess = ref(false);
    function forgotPassword(this: any) {
      this.$router.push('/forgotpassword');
    }
    function signUp(this: any) {
      this.$router.push('/signup');
    }
    async function signIn(this: any) {
      if (email == null || email.value == '' || password == null || password.value == '') {
        this.snackText = 'Please fill out all required fields before submitting the form.';
        this.snackFail = true;
      } else {
        try {
        this.$store.dispatch('signIn', { email: email.value, password: password.value })
        .then(() => {
          const user = this.$store.getters.user;
          if (!user.emailVerified) {
            this.$router.push('/verifyemail');
          }
          else if (!user.displayName) {
            this.$router.push('/adduserinfo');
          }
          else {
             this.snackText = 'Successfully signed in!';
            this.snackSuccess = true;
            this.$router.push('/home');
          }
        })
        .catch((e: Error) => {
          //this one takes care of Firebase auth errors
          this.snackText = e.message;
          this.snackFail = true;
          console.log(e.message);
        });
        } catch (e) {
          //this one takes care of all other errors
           this.snackText = 'Error: could not sign in. Please check your network connection';
          this.snackFail = true;
        }
      }
    }
    return { email, password, forgotPassword, signUp, signIn, snackFail, snackText, snackSuccess };
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
  }
  .field {
    font-weight: bold;
    width: 65%;
    color: black;
    margin-left: auto;
    margin-right: auto;
  }
  .sign-up {
    text-align: center;
  }
  .image {
    border: 1em solid black;
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
