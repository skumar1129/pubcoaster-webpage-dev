<template>
  <v-app>
    <div class="page">
    <h1 class="text-center">Create New Post</h1>
    <v-form
      ref="form"
      lazy-validation
    >
      <v-select
        v-model="location"
        :items="locations"
        :rules="[v => !!v || 'Location is required']"
        label="Location*"
        required
        dense
        class="field"
      ></v-select>
      <v-text-field
        v-model="bar"
        label="Bar*"
        :rules="[v => !!v || 'Bar is required']"
        required
        dense
        class="field"
      ></v-text-field>
      <v-text-field
        v-model="neighborhood"
        label="Neighborhood"
        dense
        class="field"
      ></v-text-field>
      <v-select
        v-model="rating"
        :items="ratings"
        :rules="[v => !!v || 'Rating is required']"
        label="Rating*"
        required
        dense
        class="field"
      ></v-select>
      <v-textarea
        v-model="description"
        label="What's good?"
        :rules="[v => !!v || 'Description is required']"
        required
        dense
        class="field"
      ></v-textarea>
      <v-file-input
        label="Picture (optional)"
        prepend-icon="mdi-camera"
        class="field"
      ></v-file-input>
      <v-checkbox
        v-model="anonymous"
        label="Make post anonymous?"
        class="field"
      ></v-checkbox>
      <v-row class="btn-row">
        <v-btn @click="cancel" class="ml-8 mt-5">
          Cancel
        </v-btn>
        <v-btn @click="clear" class="mt-5">
          Clear
        </v-btn>
        <v-btn @click="submit" class="mr-8 mt-5">
          Submit
        </v-btn>
      </v-row>
    </v-form>
    </div>
  </v-app>
</template>

<script lang='ts'>
import { ref, defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: "CreatePost",
  setup() {
    const locations = ['Chicago', 'Columbus', 'Denver',
    'New York', 'San Francisco', 'Orlando', 'Phoenix',
    'Boston', 'Los Angeles', 'Washington DC'];
    const ratings = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const anonymous = ref(false);
    const location = ref('');
    const picture = ref();
    const bar = ref('');
    const neighborhood = ref('');
    const rating = ref();
    const description = ref('');
    function cancel(this: any) {
      this.$router.push('/home');
    }
    function clear(this: any) {
      this.$refs.form.reset();
    }
    async function submit(this: any) {
      // TODO: Update username from local storage
      let reqBody = {
        username: 'helga',
        anonymous: anonymous.value,
        picLink: '',
        bar: bar.value,
        description: description.value,
        rating: rating.value,
        location: location.value,
        neighborhood: neighborhood.value
      };
      await this.$axios.$post('http://localhost:5000/post', reqBody);
      this.$router.push(`/locationposts/${location.value}`);
    }

    return { location, bar, neighborhood, picture,
    rating, description, locations, ratings, anonymous,
    cancel, clear, submit };
  }
});
</script>

<style>
  .btn-row {
    display: flex;
    justify-content: space-around;
  }
  .page {
    background-color: grey;
    height: 100%;
    width: 100%;
    font-size: 1.5em;
  }
  .field {
    padding-left: 5em;
    padding-right: 5em;
    font-weight: bold;
    font-size: 1em;
    margin-top: 1em;
  }
</style>
