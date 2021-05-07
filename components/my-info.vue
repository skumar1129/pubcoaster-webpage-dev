<template>
    <div data-app>
        <v-row>
        <v-col v-if="user_information.picLink" class="pic">
            <v-avatar size="200"><img :src="user_information.picLink" alt="Profile Picture"></v-avatar>
            <v-btn color="red" class="add"><v-icon color="white" large>mdi-plus</v-icon></v-btn>
        </v-col>
        <v-col v-else class="pic">
            <v-avatar size="200" color="grey lighten-2">Profile Picture</v-avatar>
            <v-btn color="red" class="add"><v-icon color="white" large>mdi-plus</v-icon></v-btn>
        </v-col>
        <v-col class="edits">
            <v-btn color="red" large class="delete">Delete Account</v-btn>
            <v-btn color="primary" large class="edit">Edit Account Information</v-btn>
        </v-col>
        <v-col class="likes">
            <div class="indi-likes">
                <v-icon color="red" x-large>mdi-post</v-icon>
                <i v-if="user_post==1">{{user_post}} post created</i>
                <i v-else>{{user_post}} posts created</i>
            </div>
            <div class="indi-likes">
                <v-icon color="red" x-large>mdi-table-chair</v-icon>
                <i v-if="user_information['numBars']==1">{{user_information['numBars']}} bar liked</i>
                <i v-else>{{user_information['numBars']}} bars liked</i>
            </div>
            <div class="indi-likes">
                <v-icon color="red" x-large>mdi-glass-mug-variant</v-icon>
                <i v-if="user_information['numDrinks']==1">{{user_information['numDrinks']}} drink liked</i>
                <i v-else>{{user_information['numDrinks']}} drinks liked</i>
            </div>
            <div class="indi-likes">
                <v-icon color="red" x-large>mdi-billboard</v-icon>
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
  name: "myinfo",
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
  
    return {  }
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
        /* margin: 20px auto; */
        /* width: 15em;
        height:15em; */
        margin-top: 1.5em;
        margin-bottom: 1em;
        display:grid;
        grid-template-columns: 1fr 1fr;
        grid-row: auto auto;
        /* grid-column-gap: 20px; */
        grid-row-gap: 1em; 
    }
    .indi-likes {
        /* padding:20px;
        border-radius:10px; */
        display: inline-block;
        position: relative;
        font-size:.8em;
        font-family:sans-serif;
    }
    .indi-likes i {
        position: absolute;
        width: 100%;
        text-align: center;
        bottom: 0;
        left: 0;
    } 
    .edits {
        margin-top: 2em;
    }
    .delete {
        color: white;
        font-weight: bold;
        float: left;
        margin-left: 3.1em;
    }
    .edit {
        color: white;
        font-weight: bold;
        margin-top: 1.3em;
        float: left;
        clear: left;
    }
    .add {
        position: absolute;
        top: 1.5em;
        left: .4em;
    }
</style>
