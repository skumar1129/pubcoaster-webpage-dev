<template>
  <v-app>
    <appbar data-app :nav="false" :user_nav="false"></appbar>
    <div class="page">
    <client-only>
        <h1 class="text-center mt-1 mb-1">Check out which Bars are Poppin'</h1>
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
        items=""
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
    const locationTypes = ['College', 'City'];
    const location = ref('');
    const locationType = ref('');
    const bar = ref('');
    const neighborhood = ref('');
    const snackFail = ref(false);
    const snackText = ref('');
    const snackSuccess = ref(false);
    

    const user = computed(function(this: any) {
      return this.$store.state.user.displayName;
    });

    async function google(this: any) {
      if (bar.value == null || bar.value == '') {
        this.snackText = 'Please fill out all required fields before submitting the form.';
        this.snackFail = true;
      } else {
        if (neighborhood.value == '' || neighborhood.value == null) {
          window.open(`http://google.com/search?q=${location.value} ${bar.value}`);
        } else {
          window.open(`http://google.com/search?q=${location.value} ${bar.value} ${neighborhood.value}`);
        }
        this.$router.push(`/busyfeedback/${location.value}`);
      }
    }

    async function pubcoasters(this: any) {
      if (bar.value == null || bar.value == '') {
        this.snackText = 'Please fill out all required fields before submitting the form.';
        this.snackFail = true;
      } else {
        //TODO: write when api is done
      }
    }

    return { user, location, neighborhood, locations,
    snackFail, snackText, snackSuccess, bar,
    locationTypes, locationType, locationsCollege, pubcoasters, google };
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
</style>
