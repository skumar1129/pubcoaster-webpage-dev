<template>
    <div data-app>
        <v-row>
        <v-col v-if="user_information.picLink" class="pic">
            <v-avatar size="210"><img :src="user_information.picLink" alt="Profile Picture"></v-avatar>
        </v-col>
        <v-col v-else class="pic">
            <v-avatar size="210" color="grey lighten-2">Profile Picture</v-avatar>
        </v-col>
        <v-col class="mt-16">
            <v-row>
                <v-btn v-if="!following" color="primary" large class="ml-14" @click="followAccount">Follow</v-btn>
                <v-btn v-else color="primary" large class="ml-7" @click="unfollowAccount">Following <v-icon color="white" class="pl-2">mdi-check</v-icon></v-btn>
            </v-row>
            <v-row>
                <div class="send-help">
                    <v-btn outlined class="outline-plz" color="white" elevation="6"><b class="numero">{{user_information['numFollowers']}}</b></v-btn>
                    <caption class="text-subtitle-1 font-italic" v-if="user_information['numFollowers']==1">Follower</caption>
                    <caption class="text-subtitle-1 font-italic" v-else>Followers</caption>
                </div>
                <div class="send-help">
                    <v-btn outlined class="outline-plz" color="white" elevation="6"><b class="numero">{{user_information['numFollowing']}}</b></v-btn>
                    <caption class="text-subtitle-1 font-italic">Following</caption>
                </div>
            </v-row>
        </v-col>
        <v-col class="likes">
            <div class="indi-likes">
                <v-btn color="white"><v-icon color="red" x-large @click="dummy">mdi-post</v-icon></v-btn>
                <i v-if="user_post==1">{{user_post}} post created</i>
                <i v-else>{{user_post}} posts created</i>
            </div>
            <div class="indi-likes">
                <v-btn color="white" @click="goToUserLikedBars"><v-icon color="red" x-large>mdi-table-chair</v-icon></v-btn>
                <i v-if="user_information['numBars']==1">{{user_information['numBars']}} bar liked</i>
                <i v-else>{{user_information['numBars']}} bars liked</i>
            </div>
            <div class="indi-likes">
                <v-btn color="white" @click="goToUserLikedDrinks"><v-icon color="red" x-large>mdi-glass-mug-variant</v-icon></v-btn>
                <i v-if="user_information['numDrinks']==1">{{user_information['numDrinks']}} drink liked</i>
                <i v-else>{{user_information['numDrinks']}} drinks liked</i>
            </div>
            <div class="indi-likes">
                <v-btn color="white" @click="goToUserLikedBrands"><v-icon color="red" x-large>mdi-billboard</v-icon></v-btn>
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
        <v-snackbar multi-line v-model="snackFail" color="red" data-app>
            <div class="snack">
            {{ snackText }}
            </div>
        </v-snackbar>
    </div>
</template>

<script lang='ts'>
import { ref, computed, defineComponent} from '@nuxtjs/composition-api';

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
    
    //TODO: change once backend is configured
    const following = computed(() => {
        if (props.user_information.following) {
            return props.user_information.following;
        } else {
            return false;
        }
    });
    const snackFail = ref(false);
    const snackText = ref('');

    function dummy() {
        alert('Just look down dummy!!');
    }

    async function followAccount(this: any) {
        let postBody = {
            'follower': this.$store.state.user.displayName,
            'following': props.user_information['username']
        };
        try {
            const token = await this.$fire.auth.currentUser.getIdToken();
            this.$axios.setHeader('Authorization', `Bearer ${token}`);
            await this.$axios.$post('/followersapi/follower', postBody);
            //TODO: change once following field is figured out
            this.user_information.following = true;
        } catch (e) {
            if (this.$store.state.user.displayName != props.user_information['username']) {
                this.snackText = 'Error: could not follow account';
            } else {
                this.snackText = 'Error: A user cannot follow their own account!';
            }
            this.snackFail = true;
        }
    }

    async function unfollowAccount(this: any) {
        let postBody = {
            'follower': this.$store.state.user.displayName,
            'following': props.user_information['username']
        };
        try {
            const token = await this.$fire.auth.currentUser.getIdToken();
            this.$axios.setHeader('Authorization', `Bearer ${token}`);
            await this.$axios.$delete('/followersapi/follower', { data: postBody });
            //TODO: change once following field is figured out
            this.user_information.following = false;
        } catch (e) {
            this.snackText = 'Error: could not unfollow account';
            this.snackFail = true;
        }     
    }

    function goToUserLikedBars(this: any) {
        this.$router.push(`/userlikeditems/${props.user_information['username']}-bar`);
    }
    function goToUserLikedDrinks(this: any) {
        this.$router.push(`/userlikeditems/${props.user_information['username']}-drink`);
    }
    function goToUserLikedBrands(this: any) {
        this.$router.push(`/userlikeditems/${props.user_information['username']}-brand`);
    }

  
    return { snackFail, snackText, followAccount, unfollowAccount, following, dummy, goToUserLikedBars, goToUserLikedDrinks, goToUserLikedBrands }
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
        margin-top: 1.35em;
        margin-bottom: .85em;
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
    .send-help {
        display: inline-block;
        position: relative;
        font-family: sans-serif;
        text-align: center;
        margin-top: .4em;
        margin-left: .83em;
        font-weight: bold;
        font-size: 1.2em;
        color: black;
    }
    .numero {
        font-weight: bold;
        color: black;
        font-size: 1.5em;
        padding-right: .2em;
        padding-left: .2em;
    }
    .outline-plz {
        outline: .1em solid black;
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
