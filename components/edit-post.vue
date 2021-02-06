<template>
    <v-container class="outer" v-if="!edit">
    <v-card elevation="6" outlined shaped class="inner">
        <v-row> 
            <v-col class="title"> 
                <h1>{{response['bar']}}</h1>
            </v-col>
            <v-col align="center" class="title"> 
                <v-btn
                elevation="4"
                depressed
                large
                outlined
                rounded
                color="primary"
                @click="edit=true"
                >Edit Post</v-btn>
            </v-col>
            <v-col align="right" class="title">
                <h3>Rating: {{response['rating']}} / 10</h3>
            </v-col>
        </v-row>
        <v-divider color="grey" class="divider"> </v-divider>
        <v-row>
            <v-col align="center">
                <h1>{{response['description']}}</h1>
            </v-col>
        </v-row>
        <v-row v-if="response['picLink']">
            <v-col align="center">
                <!--eventually replace src with response['picLink']-->
                <v-img src="https://us.123rf.com/450wm/mumut/mumut1909/mumut190900001/131961951-stock-vector-cartoon-vector-illustration-of-a-genius-professor-einstein-for-design-element.jpg?ver=6"></v-img> 
            </v-col>
        </v-row>
        <v-divider color="grey" class="divider"> </v-divider>
        <v-row> 
            <v-col v-if="response['anonymous'] == false" class="middle">
                <i>{{response['createdBy']}}</i>
            </v-col>
            <v-col v-if="response['numLikes']==1" align="right" class="middle">
                {{response['numLikes']}} like
            </v-col>
            <v-col v-else-if="response['numLikes']==0"> 
                No likes yet
            </v-col>
            <v-col v-else align="right" class="middle">{{response['numLikes']}} likes</v-col>
        </v-row>
        <v-row> 
            <v-col class="footer">{{getMoment([response['createdAt']])}}</v-col>
            <v-col class="footer" align="right" v-if="'neighborhood' in response">
                <i>{{response['neighborhood']}}, {{response['location']}}</i>
            </v-col> 
            <v-col v-else class="footer" align="right">
                <i>{{response['location']}}</i>
            </v-col>
        </v-row>
        <v-divider class="divider" color="grey"></v-divider>
        <v-row>
        <v-col>
            <u><h3 class="title">Comments</h3></u>
        </v-col>
        </v-row>
        <v-row v-if="response['comments'] == 0" class="comments"> 
            No comments yet
        </v-row>
        <v-row v-else class="comments" v-for="(comment, i) in response['comments']" :key="i">
            <v-col>
                <b>{{ comment['createdBy'] }}:</b> {{ comment['text'] }}
            </v-col>
            <v-spacer> </v-spacer>
            <v-col align="right">
                {{getMoment(comment['createdAt'])}}
            </v-col>
        </v-row>
        <v-row>
        <v-col>
            <div>
            <v-text-field class="comment-line" v-model="comment" placeholder="Add a comment" @keypress.enter="send"></v-text-field><v-btn class="ml-2" icon @click.prevent="send"><v-icon>mdi-send</v-icon></v-btn>
            </div>
        </v-col>
        </v-row>
    </v-card>
    </v-container>
    <v-container v-else class="outer">
        <v-card elevation="6" outlined shaped class="inner">
            <v-row> 
            <v-col class="title">
                <v-text-field
                    label="Name of Bar"
                    v-model="barName"
                    filled
                    clearable
                    dense
                    rounded
                    :placeholder="response['bar']"
                ></v-text-field> 
            </v-col>
            <v-col align="center" class="title"> 
                <v-btn
                elevation="4"
                depressed
                large
                outlined
                rounded
                color="primary"
                @click="saveEdits"
                >Save Edits</v-btn>
            </v-col>
            <v-col align="right" class="selectRating">
                <label for="rate"><b> Rating: </b></label>
                <select name="rate" v-model="rating">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
            </select>
                <b> / 10 </b>
            </v-col>
        </v-row>
        <v-divider color="grey" class="divider"> </v-divider>
        <v-row>
            <v-col align="center">
                <v-text-field
                    label="Post Description"
                    v-model="description"
                    filled
                    clearable
                    dense
                    rounded
                    :placeholder="response['description']"
                ></v-text-field> 
            </v-col>
        </v-row>
        <!--TODO: add someway to edit the picture at a later point-->
        <v-divider color="grey" class="divider"> </v-divider>
        <v-row> 
            <v-col align="left">
                <!--TODO: should this be a button that says delete or just the icon-->
                <v-btn @click="deletePost" icon class="title" large>
                <v-icon>mdi-delete</v-icon>
                </v-btn> 
                <v-btn
                elevation="4"
                depressed
                large
                outlined
                rounded
                color="error"
                class="title"
                @click="edit=false"
                >Cancel Edit</v-btn>  
            </v-col>
            <v-col class="locationInput" align="right" v-if="response['neighborhood']">
                <div>
                <v-text-field
                    label="Neighborhood"
                    v-model="neighborhood"
                    filled
                    clearable
                    dense
                    rounded
                    class="neighborhood"
                    :placeholder="response['neighborhood']"
                ></v-text-field><b>,  {{response['location']}}</b>
                </div>
            </v-col> 
            <v-col v-else class="locationInput" align="right">
                <div>
                <v-text-field
                    label="Neighborhood"
                    v-model="neighborhood"
                    filled
                    clearable
                    dense
                    rounded
                    class="neighborhood"
                    :placeholder="response['neighborhood']"
                ></v-text-field><b>,  {{response['location']}}</b>
                </div>
            </v-col>
        </v-row>
        </v-card>
    </v-container>
