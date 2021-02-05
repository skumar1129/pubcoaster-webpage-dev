<template>
    <v-container class="outer">
    <v-card elevation="6" outlined shaped class="inner" color="green">
        <v-row>
            <v-col class="title">
                <h1>{{response['bar']}}</h1>
            </v-col>
            <v-spacer> </v-spacer>
            <v-col align="right" class="title">
                <h3>Rating: {{response['rating']}} / 10</h3>
                <!-- think this would be a cool addition when creating a post but can't get it to work
                <v-rating
                    background-color="grey"
                    color="red lighten-3"
                    empty-icon="$mdiStarOutline"
                    full-icon="$mdiStar"
                    half-icon="$mdiStarHalfFull"
                    readonly
                    length="10"
                    size="43"
                    value="5"
                ></v-rating>
                -->
            </v-col>
        </v-row>
        <v-divider color="grey" class="divider"> </v-divider>
        <v-row>
            <v-col align="center">
                <h1>{{response['description']}}</h1>
            </v-col>
        </v-row>
        <v-row v-if="'picLink' in response">
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
            <v-col v-if="response['likes']==1" align="right" class="middle">
                {{response['likes']}} like
            </v-col>
            <v-col v-else-if="response['likes']==0">
                No likes yet
            </v-col>
            <v-col v-else align="right" class="middle">{{response['likes']}} likes</v-col>
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
        </v-row>
        <v-row>
        <!--<div class="d-flex flex-row align-center justify-center">-->
        <v-col>
            <div>
            <v-text-field class="comment-line" v-model="comment" placeholder="Add a comment" @keypress.enter="send"></v-text-field><v-btn class="ml-2" icon @click.prevent="send"><v-icon>mdi-send</v-icon></v-btn>
            </div>
        </v-col>
        <!--</div>-->
        </v-row>
    </v-card>
    </v-container>
  <!-- </v-card> -->
</template>



<script lang='ts'>
import { ref, defineComponent} from '@nuxtjs/composition-api';
import moment from 'moment';

export default defineComponent({
  name: "Post",
  props: {
    response: {
        type: Object,
        required: true
    },
    currentUser: {
        type: String,
        required: false
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
      function getMoment(date: any) {
        return moment.utc(date, 'YYYY-MM-DD hh:mm:ss').local().fromNow()
      }
      const comment = ref("")
      const picture = ref(null)

      return { comment, send, getNow, picture, getMoment }
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
</style>
