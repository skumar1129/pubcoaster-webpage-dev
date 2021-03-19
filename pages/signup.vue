<template>
  <v-app>
    <v-main data-app class="page">
    <h1 class="heading">Sign Up</h1>
    <div class="sign-in">
      <v-btn @click="signIn" color="red">Back to Sign In Page</v-btn>
    </div>
    <v-form>
      <v-text-field
        v-model="email"
        label="Email"
        clearable
        color="white"
        class="field"
        @keypress.enter="signUp"
      ></v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        type="password"
        clearable
        color="white"
        @keypress.enter="signUp"
        class="field"
      ></v-text-field>
      <v-text-field
       v-model="confirm"
       label="Confirm Password"
       type="password"
       clearable
       color="white"
       class="field"
       @keypress.enter="signUp"
      ></v-text-field>
      <div class="sign-up">
        <v-btn @click="signUp" color="red">Sign Up</v-btn>
      </div>
    </v-form>
    <img src="../assets/sign_up.jpg" alt="Sign Up IMG" height="100%" width="100%" class="image">
    </v-main>
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
      if (email == null || email.value == '' || password == null || password.value == '') {
        alert('Please fill out all required fields before signing up.')
      } else {
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
    }
    return { email, password, confirm, signIn, signUp };
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
  .sign-in {
    text-align: center;
    margin-top: .7em;
  }
  .image {
    border: 1em solid black;
  }
  .field {
    font-weight: bold;
    width: 70%;
    color: black;
    margin-left: auto;
    margin-right: auto;
  }
  .sign-up {
    text-align: center;
    margin-top: .1em;
    margin-bottom: .8em;
  }
</style>
