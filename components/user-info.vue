<template>
    <div data-app>
        <v-row>
        <v-col v-if="userInformation.picLink" class="pic">
            <v-avatar size="210"><img :src="userInformation.picLink" alt="Profile Picture"></v-avatar>
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
                    <v-btn outlined class="outline-plz" @click="followerDialog=true" color="white" elevation="6"><b class="numero">{{userInformation['numFollowers']}}</b></v-btn>
                    <caption class="text-subtitle-1 font-italic" v-if="userInformation['numFollowers']==1">Follower</caption>
                    <caption class="text-subtitle-1 font-italic" v-else>Followers</caption>
                </div>
                <div class="send-help">
                    <v-btn outlined class="outline-plz" @click="followingDialog=true"  color="white" elevation="6"><b class="numero">{{userInformation['numFollowing']}}</b></v-btn>
                    <caption class="text-subtitle-1 font-italic">Following</caption>
                </div>
            </v-row>
        </v-col>
        <v-col class="likes">
            <div class="indi-likes">
                <v-btn color="white"><v-icon color="red" x-large @click="dummy">mdi-post</v-icon></v-btn>
                <i v-if="userPost==1">{{userPost}} post created</i>
                <i v-else>{{userPost}} posts created</i>
            </div>
            <div class="indi-likes">
                <v-btn color="white" @click="goToUserLikedBars"><v-icon color="red" x-large>mdi-table-chair</v-icon></v-btn>
                <i v-if="userInformation['numBars']==1">{{userInformation['numBars']}} bar liked</i>
                <i v-else>{{userInformation['numBars']}} bars liked</i>
            </div>
            <div class="indi-likes">
                <v-btn color="white" @click="goToUserLikedDrinks"><v-icon color="red" x-large>mdi-glass-mug-variant</v-icon></v-btn>
                <i v-if="userInformation['numDrinks']==1">{{userInformation['numDrinks']}} drink liked</i>
                <i v-else>{{userInformation['numDrinks']}} drinks liked</i>
            </div>
            <div class="indi-likes">
                <v-btn color="white" @click="goToUserLikedBrands"><v-icon color="red" x-large>mdi-billboard</v-icon></v-btn>
                <i v-if="userInformation['numBrands']==1">{{userInformation['numBrands']}} brand liked</i>
                <i v-else>{{userInformation['numBrands']}} brands liked</i>
            </div>
        </v-col>
        </v-row>
        <v-divider class="bio-divider" color="black"></v-divider>
        <v-row class="user-headings">
            <b>{{userInformation['fullName']}}</b>
        </v-row>
        <v-divider class="bio-divider" color="black"></v-divider>
        <v-row class="user-headings">
            <i v-if="userInformation['bio']">{{userInformation['bio']}}</i>
            <i v-else>No Bio Yet</i>
        </v-row>
        <v-divider class="bio-divider" color="black"></v-divider>
        <v-snackbar multi-line v-model="snackFail" color="red" data-app>
            <div class="snack">
            {{ snackText }}
            </div>
        </v-snackbar>
        <client-only>
        <v-dialog data-app v-model="followerDialog" width="700">
            <v-card color="white" class="follower-dialog" v-if="followerInformation.length!=0">
                <h1 class="header">Followers</h1>
                <v-list dense color="white"> 
                    <v-list-item v-for="(item, i) in followerInformation" :key="i" class="follow-person">
                        <v-avatar v-if="followerInformation[i]['picLink']" size="80" color="grey lighten-2" class="follow-pic"><img :src="followerInformation[i]['picLink']" alt="Profile Picture"></v-avatar>
                        <v-avatar v-else size="80" color="grey lighten-2" class="follow-pic">Prof Pic</v-avatar>
                        <v-list-item-content class="follow-content">
                            {{followerInformation[i]['user']}}, {{followerInformation[i]['fullName']}}
                            <i class="follow-bio">{{followerInformation[i]['bio']}}</i>
                        </v-list-item-content>
                        <v-btn large v-if="followerInformation[i]['following']==true" align="right" @click="unfollowAccountDialog(followerInformation[i]['user'], i)" color="primary">Unfollow</v-btn>
                        <v-btn large v-else-if="followerInformation[i]['following']==false && notCurrentUser(followerInformation[i]['user'])" align="right" @click="followAccountDialog(followerInformation[i]['user'], i)" color="primary">Follow</v-btn>
                    </v-list-item>
                </v-list>
                <infinite-loading
                    v-if="followerInformation.length"
                    spinner="spiral"
                    @infinite="infinteScroll"
                ><span slot="no-more"></span>
                </infinite-loading>
            </v-card>
            <v-card color="white" v-else>
                <h1 class="no-follow-header">Followers</h1>
                <h3 class="no-follow">No Followers :/</h3>
            </v-card>
        </v-dialog>
        <v-dialog data-app v-model="followingDialog" width="700">
            <v-card color="white" class="following-dialog" v-if="followingInformation.length!=0">
                <h1 class="header">Following</h1>
             <v-list dense color="white"> 
                <v-list-item v-for="(item, i) in followingInformation" :key="i" class="follow-person">
                  <v-avatar v-if="followingInformation[i]['picLink']" size="80" color="grey lighten-2" class="follow-pic"><img :src="followingInformation[i]['picLink']" alt="Profile Picture"></v-avatar>
                  <v-avatar v-else size="80" color="grey lighten-2" class="follow-pic">Prof Pic</v-avatar>
                  <v-list-item-content class="follow-content">
                        {{followingInformation[i]['user']}}, {{followingInformation[i]['fullName']}}
                        <i class="follow-bio">{{followingInformation[i]['bio']}}</i>
                     </v-list-item-content>
                 <v-btn v-if="followingInformation[i]['following']==true" large align="right" @click="unfollowAccountDialog(followingInformation[i]['user'], i)" color="primary">Unfollow</v-btn>
                 <v-btn large v-else-if="followingInformation[i]['following']==false && notCurrentUser(followingInformation[i]['user'])" align="right" @click="followAccountDialog(followingInformation[i]['user'], i)" color="primary">Follow</v-btn>
                </v-list-item>
            </v-list>
            <infinite-loading
                v-if="followingInformation.length"
                spinner="spiral"
                @infinite="infinteScroll"
                ><span slot="no-more"></span>
            </infinite-loading>
            </v-card>
            <v-card color="white" v-else>
                <h1 class="no-follow-header">Following</h1>
                <h3 class="no-follow">No Following :/</h3>
            </v-card>
        </v-dialog>
        </client-only>
    </div>
