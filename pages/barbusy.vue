<template>
  <v-app>
    <appbar data-app :nav="false" :user_nav="false"></appbar>
    <div class="page">
    <client-only>
        <h1 class="text-center mt-1 mb-1">Check out which bars are poppin'</h1>
    <v-form
      ref="form"
      lazy-validation
      class="form"
    >
      <v-select
        v-model="locationType"
        :items="locationTypes"
        :rules="[v => !!v || 'Location Type is required']"
        label="Location Type*"
        required
        dense
        color="white"
        class="field"
      ></v-select>
      <v-select
        v-if="locationType=='College'"
        v-model="location"
        :items="locationsCollege"
        :rules="[v => !!v || 'Location is required']"
        label="Location*"
        required
        dense
        color="white"
        class="field"
      ></v-select>
       <v-select
        v-else-if="locationType=='City'"
        v-model="location"
        :items="locations"
        :rules="[v => !!v || 'Location is required']"
        label="Location*"
        required
        dense
        color="white"
        class="field"
      ></v-select>
      <v-select
        v-else
        v-model="location"
        :items="empty"
        :rules="[v => !!v || 'Location is required']"
        label="Location*"
        required
        dense
        color="white"
        class="field"
      ></v-select>
      <v-text-field
        v-model="bar"
        label="Bar*"
        :rules="[v => !!v || 'Bar is required']"
        required
        dense
        @keypress.enter="submit"
        color="white"
        class="field"
      ></v-text-field>
      <v-text-field
        v-model="neighborhood"
        label="Neighborhood"
        dense
        color="white"
        @keypress.enter="submit"
        class="field"
      ></v-text-field>
      <v-row class="btn-row">
        <v-btn @click="cancel" color="red" class="ml-8 mt-5 mb-4">
          Back to Feed
        </v-btn>
        <v-btn @click="google" color="red" class="ml-8 mt-5 mb-4">
          Check Google
        </v-btn>
        <v-btn @click="pubcoasters" color="red" class="mr-8 mt-5 mb-4">
          Check Pubcoasters
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
    <client-only>
      <v-overlay :value="spinner">
        <div class="center-it">
          <v-progress-circular
            indeterminate
            color="white"
            size="110"
          ></v-progress-circular>
        </div>
      </v-overlay>
      <v-dialog data-app v-model="dialog" width="700">
              <v-card color="white">
                  <h1 class="header">Busyness for {{bar}} in {{location}}</h1>
                  <h3 class="no-follow" v-if="pubcoasters_busyness_live!='No Information For This Time' &&  pubcoasters_busyness_live!='Could Not Find Bar'">Live Busyness: <i class="no-bold">{{pubcoasters_busyness_live}}</i></h3>
                  <h3 class="no-follow" v-else>Live Busyness: <i class="no-bold">No Available Data</i></h3>
                  <h3 class="no-follow-1" v-if="pubcoasters_busyness_avg!='No Information For This Time' &&  pubcoasters_busyness_avg!='Could Not Find Bar'">Average Busyness: <i class="no-bold">{{pubcoasters_busyness_avg}}</i></h3>
                  <h3 class="no-follow-1" v-else>Average Busyness: <i class="no-bold">No Available Data</i></h3>
              </v-card>
        </v-dialog>
      </client-only>
  </v-app>
</template>

<script lang='ts'>
import { ref, computed, defineComponent } from '@nuxtjs/composition-api';
export default defineComponent({
  name: "barbusyfeed",
  middleware: 'authenticate',
  setup() {
    const locations = ['Chicago', 'Columbus', 'Denver',
    'New York', 'San Francisco', 'Orlando', 'Phoenix',
    'Boston', 'Los Angeles', 'Washington DC'];
    const locationsCollege = ['Ohio State', 'University of Michigan',
    'Michigan State', 'Penn State', 'University of Illinois', 'University of Wisconsin'];
    const empty:String[] = [];
    const locationTypes = ['College', 'City'];
    const location = ref('');
    const locationType = ref('');
    const bar = ref('');
    const neighborhood = ref('');
    const snackFail = ref(false);
    const snackText = ref('');
    const snackSuccess = ref(false);
    const pubcoasters_busyness_live = ref('');
    const pubcoasters_busyness_avg = ref('');
    const dialog = ref(false);
    const spinner = ref(false);


    const user = computed(function(this: any) {
      return this.$store.state.user.displayName;
    });

    function cancel(this: any) {
      this.$router.push('/feed');
    }

    async function google(this: any) {
      if (bar.value == null || bar.value == '') {
        this.snackText = 'Please fill out all required fields before submitting the form.';
        this.snackFail = true;
      } else {
        this.bar = this.bar.toLowerCase()
          .split(' ')
          .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ');
        if (neighborhood.value == '' || neighborhood.value == null) {
          window.open(`http://google.com/search?q=${location.value}+${bar.value}`);
        } else {
          window.open(`http://google.com/search?q=${location.value}+${bar.value}+${neighborhood.value}`);
        }
        this.$router.push(`/busyfeedback/${location.value + '-' + bar.value + '-' + neighborhood.value}`);
      }
    }

    async function pubcoasters(this: any) {
      if (bar.value == null || bar.value == '') {
        this.snackText = 'Please fill out all required fields before submitting the form.';
        this.snackFail = true;
      } else {
        try {
          this.spinner = true;
          this.bar = this.bar.toLowerCase()
            .split(' ')
            .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
          const token = await this.$fire.auth.currentUser.getIdToken();
          this.$axios.setHeader('Authorization', `Bearer ${token}`);
          let postData = {
            'location': location.value,
            'neighborhood': neighborhood.value,
            'bar': bar.value
          };
          let live_data = await this.$axios.$post(`/busyapi/live/barbusyness`, postData);
          let avg_data = await this.$axios.$post(`/busyapi/average/barbusyness`, postData);
          this.pubcoasters_busyness_live = live_data['busyness'];
          this.pubcoasters_busyness_avg = avg_data['busyness']
          this.spinner = false;
          this.dialog = true;
        } catch (e) {
            this.snackText = 'Error: could not get busyness. Check network connection.';
            this.snackFail = true;
        }
      }
    }


    return { user, location, neighborhood, locations, spinner, cancel,
    snackFail, snackText, snackSuccess, bar, dialog, empty, pubcoasters_busyness_avg,
    locationTypes, locationType, locationsCollege, pubcoasters, google, pubcoasters_busyness_live };
  },
  fetchOnServer: false
});
</script>

<style scoped>
  .btn-row {
    display: flex;
    justify-content: space-evenly;
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
  .no-follow {
      text-align: center;
      font-size: 1.25em;
      margin-bottom: auto;
      padding-top: 1.2em;
      padding-bottom: .75em;
      color: black;
  }
  .no-follow-1 {
      text-align: center;
      font-size: 1.25em;
      margin-top: auto;
      margin-bottom: auto;
      padding-top: 1.5em;
      padding-bottom: 2em;
      color: black;
  }
  .header {
    font-family: fantasy;
    text-decoration: underline;
    color: black;
    padding-top: .75em;
    text-align: center;
  }
  .no-bold {
    font-weight: normal;
  }
</style>
