<template>
    <v-container class="outer">
    <v-card elevation="6" outlined shaped class="inner">
        <v-row>
            <v-col class="title">
                <h1>{{bar}}</h1>
            </v-col>
            <v-spacer> </v-spacer>
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
            <v-col align="right" class="middle" v-else-if="response['numLikes']==0">
                No likes yet
            </v-col>
            <v-col v-else align="right" class="middle">{{response['numLikes']}} likes</v-col>
        </v-row>
        <v-row>
            <v-col class="footer">{{getMoment([response['createdAt']])}}</v-col>
            <v-col class="footer" align="right" v-if="response['neighborhood']">
                <i>{{nbhood}}, {{response['location']}}</i>
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
            <v-col v-if="editComment">
                <b class="editingComment">{{ comment['createdBy'] }}:</b>
                <v-text-field
                    label="Comment Text"
                    v-model="editedComment"
                    filled
                    clearable
                    dense
                    rounded
                    class="editingComment"
                    :placeholder="comment['text']"
                ></v-text-field>
            </v-col>
            <v-col v-else>
                <b>{{ comment['createdBy'] }}:</b> {{ comment['text'] }}
            </v-col>
            <v-spacer> </v-spacer>
            <v-col align="right">
                <i v-if="!editComment">
                {{getMoment(comment['createdAt'])}}
                </i>
                <v-btn
                    color="red"
                    outlined
                    rounded
                    v-if="editComment"
                    large
                    @click="cancelEditComment"
                >
                Cancel
                </v-btn>
                <v-btn
                    color="grey"
                    plain
                    small
                    v-if="currentUser == comment['createdBy'] && !editComment"
                    @click="editComment = true"
                >
                Edit
                </v-btn>
                <v-btn
                    color="blue"
                    outlined
                    rounded
                    large
                    v-if="editComment"
                    @click="editCommentFunc(comment['uuid'])"
                >
                Save
                </v-btn>
                <v-btn v-if="currentUser == comment['createdBy']" @click="deleteComment(comment['uuid'])" icon small>
                <v-icon>mdi-delete</v-icon>
                </v-btn>
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
  <!-- </v-card> -->
</template>



<script lang='ts'>
import { ref, computed, defineComponent} from '@nuxtjs/composition-api';
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
      async function send(this: any) {
        if (this.comment != null && this.comment != "") {
            let newComment = {
                "createdBy": this.currentUser,
                "text": this.comment,
                "uuid": this.response['uuid'],
                "createdAt": Date.now()
            }
            //temporarily add to this comments list - also do I have to do this? if we want the comment to be added without reloading the page i think so
            this.response['comments'].push(newComment)
            this.comment = null //reset comment
            let data = await this.$axios.$post('http://localhost:5000/comment', newComment);
            // location.reload();
        }
      }
      function getMoment(date: any) {
          let mydate = new Date(date);
          return moment.utc(mydate, 'YYYY-MM-DD hh:mm:ss').local().fromNow()
      }
      async function deleteComment(this: any, uuid: String) {
          let data = await this.$axios.$delete(`http://localhost:5000/comment/${uuid}`);
          location.reload();
      }
      async function editCommentFunc(this: any, uuid: String) {
          let commentData = {'text': this.editedComment}
          let data = await this.$axios.$patch(`http://localhost:5000/comment/${uuid}`, commentData);
          //reset values
          this.editedComment = null;
          this.editComment = false;
          location.reload();
      }
      function cancelEditComment(this: any) {
          this.editedComment = null;
          this.editComment = false;
      }
      const editComment = ref(false);
      const editedComment = ref(null);
      const comment = ref("");
      const picture = ref(null);

      const nbhood = computed(() => {
        if (props.response.neighborhood) {
          return props.response.neighborhood.toLowerCase()
            .split(' ')
            .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
        }
        else {
          return '';
        }
      });
      const bar = computed(() => {
        if (props.response.bar) {
          return props.response.bar.toLowerCase()
            .split(' ')
            .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
        }
      });
      return { comment, send, picture, getMoment, deleteComment, editCommentFunc, editComment, editedComment, cancelEditComment, nbhood, bar }

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
        margin-top: 1rem;
        margin-bottom: 1rem;
    }
    .inner {
        background-color: white;
    }
    .comments {
        box-shadow: 0 0 3pt 2pt darkgrey;
        margin: .2rem;
        font-size: 1rem;
    }
    .editingComment {
        display: inline-block;
        height: 1rem;
        font-size: 1.3rem;
        margin: .4rem;
    }
</style>
