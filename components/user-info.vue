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
                <v-btn v-if="!following" color="primary" large class="ml-13" @click="followAccount">Follow</v-btn>
                <v-btn v-else color="primary" large class="ml-6" @click="unfollowAccount">Following <v-icon color="white" class="pl-2">mdi-check</v-icon></v-btn>
            </v-row>
            <v-row>
                <div class="send-help">
                    <v-btn outlined class="outline-plz" @click="follower_dialog=true" color="white" elevation="6"><b class="numero">{{user_information['numFollowers']}}</b></v-btn>
                    <caption class="text-subtitle-1 font-italic" v-if="user_information['numFollowers']==1">Follower</caption>
                    <caption class="text-subtitle-1 font-italic" v-else>Followers</caption>
                </div>
                <div class="send-help">
                    <v-btn outlined class="outline-plz" @click="following_dialog=true"  color="white" elevation="6"><b class="numero">{{user_information['numFollowing']}}</b></v-btn>
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
        <v-dialog data-app v-model="follower_dialog" width="700">
            <v-card color="white" class="follower-dialog">
                <h1 class="header">Followers</h1>
                <!-- TODO: make it scrollable and have infinite scroll -->
                <v-list dense color="white"> 
                    <v-list-item v-for="(item, i) in follower_information" :key="i" class="follow-person">
                        <v-avatar v-if="follower_information[i]['picLink']" size="80" color="grey lighten-2" class="follow-pic"><img :src="follower_information[i]['picLink']" alt="Profile Picture"></v-avatar>
                        <v-avatar v-else size="80" color="grey lighten-2" class="follow-pic">Prof Pic</v-avatar>
                        <v-list-item-content class="follow-content">
                            {{follower_information[i]['user']}}, {{follower_information[i]['fullName']}}
                            <i class="follow-bio">{{follower_information[i]['bio']}}</i>
                        </v-list-item-content>
                        <v-btn large v-if="follower_information[i]['following']" align="right" @click="unfollowAccountDialog(follower_information[i]['user'])" color="primary">Unfollow</v-btn>
                    </v-list-item>
                </v-list>
                <infinite-loading
                    v-if="follower_information.length"
                    spinner="spiral"
                    @infinite="infinteScroll"
                ><span slot="no-more"></span>
                </infinite-loading>
            </v-card>
        </v-dialog>
        <v-dialog data-app v-model="following_dialog" width="700">
            <v-card color="white" class="following-dialog">
                <h1 class="header">Following</h1>
             <v-list dense color="white"> 
                <v-list-item v-for="(item, i) in following_information" :key="i" class="follow-person">
                  <v-avatar v-if="following_information[i]['picLink']" size="80" color="grey lighten-2" class="follow-pic"><img :src="following_information[i]['picLink']" alt="Profile Picture"></v-avatar>
                  <v-avatar v-else size="80" color="grey lighten-2" class="follow-pic">Prof Pic</v-avatar>
                  <v-list-item-content class="follow-content">
                        {{following_information[i]['user']}}, {{following_information[i]['fullName']}}
                        <i class="follow-bio">{{following_information[i]['bio']}}</i>
                     </v-list-item-content>
                 <v-btn v-if="following_information[i]['following']" large align="right" @click="unfollowAccountDialog(following_information[i]['user'])" color="primary">Unfollow</v-btn>
                </v-list-item>
            </v-list>
            <infinite-loading
                v-if="following_information.length"
                spinner="spiral"
                @infinite="infinteScroll"
                ><span slot="no-more"></span>
            </infinite-loading>
            </v-card>
        </v-dialog>
    </div>
</template>

