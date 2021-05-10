<template>
    <div data-app>
        <v-row>
        <v-col v-if="user_information.picLink" class="pic">
            <v-avatar size="210"><img :src="user_information.picLink" alt="Profile Picture"></v-avatar>
        </v-col>
        <v-col v-else class="pic">
            <v-avatar size="210" color="grey lighten-2">Profile Picture</v-avatar>
        </v-col>
        <v-col class="likes">
            <div class="indi-likes">
                <v-btn color="white"><v-icon color="red" x-large @click="dummy">mdi-post</v-icon></v-btn>
                <i v-if="user_post==1">{{user_post}} post created</i>
                <i v-else>{{user_post}} posts created</i>
            </div>
            <div class="indi-likes">
                <v-btn color="white"><v-icon color="red" x-large>mdi-table-chair</v-icon></v-btn>
                <i v-if="user_information['numBars']==1">{{user_information['numBars']}} bar liked</i>
                <i v-else>{{user_information['numBars']}} bars liked</i>
            </div>
            <div class="indi-likes">
                <v-btn color="white"><v-icon color="red" x-large>mdi-glass-mug-variant</v-icon></v-btn>
                <i v-if="user_information['numDrinks']==1">{{user_information['numDrinks']}} drink liked</i>
                <i v-else>{{user_information['numDrinks']}} drinks liked</i>
            </div>
            <div class="indi-likes">
                <v-btn color="white"><v-icon color="red" x-large>mdi-billboard</v-icon></v-btn>
                <i v-if="user_information['numBrands']==1">{{user_information['numBrands']}} brand liked</i>
                <i v-else>{{user_information['numBrands']}} brands liked</i>
            </div>
        </v-col>
        </v-row>
        <v-divider class="bio-divider" color="black"></v-divider>
        <v-row class="user-headings">
            <b>{{user_information['fullName']}}</b>
        </v-row>
        <v-divider class="bio-divider" color="black"></v-divider>
        <v-row class="user-headings">
            <i v-if="user_information['bio']">{{user_information['bio']}}</i>
            <i v-else>No Bio Yet</i>
        </v-row>
        <v-divider class="bio-divider" color="black"></v-divider>
    </div>
</template>

<script lang='ts'>
import { ref, computed, defineComponent, onMounted} from '@nuxtjs/composition-api';

export default defineComponent({
  name: "userinfo",
  props: {
    user_information: {
        type: Object,
        required: true
    },
    user_post: {
        type: Number,
        required: true
    },
  },
  setup(props) {

    function dummy() {
        alert('Just look down dummy!!');
    }

  
    return { dummy }
  }
});
</script>

<style>
    .bio-divider {
        padding: .13em;
    }
    .user-headings {
        margin-top: .55em;
        margin-bottom: .55em;
        background-color: white;
        color: black;
        display: flex;
        justify-content: center;
    }
    .pic {
        margin-bottom: .3em;
        margin-left: 6em;
        margin-top: .4em;
        position: relative;
    }
    .likes {
        margin-top: 1.1em;
        margin-bottom: 1em;
        display:grid;
        grid-template-columns: 1fr 1fr;
        grid-row: auto auto;
        grid-row-gap: 1em; 
    }
    .indi-likes {
        display: inline-block;
        position: relative;
        font-size:.9em;
        font-family:sans-serif;
        text-align: center;
    }
    .indi-likes i {
        position: absolute;
        width: 100%;
        bottom: 0;
        left: 0;
    } 
</style>
