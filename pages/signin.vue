<template>
  <v-app>
    <h1>Welcome to Knew Barz!</h1>
    <h3>Sign in or sign up and start posting!</h3>
    <v-btn @click="signUp" color="red">Go to Sign Up Page</v-btn>
    <v-form>
      <v-text-field
        v-model="email"
        label="Email"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
      ></v-text-field>
      <v-row>
        <v-btn @click="forgotPassword" color="red">Forgot Password</v-btn>
        <v-btn @click="signIn" color="red">Sign In</v-btn>
      </v-row>
    </v-form>
    <img src="../assets/sign_in.jpg" alt="Sign In Page IMG">
  </v-app>
</template>

<script lang='ts'>
import { ref, defineComponent} from '@nuxtjs/composition-api';
export default defineComponent({
  name: 'SignIn',
  setup() {
    const email = ref('');
    const password = ref('');
    function forgotPassword(this: any) {
      this.$router.push('/forgotpassword');
    }
    function signUp(this: any) {
      this.$router.push('/signup');
    }
    async function signIn(this: any) {
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
           this.$router.push('/home');
         }
       })
       .catch((e: Error) => console.log(e));
      } catch (e) {
        console.log(e);
      }
    }
    return { email, password, forgotPassword, signUp, signIn };
  }
});
</script>

<style>
</style>
