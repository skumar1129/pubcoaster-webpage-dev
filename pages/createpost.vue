<template>
  <v-app>
    <appbar data-app :nav="false" :user_nav="false"></appbar>
    <div class="page">
    <h1 class="text-center mt-1 mb-1">Create New Post</h1>
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
      <v-select
        v-model="busyness_live"
        :items="busyness"
        :rules="[v => !!v || 'Busyness is required']"
        label="How busy is it right now?*"
        required
        dense
        color="white"
        class="field"
      ></v-select>
      <v-select
        v-model="rating"
        :items="ratings"
        :rules="[v => !!v || 'Experience Rating is required']"
        label="Experience Rating*"
        required
        dense
        color="white"
        class="field"
      ></v-select>
      <v-textarea
        v-model="description"
        label="What's good?"
        :rules="[v => !!v || 'Description is required']"
        required
        dense
        @keypress.enter="submit"
        color="white"
        class="field"
      ></v-textarea>
      <v-file-input
        label="Picture (optional)"
        prepend-icon="mdi-camera"
        class="field"
        color="white"
        accept="image/*"
        v-model="picFile"
      ></v-file-input>
      <v-checkbox
        v-model="anonymous"
        label="Make post anonymous?"
        class="field"
      ></v-checkbox>
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
    <v-overlay :value="spinner">
      <div class="center-it">
        <v-progress-circular
          indeterminate
          color="white"
          size="110"
        ></v-progress-circular>
      </div>
    </v-overlay>
    </div>
  </v-app>
</template>

<script lang='ts'>
import { ref, computed, defineComponent } from '@nuxtjs/composition-api';
import { v4 } from 'uuid';

export default defineComponent({
  name: "CreatePost",
  middleware: 'authenticate',
  setup() {
    const locations = ['Chicago', 'Columbus', 'Denver',
    'New York', 'San Francisco', 'Orlando', 'Phoenix',
    'Boston', 'Los Angeles', 'Washington DC'];
    const locationsCollege = ['Ohio State', 'University of Michigan',
    'Michigan State', 'Penn State', 'University of Illinois', 'University of Wisconsin'];
    const busyness = ['Dead AF', 'Some Crowd', 'Lively Enough', 'There Are Lines', "Can’t Move"];
    const ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const anonymous = ref(false);
    const location = ref('');
    const locationType = ref('');
    const picture = ref();
    const bar = ref('');
    const neighborhood = ref('');
    const rating = ref();
    const busyness_live = ref('');
    const description = ref('');
    const locationTypes = ['College', 'City'];
    const picFile = ref();
    const locationType = ref('');
    const spinner = ref(false);
    const snackFail = ref(false);
    const snackText = ref('');
    const snackSuccess = ref(false);
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
    async function submit(this: any) {
      if (locationType.value == null || locationType.value == '' || busyness_live.value == null || busyness_live.value == '' || bar.value == null || bar.value == '' || location.value == null || location.value == '' || description.value == null || description.value == '' || rating.value == null) {
        this.snackText = 'Please fill out all required fields before submitting the form.';
        this.snackFail = true;
      } else {
        this.spinner = true;
        let picLink = '';
        if (picFile.value) {
          try {
            let id = v4();
            let storageRef = this.$fire.storage.ref().child(`post_pics/${user.value}-${id}`);
            storageRef.put(picFile.value).then(() => {
              storageRef.getDownloadURL().then(async (url: string) => {
                picLink = url;
                let reqBody = {
                  username: user.value,
                  anonymous: anonymous.value,
                  picLink: picLink,
                  bar: bar.value,
                  description: description.value,
                  rating: rating.value,
                  location: location.value,
                  neighborhood: neighborhood.value,
                  busyness: busyness_live.value
                };
                const token = await this.$fire.auth.currentUser.getIdToken();
                this.$axios.setHeader('Authorization', `Bearer ${token}`);
                await this.$axios.$post('/postapi/post', reqBody);
                this.snackText = 'Successfully created post!';
                this.snackSuccess = true;
                this.$router.push(`/locationposts/${location.value}`);
              });
            })
          } catch (e) {
              this.snackText = 'Error: could not create post. Check network connection.';
              this.snackFail = true;
          }
        }
        else {
          try {
            let reqBody = {
              username: user.value,
              anonymous: anonymous.value,
              picLink: picLink,
              bar: bar.value,
              description: description.value,
              rating: rating.value,
              location: location.value,
              neighborhood: neighborhood.value,
              busyness: busyness_live.value
            };
            const token = await this.$fire.auth.currentUser.getIdToken();
            this.$axios.setHeader('Authorization', `Bearer ${token}`);
            await this.$axios.$post('/postapi/post', reqBody);
            this.snackText = 'Successfully created post!';
            this.snackSuccess = true;
            this.$router.push(`/locationposts/${location.value}`);
          } catch (e) {
              this.snackText = 'Error: could not create post. Check network connection.';
              this.snackFail = true;
          }
        }
      }
    }

    return { location, bar, neighborhood, picture, empty,
    rating, description, locations, ratings, anonymous,
    cancel, clear, submit, picFile, snackFail, snackText, snackSuccess, spinner,
    locationType, locationTypes, locationsCollege, busyness, busyness_live };
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