<script lang='ts'>
import { ref, computed, defineComponent} from '@nuxtjs/composition-api';
import * as _ from 'lodash';
import { v4 } from 'uuid';

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
    
    const following = computed(() => {
        if (props.user_information.following) {
            console.log('calculating following');
            return props.user_information.following;
        } else {
            return false;
        }
    });

    const snackFail = ref(false);
    const snackText = ref('');
    const follower_dialog = ref(false);
    const following_dialog = ref(false);
    const follower_information = ref([]);
    const following_information = ref([]);
    const offset = ref(1);

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
            this.user_information.following = true;
            this.user_information.numFollowers = this.user_information.numFollowers + 1;
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
            this.user_information.following = false;
            this.user_information.numFollowers = this.user_information.numFollowers - 1;
        } catch (e) {
            this.snackText = 'Error: could not unfollow account';
            this.snackFail = true;
        }     
    }

    async function unfollowAccountDialog(this: any, user: any) {
        if (confirm(`Are you sure you want to unfollow ${user}?`)) {
            let postBody = {
                'follower': this.$store.state.user.displayName,
                'following': user
            };
            try {
                const token = await this.$fire.auth.currentUser.getIdToken();
                this.$axios.setHeader('Authorization', `Bearer ${token}`);
                await this.$axios.$delete('/followersapi/follower', { data: postBody });
                //TODO: reload here?? or should i give them the option to follow them back?
                location.reload();
            } catch (e) {
                this.snackText = 'Error: could not unfollow account';
                this.snackFail = true;
            }
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

     async function infinteScroll(this: any, $state: any) {
      offset.value++;
      try {
        const token = await this.$fire.auth.currentUser.getIdToken();
        this.$axios.setHeader('Authorization', `Bearer ${token}`);
        const username = this.user_information['username'];
        let data = null;
        if (follower_dialog) {
            data = await this.$axios.$get(`/followersapi/userfollowers/${username}?offset=${offset.value}`);
        } else {
            data = await this.$axios.$get(`/followersapi/userfollowing/${username}?offset=${offset.value}`);
        }
        if (data.length > 0) {
          if (follower_dialog) {
            this.follower_information.value = _.union(this.follower_information.value, data);
          } else {
            this.following_information.value = _.union(this.following_information.value, data);
          }
          $state.loaded();
        } else {
          $state.loaded();
          $state.complete();
        }
      } catch (e) {
         this.snackText = 'Error: could not retrieve follow information.';
        this.snackFail = true;
      }
    }

  
    return { unfollowAccountDialog, infinteScroll, follower_dialog, following_dialog, follower_information, following_information, offset, snackFail, snackText, followAccount, unfollowAccount, following, dummy, goToUserLikedBars, goToUserLikedDrinks, goToUserLikedBrands }
  },
  async fetch(this: any) {
    try {
      let username = this.$route.params.user;
      this.$fire.auth.onAuthStateChanged(async (user: any) => {
        if (user) {
          const token = await this.$fire.auth.currentUser.getIdToken();
          this.$axios.setHeader('Authorization', `Bearer ${token}`);
          let data = await this.$axios.$get(`/followersapi/userfollowing/${username}`);
          this.following_information = data;
          data = await this.$axios.$get(`/followersapi/userfollowers/${username}`);
          this.follower_information = data;
        } else {
          this.snackText = 'Error: User authentication failed. Please sign in again.';
          this.snackFail = true;
          await this.$store.dispatch('signOut');
          this.$router.push('/signin');
        }
      });
    } catch (e) {
        console.log(e);
       this.snackText = 'Error: could not retrieve follow information.';
      this.snackFail = true;
    }
  },
  fetchOnServer: false,
  watchQuery: ['offset']
});
</script>

<style>
    .follow-pic {
        color: black;
        font-weight: 400;
    }
    .follow-bio {
        font-weight: normal;
        font-size: .8em;
        margin-top: .05em;
        color: black;
        margin-top: 2px;
    }
    .follow-person {
       display: flex;
       border-top: .1em solid black;
       border-bottom: .1em solid black;
       padding-top: .75em;
       padding-bottom: .75em;
       margin-bottom: 2em;
    }
    .follower-dialog .header, .following-dialog .header {
        font-family: fantasy;
        text-decoration: underline;
        color: black;
        padding-top: .75em;
        text-align: center;
    }
    .follow-content {
        color: black;
        font-size: 1.3em;
        font-weight: bold;
        margin-left: 22px;
        margin-bottom: 8px;
    }
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
