<template>
  <v-app>
    <appbar data-app :nav="false" :user_nav="false"></appbar>
    <div class="page">
    <client-only>
        <h1 class="text-center mt-1 mb-1">Create New {{shownItem}}</h1>
    <v-form
      ref="form"
      lazy-validation
      class="form"
    >
     <v-select
        v-if="shownItem.toLowerCase() == 'bar'"
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
        v-if="shownItem.toLowerCase() == 'bar' && locationType=='College'"
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
        v-else-if="shownItem.toLowerCase() == 'bar' && locationType=='City'"
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
        v-else-if="shownItem.toLowerCase() == 'bar' && (locationType==null || locationType=='')"
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
        v-model="name"
        label="Name*"
        :rules="[v => !!v || 'Name is required']"
        required
        dense
        @keypress.enter="submit"
        color="white"
        class="field"
      ></v-text-field>
      <v-text-field
        v-if="shownItem.toLowerCase() == 'bar'"
        v-model="neighborhood"
        label="Neighborhood"
        dense
        color="white"
        @keypress.enter="submit"
        class="field"
      ></v-text-field>
      <v-text-field
        v-if="shownItem.toLowerCase() == 'brand'"
        v-model="type"
        label="Type"
        dense
        color="white"
        @keypress.enter="submit"
        class="field"
      ></v-text-field>
     
      <v-row class="btn-row">
        <v-btn @click="cancel" color="red" class="ml-8 mt-5 mb-4">
          Cancel
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
  name: "createitem",
  middleware: 'authenticate',
  setup() {
    const locations = ['Chicago', 'Columbus', 'Denver',
    'New York', 'San Francisco', 'Orlando', 'Phoenix',
    'Boston', 'Los Angeles', 'Washington DC'];
    const location = ref('');
    const name = ref('');
    const type = ref('');
    const neighborhood = ref('');
    const snackFail = ref(false);
    const snackText = ref('');
    const snackSuccess = ref(false);
    const locationsCollege = ['Ohio State', 'University of Michigan',
    'Michigan State', 'Penn State', 'University of Illinois', 'University of Wisconsin'];
    const locationTypes = ['College', 'City'];
    const locationType = ref('');
    const item = ref('');
    const shownItem = ref('');
    const empty:String[] = [];

    const user = computed(function(this: any) {
      return this.$store.state.user.displayName;
    });
    function cancel(this: any) {
      this.$router.push('/home');
    }
    function clear(this: any) {
      this.$refs.form.reset();
    }


    function submit(this: any) {
        if (this.shownItem.toLowerCase() == 'bar') {
            this.submitBar();
        } else if (this.shownItem.toLowerCase() == 'drink') {
            this.submitDrink();
        } else {
            this.submitBrand();
        }
    }

    async function submitBrand(this: any) {
      if (name.value == null || name.value == '') {
        this.snackText = 'Please fill out all required fields before submitting the form.';
        this.snackFail = true;
      } else {
          try {
              let reqBody = {
                  'brand': this.name,
                  'username': this.user,
                  'type': this.type
              }
              await this.$axios.$post('/userapi/user/brand', reqBody);
              this.snackText = 'Successfully created brand! Congrats!';
              this.snackSuccess = true;
              this.$refs.form.reset();
              this.$router.push(`/mylikeditems/brand`);
          } catch (e) {
              this.snackText = `Error: could not create brand. Check network connection.`;
              this.snackFail = true;
          }
        }
    }

    async function submitDrink(this: any) {
      if (name.value == null || name.value == '') {
        this.snackText = 'Please fill out all required fields before submitting the form.';
        this.snackFail = true;
      } else {
          try {
              let reqBody = {
                  'drink': this.name,
                  'username': this.user,
              }
              await this.$axios.$post('/userapi/user/drink', reqBody);
              this.snackText = 'Successfully created drink! Congrats!';
              this.snackSuccess = true;
              this.$refs.form.reset();
              this.$router.push(`/mylikeditems/drink`);
          } catch (e) {
              this.snackText = `Error: could not create drink. Check network connection.`;
              this.snackFail = true;
          }
        }
    }


    async function submitBar(this: any) {
      if (locationType.value == null || locationType.value == '' || name.value == null || name.value == '' || location.value == null || location.value == '') {
        this.snackText = 'Please fill out all required fields before submitting the form.';
        this.snackFail = true;
      } else {
          try {
              let reqBody = {
                  'bar': this.name,
                  'username': this.user,
                  'location': this.location,
                  'neighborhood': this.neighborhood
              }
              await this.$axios.$post('/userapi/user/bar', reqBody);
              this.snackText = 'Successfully created bar! Congrats!';
              this.snackSuccess = true;
              this.$refs.form.reset();
              this.$router.push(`/mylikeditems/bar`);
          } catch (e) {
              this.snackText = `Error: could not create bar. Check network connection.`;
              this.snackFail = true;
          }
        }
    }

    return { user, submit, item, type, submitBar, submitBrand, submitDrink, location, name, neighborhood, locations,
    empty, cancel, clear, snackFail, snackText, snackSuccess, shownItem, locationsCollege, locationTypes, locationType };
  },
  fetchOnServer: false,
  fetch(this: any) {
      this.item = this.$route.params.createitem;
      this.shownItem = this.item.charAt(0).toUpperCase() + this.item.slice(1);
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
