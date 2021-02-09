<template>
  <div data-app>
    <h1>Create New Post</h1>
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
      ></v-select>
      <v-text-field
        v-model="bar"
        label="Bar*"
        :rules="[v => !!v || 'Bar is required']"
        required
      ></v-text-field>
      <v-text-field
        v-model="neighborhood"
        label="Neighborhood"
      ></v-text-field>
      <v-select
        v-model="rating"
        :items="ratings"
        :rules="[v => !!v || 'Rating is required']"
        label="Rating*"
        required
      ></v-select>
      <v-textarea
        v-model="description"
        label="What's good?"
        :rules="[v => !!v || 'Description is required']"
        required
      ></v-textarea>
      <v-file-input
        label="Picture (optional)"
        prepend-icon="mdi-camera"
      ></v-file-input>
      <v-checkbox
        v-model="anonymous"
        label="Make post anonymous?"
      ></v-checkbox>
      <v-row class="btn-row">
        <v-btn @click="cancel">
          Cancel
        </v-btn>
        <v-btn @click="clear">
          Clear
        </v-btn>
        <v-btn @click="submit">
          Submit
        </v-btn>
      </v-row>
    </v-form>
  </div>
</template>

<script lang='ts'>
import { ref, defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({
  name: "CreatePost",
  setup() {
    const locations = ['Chicago', 'Columbus', 'Denver',
    'New York', 'San Francisco', 'Orlando', 'Phoenix',
    'Boston', 'Los Angeles'];
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
      // this.$router.push(`/locationposts/${location.value}`);
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

</style>
