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
  name: 'VerifyEmail',
  setup() {
    const snackFail = ref(false);
    const snackText = ref('');
    const snackSuccess = ref(false);
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
         this.snackText = 'Error: could not resend email verification. Please check your network connection.';
        this.snackFail = true;
      }
    }
    return { goToSignUp, goToSignIn, resendEmail, snackFail, snackText, snackSuccess };
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
    height: 100%;
    width: 100%;
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
  .snack {
    width: 100%;
    font-weight: bold;
    font-size: 1.5em;
    color: white;
    text-align: center;
    font-style: italic;
  }
</style>
