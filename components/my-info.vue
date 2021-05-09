<template>
    <div data-app>
        <v-row>
        <v-col v-if="user_information.picLink" class="pic">
            <v-avatar size="200"><img :src="user_information.picLink" alt="Profile Picture"></v-avatar>
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
            <v-btn color="red" large class="delete" @click="deleteAccount">Delete Account</v-btn>
            <v-btn color="primary" large class="edit" @click="editInfo=true">Edit Account Information</v-btn>
        </v-col>
        <v-col class="edits-true" v-if="editInfo">
            <v-btn color="red" large class="edit" @click="cancelEdit">Cancel Editing</v-btn>
            <v-btn color="primary" large class="save-edit" @click="saveEdit">Save Edits</v-btn>
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
        <v-row class="user-headings" v-if="!editInfo">
            <b>{{user_information['fullName']}}</b>
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
            <i v-if="user_information['bio']">{{user_information['bio']}}</i>
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
    </div>
</template>

<script lang='ts'>
import { ref, computed, defineComponent, onMounted} from '@nuxtjs/composition-api';
import { v4 } from 'uuid';

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
    const editInfo = ref(false);
    const editedFirstName = ref(null);
    const editedLastName = ref(null);
    const editedBio = ref(null);
    const picFile = ref(null);
    const snackFail = ref(false);
    const snackText = ref('');
    const snackSuccess = ref(false);

    function dummy() {
        alert('Just look down dummy!!');
    }

    async function deleteAccount(this: any) {
        if(confirm('Are you sure you want to delete your account?')) {
          try {
            const username = this.$store.state.user.displayName;
            const token = await this.$fire.auth.currentUser.getIdToken();
            this.$axios.setHeader('Authorization', `Bearer ${token}`);
            let data = await this.$axios.$delete(`/userapi/user/${username}`);
            await this.$fire.auth.currentUser.delete();
            this.$router.push('/signin');
            location.reload();
          } catch (e) {
            console.log(e);
            this.snackText = 'Error: could not delete user. Check your network connection.';
            this.snackFail = true;
          }
        }
    }

    async function filePicked(this: any) {
        if (this.picFile != null) {
            try {
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
        let bioData = this.user_information['bio'];
        let firstNameData = this.user_information['firstName'];
        let lastNameData = this.user_information['lastName'];
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

  
    return { editInfo, editedFirstName, editedBio, cancelEdit, saveEdit, editedLastName, picFile, filePicked, snackText, snackFail, snackSuccess, deleteAccount, dummy }
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
    .edits-false {
        margin-top: 2em;
    }
    .edits-true {
        margin-top: 1.3em;
        margin-left: 2.4em;
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
</style>
