<template>
  <v-app>
    <v-main class="page" data-app>
    <h1 class="heading">Send a verification email to your account and sign back in once complete, or go back to sign up and register a new email</h1>
    <v-form>
      <v-row class="btn-row">
        <v-btn @click="resendEmail" color="red" rounded class="ml-12">Resend Email</v-btn>
        <v-btn @click="goToSignIn" color="red" rounded>Go to sign in</v-btn>
        <v-btn @click="goToSignUp" color="red" rounded class="mr-12">Go back to sign up</v-btn>
      </v-row>
    </v-form>
    </v-main>
  </v-app>
</template>

<script lang='ts'>
import { ref, defineComponent} from '@nuxtjs/composition-api';
export default defineComponent({
  name: 'VerifyEmail',
  setup() {
    function goToSignUp(this: any) {
      this.$router.push('/signup');
    }
    function goToSignIn(this: any) {
      this.$router.push('/signin');
    }
    async function resendEmail(this: any) {
      try {
        await this.$fire.auth.currentUser.sendEmailVerification();
      } catch (e) {
        console.log(e);
      }
    }
    return { goToSignUp, goToSignIn, resendEmail };
  }
});
</script>

<style>
  .heading {
    text-align: center;
    padding: .15em;
    justify-content: center;
    color: white;
    font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
  }
  .btn-row {
    display: flex;
    justify-content: space-around;
    margin-top: .8em;
    margin-bottom: 1em;
  }
  .page {
    background-color: grey;
    color: white;
    font-size: 1.5em;
  }
  .sign-in {
    text-align: center;
    margin-top: .7em;
  }
  .field {
    width: 80%;
    font-weight: bold;
    margin-left: auto;
    margin-right: auto;
  }
</style>
