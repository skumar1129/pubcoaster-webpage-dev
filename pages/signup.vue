<template>
  <v-app>
    <h1>Sign Up</h1>
    <v-form>
      <v-btn @click="signIn" color="red">Back to Sign In Page</v-btn>
      <v-text-field
        v-model="email"
        label="Email"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
      ></v-text-field>
      <v-text-field
       v-model="confirm"
       label="Confirm Password"
       type="password"
      ></v-text-field>
      <v-btn @click="signUp" color="red">Sign Up</v-btn>
    </v-form>
    <img src="../assets/sign_up.jpg" alt="Sign Up IMG">
  </v-app>
</template>

<script lang='ts'>
import { ref, defineComponent} from '@nuxtjs/composition-api';
// import firebaseApp from '~/plugins/firebase';
export default defineComponent({
  name: 'SignUp',
  setup() {
    const email = ref('');
    const password = ref('');
    const confirm = ref('');
    function signIn(this: any) {
      this.$router.push('/signin');
    }
    async function signUp(this: any) {
      if (password.value === confirm.value) {
        this.$store.dispatch('signUp', { email: email.value, password: password.value })
          .then(() => {
            this.$router.push('/verifyemail');
          })
          .catch((e: any )=> console.log(e));
      } else {
        console.log('no matchy');
      }
    }
    return { email, password, confirm, signIn, signUp };
  }
});
</script>

<style>
</style>
