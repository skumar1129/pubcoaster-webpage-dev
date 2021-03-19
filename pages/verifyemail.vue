<template>
  <v-app>
    <h1>Send a verification email to your account and sign back in once complete, or go back to sign up and register a new email</h1>
    <v-form>
      <v-btn @click="goToSignUp" color="red">Go back to sign up'</v-btn>
      <v-text-field
        v-model="email"
        label="Email"
      ></v-text-field>
      <v-row>
        <v-btn @click="resendEmail" color="red">Resend Email'</v-btn>
        <v-btn @click="goToSignIn" color="red">Go to sign in'</v-btn>
      </v-row>
    </v-form>
  </v-app>
</template>

<script lang='ts'>
import { ref, defineComponent} from '@nuxtjs/composition-api';
export default defineComponent({
  name: 'VerifyEmail',
  setup() {
    const email = ref('');
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
    return { email, goToSignUp, goToSignIn, resendEmail };
  }
});
</script>

<style>
</style>
