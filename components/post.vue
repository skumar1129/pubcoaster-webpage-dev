<template>
    <v-container style="border: 2px solid black;">
    <v-row>
    <v-col style="font-size: 35px;"><b>{{response["bar"]}}</b></v-col>
    <v-spacer></v-spacer>
    <v-col align="right" style="font-size: 25px;"><b>rating: </b>{{response["rating"]}}</v-col>
    </v-row>
    <v-divider style="height: 5px; color: black;"> </v-divider>
    <v-row>
    <v-col>
    <!--{{response['picLink']}}-->
    <v-img v-if="'picLink' in response" height="500" src="https://us.123rf.com/450wm/mumut/mumut1909/mumut190900001/131961951-stock-vector-cartoon-vector-illustration-of-a-genius-professor-einstein-for-design-element.jpg?ver=6"></v-img> 
    </v-col>
    </v-row>
    <v-divider style="height: 5px; color: black;"> </v-divider>
    <v-row class="mt-10">
    <v-col style="font-size: 25px;">
        <i>{{response['description']}}</i>
    </v-col>
    <v-spacer> </v-spacer>
    <v-col v-if="response['likes']==1" align="right" style="font-size: 25px;">
        {{response['likes']}} like
    </v-col>
    <v-col v-else align="right" style="font-size: 25px;">{{response['likes']}} likes</v-col>
    </v-row>
    <v-row v-if="response['anonymous'] == false">
    <v-col style="font-size: 18px; margin-bottom: 6px;">
        <b>Created by: </b>{{response['createdBy']}}<!--this should also be a link-->
    </v-col>
    </v-row>
    <!--view comments for right now-->
    <v-divider></v-divider>
    <u><h3 style="margin-bottom:14px; margin-top: 10px;">Comments</h3></u>
    <v-row class="mt-2" v-for="(comment, i) in response['comments']" :key="i" style="font-size: 15px;">
        <v-col>
            <b>{{ comment['createdBy'] }}:</b> {{ comment['text'] }}
        </v-col>
    </v-row>
    <!--<v-row v-if="response['comments'].length != 0" style="color: grey;">View all {{response['comments'].length}} comments</v-row>-->
    <!--<v-row v-else>No comments yet</v-row>-->
    <v-row>
        <!--<div class="d-flex flex-row align-center justify-center">-->
        <v-col>
            <div>
            <v-text-field style="width: 90%; display: inline-block;" v-model="comment" placeholder="Add a comment" @keypress.enter="send"></v-text-field><v-btn class="ml-2" icon @click.prevent="send"><v-icon>mdi-send</v-icon></v-btn>
            </div>
        </v-col>
        <!--</div>-->
    </v-row>
    </v-container>
</template>



<script lang='ts'>
import { ref, defineComponent} from '@nuxtjs/composition-api';

export default defineComponent({
  name: "Post",
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
      function send(this: any) {
        if (this.comment != null && this.comment != "") {
            let currentTime = this.getNow()
            let newComment = {
                "createdBy": this.currentUser,
                "text": this.comment,
                "createdAt": currentTime
            }
            //temporarily add to this comments list - also do I have to do this? if we want the comment to be added without reloading the page i think so
            this.response['comments'].push(newComment)
            this.comment = null //reset comment
            //add to database: TODO
        }
      }
      function getNow() {
        const today = new Date();
        const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
        const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        const dateTime = date +' '+ time
        return dateTime
      }
      const comment = ref("")
      const picture = ref(null)

      return { comment, send, getNow, picture }
  }
});
</script>