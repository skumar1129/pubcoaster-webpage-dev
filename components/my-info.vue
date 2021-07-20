<template>
    <v-card height="200" data-app v-if="uploading" color="grey">
        <v-layout align-center justify-center column fill-height>
            <v-flex row align-center>
                <v-progress-circular indeterminate :size="70" color="red" class=""></v-progress-circular>
            </v-flex>
        </v-layout>
     </v-card>
    <div data-app v-else>
        <v-row>
        <v-col v-if="userInformation.picLink" class="pic">
            <v-avatar size="200"><img :src="userInformation.picLink" alt="Profile Picture"></v-avatar>
            <v-file-input
                prepend-icon="mdi-camera"
                hide-input
                class="add"
                color="red"
                accept="image/*"
                @change="filePicked"
                v-model="picFile"
            ></v-file-input>
        </v-col>
        <v-col v-else class="pic">
            <v-avatar size="200" color="grey lighten-2">Profile Picture</v-avatar>
            <v-file-input
                prepend-icon="mdi-camera"
                hide-input
                class="add"
                color="red"
                accept="image/*"
                @change="filePicked"
                v-model="picFile"
            ></v-file-input>
        </v-col>
        <v-col class="edits-false" v-if="!editInfo">
            <v-row>
                <v-btn color="red" large class="delete" @click="deleteAccount">Delete Account</v-btn>
            </v-row>
            <v-row>
                <v-btn color="primary" large class="edit" @click="editInfo=true">Edit</v-btn>
            </v-row>
            <v-row>
              <div class="push-left">
                 <div class="send-help">
                    <v-btn outlined class="outline-plz" color="white" elevation="6" @click="followerDialog=true"><b class="numero">{{userInformation['numFollowers']}}</b></v-btn>
                    <caption class="text-subtitle-1 font-italic" v-if="userInformation['numFollowers']==1">Follower</caption>
                    <caption class="text-subtitle-1 font-italic" v-else>Followers</caption>
                </div>
                <div class="send-help">
                    <v-btn outlined class="outline-plz" color="white" elevation="6" @click="followingDialog=true"><b class="numero">{{userInformation['numFollowing']}}</b></v-btn>
                    <caption class="text-subtitle-1 font-italic">Following</caption>
                </div>
              </div>
            </v-row>
        </v-col>
        <v-col class="edits-true" v-else>
            <v-row>
                <v-btn color="red" large class="edit-pt-2" @click="cancelEdit">Cancel Editing</v-btn>
            </v-row>
            <v-row class="ml-8">
                <v-btn color="primary" large class="save-edit" @click="saveEdit">Save Edits</v-btn>
            </v-row>
            <v-row>
                <div class="push-left">
                    <div class="send-help">
                        <v-btn outlined class="outline-plz" color="white" elevation="6" @click="followerDialog=true"><b class="numero">{{userInformation['numFollowers']}}</b></v-btn>
                        <caption class="text-subtitle-1 font-italic" v-if="userInformation['numFollowers']==1">Follower</caption>
                        <caption class="text-subtitle-1 font-italic" v-else>Followers</caption>
                    </div>
                    <div class="send-help">
                        <v-btn outlined class="outline-plz" color="white" elevation="6" @click="followingDialog=true"><b class="numero">{{userInformation['numFollowing']}}</b></v-btn>
                        <caption class="text-subtitle-1 font-italic">Following</caption>
                    </div>
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
        <v-row class="user-headings" v-if="!editInfo">
            <b>{{userInformation['fullName']}}</b>
        </v-row>
        <v-row class="j-fields" v-else>
            <b class="pr-4 pl-6">First Name: </b>
            <v-text-field
                placeholder="First Name"
                shaped
                outlined
                background-color="blue-grey"
                color="black"
                class="pr-10"
                v-model="editedFirstName"
            ></v-text-field>
            <b class="pr-4">Last Name: </b>
            <v-text-field
                placeholder="Last Name"
                color="black"
                shaped
                outlined
                background-color="blue-grey"
                class="pr-6"
                v-model="editedLastName"
            ></v-text-field>
        </v-row>
        <v-divider class="bio-divider" color="black"></v-divider>
        <v-row class="user-headings" v-if="!editInfo">
            <i v-if="userInformation['bio']">{{userInformation['bio']}}</i>
            <i v-else>No Bio Yet</i>
        </v-row>
        <v-row class="j-fields" v-else>
            <b class="pr-4 pl-6">Bio: </b>
            <v-text-field
                placeholder="Bio"
                shaped
                outlined
                class="pr-6"
                background-color="blue-grey"
                color="black"
                v-model="editedBio"
            ></v-text-field>
        </v-row>
        <v-divider class="bio-divider" color="black"></v-divider>
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
                        <v-btn large v-if="followerInformation[i]['following']" align="right" @click="unfollowAccount(followerInformation[i]['user'], i)" color="primary">Unfollow</v-btn>
                        <v-btn large v-else align="right" @click="followAccount(followerInformation[i]['user'], i)" color="primary">Follow</v-btn>
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
                    <v-btn large align="right" @click="unfollowAccount(followingInformation[i]['user'], i)" color="primary">Unfollow</v-btn>
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
import { ref, computed, defineComponent } from '@nuxtjs/composition-api';
import * as _ from 'lodash';
import { v4 } from 'uuid';

