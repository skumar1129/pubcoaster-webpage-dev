<template>
  <v-app>
    <v-main class="page" data-app>
    <h1 class="heading">Fill out the information to reset your password</h1>
    <v-text-field
      v-model="email"
      label="Email"
      class="field"
      color="white"
      @keypress.enter="sendEmail"
    ></v-text-field>
    <v-row class="btn-row">
      <v-btn @click="signIn" color="red" class="ml-8">Back to sign in</v-btn>
      <v-btn @click="sendEmail" color="red" class="mr-8">Submit</v-btn>
    </v-row>
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
  name: 'ForgotPassword',
  setup() {
    const email = ref('');
    const snackFail = ref(false);
    const snackText = ref('');
    const snackSuccess = ref(false);
    function signIn(this: any) {
      this.$router.push('/signin');
    }
    async function sendEmail(this: any) {
      if (email == null || email.value== '') {
        this.snackText = 'Please fill out all required fields before submitting the form.';
        this.snackFail = true;
        alert('Please fill out all required fields before submitting the form.')
      } else {
        try {
          await this.$fire.auth.sendPasswordResetEmail(email.value);
          this.snackText = 'Successfully sent email! Check your email to reset your password.';
          this.snackSuccess = true;
        } catch (e) {
          this.snackText = 'Error sending email verfication. Please check your network connection.';
          this.snackFail = true;
          console.log(e);
        }
      }
    }
    return { email, signIn, sendEmail, snackSuccess, snackFail, snackText };
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
.page {
  background-color: grey;
}
.field {
    font-weight: bold;
    width: 70%;
    color: black;
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