</template>

<script lang='ts'>
import { ref, defineComponent} from '@nuxtjs/composition-api';
import moment from 'moment';

export default defineComponent({
  name: "editpost",
  props: { 
    response: {
        type: Object,
        required: true
    },
    currentUser: {
        type: String,
        required: true
    }
  },
  setup(props) {
      async function send(this: any) {
        if (this.comment != null && this.comment != "") {
            let newComment = {
                "createdBy": this.currentUser,
                "text": this.comment,
                "uuid": this.response['uuid']
            }
            //temporarily add to this comments list - also do I have to do this? if we want the comment to be added without reloading the page i think so
            //this.response['comments'].push(newComment)
            this.comment = null //reset comment
            let data = await this.$axios.$post('http://localhost:5000/comment', newComment);
            location.reload();
        }
      }
      function getMoment(date: any) {
          let mydate = new Date(date);
          return moment.utc(mydate, 'YYYY-MM-DD hh:mm:ss').local().fromNow()
      }
      async function saveEdits(this: any) {
          let postData = {picLink: null, neighborhood: this.neighborhood, location: null, rating: this.rating, bar: this.barName, description: this.description};
          let data = await this.$axios.$patch(`http://localhost:5000/post/${this.response['uuid']}`, postData);
          this.edit = false;
          location.reload();
      }
      async function deletePost(this: any) {
          let data = await this.$axios.$delete(`http://localhost:5000/post/${this.response['uuid']}`);
          this.edit = false;
          location.reload();
      }
      const comment = ref("")
      const picture = ref(null)
      const edit = ref(false)
      const barName = ref(null)
      const rating = ref(null)
      const description = ref(null)
      const neighborhood = ref(null)

      return { comment, send, picture, getMoment, edit, barName, rating, description, neighborhood, saveEdits, deletePost }
  }
});
</script>

<style>
    .divider {
        margin-top: .75rem;
        margin-bottom: .75rem;
    }
    .title {
        margin: .5rem;
    }
    .middle {
        margin: .5rem;
        font-size: 1.5rem;
    }
    .footer {
        margin: .5rem;
        font-size: 1rem;
    }
    .comment-line {
        width: 90%;
        display: inline-block;
        margin: .5rem;
    }
    .outer {
        background-color: black;
    }
    .inner {
        background-color: white;
    }
    .comments {
        margin: .2rem;
        font-size: 1rem;
    }
    .selectRating {
        margin: .5rem;
        font-size: 1.35rem;
    }
    .locationInput {
        margin: .6rem;
        font-size: 1.4rem;
    }
    .neighborhood {
        width: 70%;
        display: inline-block;
    }
</style>