export default defineComponent({
  name: "myinfo",
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
    const editInfo = ref(false);
    const editedFirstName = ref(null);
    const editedLastName = ref(null);
    const editedBio = ref(null);
    const picFile = ref(null);
    const snackFail = ref(false);
    const snackText = ref('');
    const snackSuccess = ref(false);
    const uploading = ref(false);
    const followerDialog = ref(false);
    const followingDialog = ref(false);
    const followerInformation = ref([]);
    const followingInformation = ref([]);
    const offset = ref(1);

    function goToUserLikedBars(this: any) {
        this.$router.push(`/mylikeditems/bar`);
    }
    function goToUserLikedDrinks(this: any) {
        this.$router.push(`/mylikeditems/drink`);
    }
    function goToUserLikedBrands(this: any) {
        this.$router.push(`/mylikeditems/brand`);
    }

    function dummy() {
        alert('Just look down dummy!!');
    }
    async function deleteAccount(this: any) {
        if(confirm('Are you sure you want to delete your account?')) {
          try {
            const username = this.$store.state.user.displayName;
            const token = await this.$fire.auth.currentUser.getIdToken();
            this.$axios.setHeader('Authorization', `Bearer ${token}`);
            await this.$axios.$delete(`/userapi/user/${username}`);
            await this.$fire.auth.currentUser.delete();
            this.$router.push('/signin');
            location.reload();
          } catch (e) {
            this.snackText = 'Error: could not delete user. Check your network connection.';
            this.snackFail = true;
          }
        }
    }

    async function filePicked(this: any) {
        if (this.picFile != null) {
            try {
                this.uploading = true;
                const username = this.$store.state.user.displayName;
                let id = v4();
                let storageRef = this.$fire.storage.ref().child(`prof_pics/${username.value}-${id}`);
                await storageRef.put(picFile.value);
                let picLink = await storageRef.getDownloadURL();
                let updateData = {'firstName': '', 'lastName': '', 'bio': '', 'email': '', 'fullName': '', 'picLink': picLink};
                const token = await this.$fire.auth.currentUser.getIdToken();
                this.$axios.setHeader('Authorization', `Bearer ${token}`);
                let data = await this.$axios.$patch(`/userapi/user/${username}`, updateData);
                this.snackText = 'Successfully updated profile picture!';
                this.snackSuccess = true;
                location.reload();
            } catch (e) {
                this.snackText = 'Error: could not update profile picture. Check your network connection.';
                this.snackFail = true;
            }
        }
    }
    function cancelEdit(this: any) {
        this.editedFirstName = null;
        this.editedLastName = null;
        this.editedBio = null;
        this.editInfo = false;
    }
    async function saveEdit(this: any) {
        let bioData = this.userInformation['bio'];
        let firstNameData = this.userInformation['firstName'];
        let lastNameData = this.userInformation['lastName'];
        if (this.editedFirstName != null) {
            firstNameData = this.editedFirstName;
        }
        if (this.editedLastName != null) {
            lastNameData = this.editedLastName;
        }
        if (this.editedBio != null) {
            bioData = this.editedBio;
        }
        const username = this.$store.state.user.displayName;
        let updateData = {'firstName': firstNameData, 'lastName': lastNameData, 'bio': bioData, 'email': '', 'fullName': '', 'picLink': ''};
        const token = await this.$fire.auth.currentUser.getIdToken();
        this.$axios.setHeader('Authorization', `Bearer ${token}`);
        let data = await this.$axios.$patch(`/userapi/user/${username}`, updateData);
        //reset values
        this.editInfo = false;
        this.editedFirstName = null;
        this.editedLastName = null;
        this.editedBio = null;
        location.reload();
    }
     async function unfollowAccount(this: any, user: any, index: any) {
        if ((this.followingDialog && confirm(`Are you sure you want to unfollow ${user}?`)) || !this.followingDialog) {
            let postBody = {
                'follower': this.$store.state.user.displayName,
                'following': user
            };
            try {
                const token = await this.$fire.auth.currentUser.getIdToken();
                this.$axios.setHeader('Authorization', `Bearer ${token}`);
                await this.$axios.$delete('/followersapi/follower', { data: postBody });
                if (this.followingDialog) {
                    location.reload();
                } else {
                    this.followerInformation[index]['following'] = false;
                    this.userInformation.numFollowing = this.userInformation.numFollowing - 1;
                    this.followingInformation = this.followingInformation.filter((el: any) => el.user !== user);
                }
            } catch (e) {
                this.snackText = 'Error: could not unfollow account';
                this.snackFail = true;
            }
        }
     }
    async function followAccount(this: any, user: any, index: any) {
            let postBody = {
                'follower': this.$store.state.user.displayName,
                'following': user
            };
            try {
                const token = await this.$fire.auth.currentUser.getIdToken();
                this.$axios.setHeader('Authorization', `Bearer ${token}`);
                await this.$axios.$post('/followersapi/follower', postBody);
                this.followerInformation[index]['following'] = true;
                this.userInformation.numFollowing = this.userInformation.numFollowing + 1;
                this.followingInformation.push(this.followerInformation[index]);
            } catch (e) {
                this.snackText = 'Error: could not follow account';
                this.snackFail = true;
            }
     }
    async function infinteScroll(this: any, $state: any) {
      offset.value++;
      try {
        const token = await this.$fire.auth.currentUser.getIdToken();
        this.$axios.setHeader('Authorization', `Bearer ${token}`);
        const username = this.$store.state.user.displayName;
        this.$axios.setHeader('user', username);
        let data = null;
        if (this.followerDialog) {
            data = await this.$axios.$get(`/followersapi/allfollowers?offset=${offset.value}`);
        } else {
            data = await this.$axios.$get(`/followersapi/allfollowing?offset=${offset.value}`);
        }
        if (data.length > 0) {
          if (this.followerDialog) {
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


    return { followAccount, editInfo, editedFirstName, editedBio, cancelEdit, saveEdit, editedLastName, picFile, filePicked, snackText, snackFail, snackSuccess, deleteAccount, dummy, uploading, goToUserLikedBars, goToUserLikedDrinks, goToUserLikedBrands, followerDialog, followingDialog, followerInformation, followingInformation, offset, infinteScroll, unfollowAccount }
  },
   async fetch(this: any) {
    try {
      const username = this.$store.state.user.displayName;
      this.$axios.setHeader('user', username);
      this.$fire.auth.onAuthStateChanged(async (user: any) => {
        if (user) {
          const token = await this.$fire.auth.currentUser.getIdToken();
          this.$axios.setHeader('Authorization', `Bearer ${token}`);
          let data = await this.$axios.$get(`/followersapi/allfollowing`);
          this.followingInformation = data;
          data = await this.$axios.$get(`/followersapi/allfollowers`);
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
        font-weight: 500;
    }
    .follow-bio {
        font-weight: normal;
        font-size: .8em;
        margin-top: .05em;
        color: black;
        margin-top: 2px;
    }
    .follow-person {
       padding-top: 10px;
       padding-bottom: 10px;
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
        margin-left: 2em;
        margin-top: .4em;
        position: relative;
    }
    .likes {
        margin-top: 1.1em;
        margin-bottom: 1em;
        display: grid;
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
    .push-left {
        margin-left: 1.2em;
    }
    .send-help {
        display: inline-block;
        position: relative;
        font-family: sans-serif;
        text-align: center;
        margin-top: .25em;
        margin-left: .66em;
        margin-bottom: .9em;
        font-weight: bold;
        font-size: 1.2em;
    }
    .edits-false {
        margin-top: 1.7em;
        margin-left: 1.7em;
    }
    .edits-true {
        margin-top: 1.5em;
        margin-left: 1.7em;
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
        margin-left: 6.4em;
        margin-top: .9em;
        float: left;
        clear: left;
    }
    .edit-pt-2 {
        color: white;
        font-weight: bold;
        margin-left: 3em;
        margin-top: .3em;
        float: left;
        clear: left;
    }
    .save-edit {
        color: white;
        font-weight: bold;
        margin-top: 1.3em;
        margin-left: 1.2em;
        float: left;
        clear: left;
    }
    .add {
        position: absolute;
        top: 1.9em;
        left: .7em;
        height: 2.5em;
        width: 3em;
        padding-bottom: .6em;
        padding-left: .4em;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: red;
        vertical-align: middle;
    }
    .j-fields {
        width: 100%;
        display: flex;
        vertical-align: middle;
        margin-top: .4em;
        margin-bottom: .4em;
        margin-left: auto;
        margin-right: auto;
        font-weight: bold;
        font-size: 1.1em;
        color: black;
        font-weight: bold;
    }
    .snack {
        width: 100%;
        font-weight: bold;
        font-size: 1.5em;
        color: white;
        text-align: center;
        font-style: italic;
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
</style>