</template>

<script lang='ts'>
import { ref, computed, defineComponent} from '@nuxtjs/composition-api';
import * as _ from 'lodash';
import { v4 } from 'uuid';

export default defineComponent({
  name: "userinfo",
  props: {
    userInformation: {
        type: Object,
        required: true
    },
    userPost: {
        type: Number,
        required: true
    },
  },
  setup(props) {
    
    const following = computed(() => {
        if (props.userInformation.following) {
            return props.userInformation.following;
        } else {
            return false;
        }
    });

    const snackFail = ref(false);
    const snackText = ref('');
    const followerDialog = ref(false);
    const followingDialog = ref(false);
    const followerInformation = ref([]);
    const followingInformation = ref([]);
    const offset = ref(1);

    function dummy() {
        alert('Just look down dummy!!');
    }

    function notCurrentUser(this: any, user: any) {
        if (user != this.$store.state.user.displayName) {
            return true;
        }
        return false;
    }

    async function followAccount(this: any) {
        let postBody = {
            'follower': this.$store.state.user.displayName,
            'following': props.userInformation['username']
        };
        try {
            const token = await this.$fire.auth.currentUser.getIdToken();
            this.$axios.setHeader('Authorization', `Bearer ${token}`);
            await this.$axios.$post('/followersapi/follower', postBody);
            location.reload();
        } catch (e) {
            if (this.$store.state.user.displayName != props.userInformation['username']) {
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
            'following': props.userInformation['username']
        };
        try {
            const token = await this.$fire.auth.currentUser.getIdToken();
            this.$axios.setHeader('Authorization', `Bearer ${token}`);
            await this.$axios.$delete('/followersapi/follower', { data: postBody });
            location.reload();
            
        } catch (e) {
            this.snackText = 'Error: could not unfollow account';
            this.snackFail = true;
        }     
    }

    async function unfollowAccountDialog(this: any, user: any, index: any) {
            let postBody = {
                'follower': this.$store.state.user.displayName,
                'following': user
            };
            try {
                const token = await this.$fire.auth.currentUser.getIdToken();
                this.$axios.setHeader('Authorization', `Bearer ${token}`);
                await this.$axios.$delete('/followersapi/follower', { data: postBody });
                if (followerDialog) {
                    this.followerInformation[index]['following'] = false;
                } else {
                    this.followingInformation[index]['following'] = false;
                }
            } catch (e) {
                this.snackText = 'Error: could not unfollow account';
                this.snackFail = true;
            }
     }

    async function followAccountDialog(this: any, user: any, index: any) {
            let postBody = {
                'follower': this.$store.state.user.displayName,
                'following': user
            };
            try {
                const token = await this.$fire.auth.currentUser.getIdToken();
                this.$axios.setHeader('Authorization', `Bearer ${token}`);
                await this.$axios.$post('/followersapi/follower', postBody);
                if (followerDialog) {
                    this.followerInformation[index]['following'] = true;
                } else {
                    this.followingInformation[index]['following'] = true;
                }
            } catch (e) {
                this.snackText = 'Error: could not follow account';
                this.snackFail = true;
            }
     }

    function goToUserLikedBars(this: any) {
        this.$router.push(`/userlikeditems/${props.userInformation['username']}-bar`);
    }
    function goToUserLikedDrinks(this: any) {
        this.$router.push(`/userlikeditems/${props.userInformation['username']}-drink`);
    }
    function goToUserLikedBrands(this: any) {
        this.$router.push(`/userlikeditems/${props.userInformation['username']}-brand`);
    }

     async function infinteScroll(this: any, $state: any) {
      offset.value++;
      try {
        const token = await this.$fire.auth.currentUser.getIdToken();
        this.$axios.setHeader('Authorization', `Bearer ${token}`);
        const username = this.userInformation['username'];
        this.$axios.setHeader('user', this.$store.state.user.displayName);
        let data = null;
        if (followerDialog) {
            data = await this.$axios.$get(`/followersapi/userfollowers/${username}?offset=${offset.value}`);
        } else {
            data = await this.$axios.$get(`/followersapi/userfollowing/${username}?offset=${offset.value}`);
        }
        if (data.length > 0) {
          if (followerDialog) {
            this.followerInformation.value = _.union(this.followerInformation.value, data);
          } else {
            this.followingInformation.value = _.union(this.followingInformation.value, data);
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

  
    return { notCurrentUser, followAccountDialog, unfollowAccountDialog, infinteScroll, followerDialog, followingDialog, followerInformation, followingInformation, offset, snackFail, snackText, followAccount, unfollowAccount, following, dummy, goToUserLikedBars, goToUserLikedDrinks, goToUserLikedBrands }
  },
  async fetch(this: any) {
    try {
      let username = this.$route.params.user;
      this.$axios.setHeader('user', this.$store.state.user.displayName);
      this.$fire.auth.onAuthStateChanged(async (user: any) => {
        if (user) {
          const token = await this.$fire.auth.currentUser.getIdToken();
          this.$axios.setHeader('Authorization', `Bearer ${token}`);
          let data = await this.$axios.$get(`/followersapi/userfollowing/${username}`);
          this.followingInformation = data;
          data = await this.$axios.$get(`/followersapi/userfollowers/${username}`);
          this.followerInformation = data;
        } else {
          this.snackText = 'Error: User authentication failed. Please sign in again.';
          this.snackFail = true;
          await this.$store.dispatch('signOut');
          this.$router.push('/signin');
        }
      });
    } catch (e) {
       this.snackText = 'Error: could not retrieve follow information.';
      this.snackFail = true;
    }
  },
  fetchOnServer: false,
  watchQuery: ['offset']
});
</script>

<style>
    .no-follow {
        text-align: center;
        font-size: 1.25em;
        margin-top: auto;
        margin-bottom: auto;
        padding-top: 1.5em;
        padding-bottom: 1.5em;
        color: black;
    }
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
       /* margin-bottom: 2em; */
    }
    .follower-dialog, .following-dialog {
        height: 26.5em;
    }
    .follower-dialog .header, .following-dialog .header, .no-follow-header {
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
