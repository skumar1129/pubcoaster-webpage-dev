<template>
  <v-app>
    <appbar data-app :nav="false" :user_nav="false"></appbar>
    <div class="page">
    <client-only>
        <h1 class="text-center mt-1 mb-1">Let us know what Google says about {{bar}} in {{location}}</h1>
    <v-form
      ref="form"
      lazy-validation
      class="form"
    >
      <v-select
        v-model="google_busyness_live"
        :items="google_busyness"
        :rules="[v => !!v || 'Google Busyness is required']"
        label="How busy did Google say it is right now?*"
        required
        dense
        color="white"
        class="field"
      ></v-select>
    <v-select
        v-model="google_busyness_avg"
        :items="google_busyness"
        label="How busy did Google it usually is?"
        dense
        color="white"
        class="field"
      ></v-select>
    <v-select
        v-model="live_busyness"
        :items="busyness"
        label="How busy do you think it is?"
        dense
        color="white"
        class="field"
      ></v-select>
      <v-row class="btn-row">
        <v-btn @click="cancel" color="red" class="ml-8 mt-5 mb-4">
          Not at Bar
        </v-btn>
        <v-btn @click="clear" color="red" class="mt-5 mb-4">
          Clear
        </v-btn>
        <v-btn @click="submit" color="red" class="mr-8 mt-5 mb-4">
          Submit
        </v-btn>
      </v-row>
    </v-form>
    </client-only>
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
    </div>
  </v-app>
</template>

<script lang='ts'>
import { ref, computed, defineComponent } from '@nuxtjs/composition-api';
export default defineComponent({
  name: "busyfeedback",
  middleware: 'authenticate',
  setup() {
    const snackFail = ref(false);
    const snackText = ref('');
    const snackSuccess = ref(false);
    const google_busyness_live = ref('');
    const google_busyness_avg = ref('');
    const live_busyness = ref('');
    const location = ref('');
    const bar = ref('');
    const neighborhood = ref('');
    const busyness = ['Dead AF', 'Some Crowd', 'Lively Enough', 'There Are Lines', "Can’t Move"];
    const google_busyness = ['1', '2', '3', '4', '5'];

    const user = computed(function(this: any) {
      return this.$store.state.user.displayName;
    });
    function cancel(this: any) {
      this.$router.push(`/locationPosts/${location.value}`);
    }
    function clear(this: any) {
      this.$refs.form.reset();
    }

    async function submit(this: any) {
        if(google_busyness_live.value == null || google_busyness_live.value == '') {
            this.snackText = 'Please fill out all required fields before submitting the form.';
            this.snackFail = true;
        } else {
          try {
            let postData = {
              'location': location.value,
              'neighborhood': neighborhood.value,
              'bar': bar.value,
              'google_average_busyness': google_busyness_avg.value,
              'google_live_busyness': google_busyness_live.value,
              'busyness': live_busyness.value
            };
            await this.$axios.$post(`/busyapi/barbusyness`, postData);
            this.snackText = 'Successfully submitted busyness feedback!';
            this.snackSuccess = true;
            this.$router.push('/home')
          }  catch (e) {
             this.snackText = 'Error: could not get submit busyness feedback. Check network connection.';
             this.snackFail = true;
          }
        }
    }

    return { user, submit, location, bar, neighborhood,
    cancel, clear, snackFail, snackText, snackSuccess, busyness,
    google_busyness_live, google_busyness_avg, live_busyness, google_busyness };
  },
  fetchOnServer: false,
  fetch(this: any) {
    let params = this.$route.params.busyfeedback.split('-');
    this.location = params[0];
    this.bar = params[1];
    this.neighborhood = params[2];
  }
});
</script>

<style scoped>
  .btn-row {
    display: flex;
    justify-content: space-around;
  }
  .page {
    background-color: grey;
    color: white;
    height: 100%;
    width: 100%;
    font-size: 1.1em;
  }
  .field {
    padding-left: 5em;
    padding-right: 5em;
    font-weight: bold;
    font-size: 1em;
    margin-top: 1em;
    color: black;
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
