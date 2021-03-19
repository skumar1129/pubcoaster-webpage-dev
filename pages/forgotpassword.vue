<template>
  <v-app>
    <h1>Fill out the information to reset your password</h1>
    <v-text-field
      v-model="email"
      label="Email"
    ></v-text-field>
    <v-row>
      <v-btn @click="signIn" color="red">Back to sign in</v-btn>
      <v-btn @click="sendEmail" color="red">Submit</v-btn>
    </v-row>
  </v-app>
</template>

<script lang='ts'>
import { ref, defineComponent} from '@nuxtjs/composition-api';
export default defineComponent({
  name: 'ForgotPassword',
  setup() {
    const email = ref('');
    function signIn(this: any) {
      this.$router.push('/signin');
    }
    async function sendEmail(this: any) {
      try {
        await this.$fire.auth.sendPasswordResetEmail(email.value);
      } catch (e) {
        console.log(e);
      }
    }
    return { email, signIn, sendEmail };
  }
});
</script>

<style>
</style>
