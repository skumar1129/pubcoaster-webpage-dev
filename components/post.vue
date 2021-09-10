<template>
    <v-container class="outer" data-app>
    <v-card elevation="6" outlined shaped color="grey">
        <v-row>
            <v-col class="title">
                <h1>{{bar}}</h1>
            </v-col>
            <v-spacer> </v-spacer>
            <v-col align="right" class="title">
                <h3>Rating: {{response['rating']}} / 10</h3>
            </v-col>
        </v-row>
        <v-divider color="black" class="divider"> </v-divider>
        <v-row>
            <v-col align="center" class="descrip">
                <h1>{{response['description']}}</h1>
            </v-col>
        </v-row>
        <v-row v-if="response.picLink">
            <v-col align="center">
                <v-img :src="response.picLink" max-height="480" max-width="820"></v-img>
            </v-col>
        </v-row>
        <v-divider color="black" class="divider"> </v-divider>
        <v-row>
            <v-col v-if="response['anonymous'] == false" class="middle">
                <i>{{response['createdBy']}}</i>
            </v-col>
            <v-col v-if="numLikes==1" align="right" class="middle">
                {{numLikes}} like
                <v-btn v-if="!hasLikedPost" icon @click="likePost"><v-icon>mdi-heart-outline</v-icon></v-btn>
                <v-btn v-else icon @click="unLikePost"><v-icon>mdi-heart</v-icon></v-btn>
            </v-col>
            <v-col align="right" class="middle" v-else-if="numLikes==0">
                No likes yet
                <v-btn v-if="!hasLikedPost" icon @click="likePost"><v-icon>mdi-heart-outline</v-icon></v-btn>
                <v-btn v-else icon @click="unLikePost"><v-icon>mdi-heart</v-icon></v-btn>
            </v-col>
            <v-col v-else align="right" class="middle">{{numLikes}} likes
              <v-btn v-if="!hasLikedPost" icon @click="likePost"><v-icon>mdi-heart-outline</v-icon></v-btn>
              <v-btn v-else icon @click="unLikePost"><v-icon>mdi-heart</v-icon></v-btn>
            </v-col>
        </v-row>
        <v-row v-if="response['busyness']"> 
            <v-col align="middle" class="busyness">
                <b>Busyness Level: </b>{{response['busyness']}}
            </v-col>
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
        <v-divider class="divider" color="black"></v-divider>
        <v-row>
        <v-col>
            <u><h3 class="title">Comments</h3></u>
        </v-col>
        </v-row>
        <v-row v-if="response['comments'] == 0" class="no-comments">
            <b class="no-comment-text">No comments yet</b>
        </v-row>
        <v-list v-else class="comments">
            <template v-for="(comment, i) in response['comments']" class="template">
            <v-list-item :key=i class="comment">
            <v-row :key=i>
            <v-col v-if="editComment && comment['uuid']==uuidEdit" :key=i>
                <div class="editingComment-1">
                    <b>{{ comment['createdBy'] }}:</b>
                </div>
                <div class="editingComment-2">
                    <v-text-field
                    label="Comment Text"
                    v-model="editedComment"
                    dense
                    rounded
                    outlined
                    :placeholder="comment['text']"
                    ></v-text-field>
                </div>
            </v-col>
            <v-col v-else :key=i>
                <b>{{ comment['createdBy'] }}:</b> {{ comment['text'] }}
            </v-col>
            <v-spacer :key=i> </v-spacer>
            <v-col align="right" :key=i>
                <i v-if="!editComment || comment['uuid']!=uuidEdit">
                {{getMoment(comment['createdAt'])}}
                </i>
                <v-btn
                    color="error"
                    rounded
                    v-if="editComment && comment['uuid']==uuidEdit"
                    large
                    @click="cancelEditComment"
                    class="editbtn"
                >
                Cancel
                </v-btn>
                <v-btn
                    color="white"
                    plain
                    medium
                    v-if="(currentUser == comment['createdBy'] && !editComment)"
                    @click="turnOnEditComment(comment['uuid'])"
                >
                Edit
                </v-btn>
                <v-btn
                    color="primary"
                    rounded
                    large
                    class="editbtn"
                    v-if="editComment && comment['uuid']==uuidEdit"
                    @click="editCommentFunc(comment['uuid'])"
                >
                Save
                </v-btn>
                <v-btn v-if="currentUser == comment['createdBy']" @click="deleteComment(comment['uuid'])" icon small>
                <v-icon>mdi-delete</v-icon>
                </v-btn>
                </v-col>
                </v-row>
                </v-list-item>
            </template>
        </v-list>
        <v-row>
        <v-col>
            <div>
            <v-text-field class="comment-line" v-model="comment" placeholder="Add a comment" @keypress.enter="send"></v-text-field><v-btn class="ml-2" icon @click.prevent="send"><v-icon>mdi-send</v-icon></v-btn>
            </div>
        </v-col>
      </v-row>
    </v-card>
    </v-container>
</template>



<script lang='ts'>
import { ref, computed, defineComponent, onMounted} from '@nuxtjs/composition-api';
import moment from 'moment';

export default defineComponent({
  name: "Post",
  props: {
    response: {
        type: Object,
        required: true
    },
  },
  setup(props) {
    async function likePost(this: any) {
      const token = await this.$fire.auth.currentUser.getIdToken();
      this.$axios.setHeader('Authorization', `Bearer ${token}`);
      this.$axios.setHeader('username', this.currentUser);
      await this.$axios.$post(`/postapi/like/${props.response.uuid}`);
      this.response['likes'].push({'username': this.currentUser});
    }
    async function unLikePost(this: any) {
      const token = await this.$fire.auth.currentUser.getIdToken();
      this.$axios.setHeader('Authorization', `Bearer ${token}`);
      this.$axios.setHeader('username', this.currentUser);
      await this.$axios.$delete(`/postapi/like/${props.response.uuid}`);
      let index = this.response['likes'].findIndex((element: any) => element == {'username': this.currentUser});
      this.response['likes'].splice(index, 1);
    }
    async function send(this: any) {
      if (this.comment != null && this.comment != "") {
        let sentComment = {
          createdBy: this.currentUser,
            text: this.comment,
            uuid: this.response.uuid,
          };
          const token = await this.$fire.auth.currentUser.getIdToken();
          this.$axios.setHeader('Authorization', `Bearer ${token}`);
          let data = await this.$axios.$post('/postapi/comment', sentComment);
          let newComment = {
              "createdBy": this.currentUser,
              "text": this.comment,
              "uuid": data.uuid,
              "createdAt": data.createdAt
          };
          this.response['comments'].unshift(newComment);
          this.comment = null; //reset comment
      }
    }
    function getMoment(date: any) {
        let mydate = new Date(date);
        return moment.utc(mydate, 'YYYY-MM-DD hh:mm:ss').local().fromNow();
    }
    async function deleteComment(this: any, uuid: String) {
        const token = await this.$fire.auth.currentUser.getIdToken();
        this.$axios.setHeader('Authorization', `Bearer ${token}`);
        let data = await this.$axios.$delete(`/postapi/comment/${uuid}`);
        location.reload();
    }
    async function editCommentFunc(this: any, uuid: String) {
        let commentData = {'text': this.editedComment};
        const token = await this.$fire.auth.currentUser.getIdToken();
        this.$axios.setHeader('Authorization', `Bearer ${token}`);
        let data = await this.$axios.$patch(`/postapi/comment/${uuid}`, commentData);
        //reset values
        this.editedComment = null;
        this.editComment = false;
        this.uuidEdit = null;
        location.reload();
    }
    function cancelEditComment(this: any) {
        this.editedComment = null;
        this.editComment = false;
        this.uuidEdit = null;
    }
    function turnOnEditComment(this: any, uuid: String) {
        this.uuidEdit = uuid;
        this.editComment = true;
    }
    const editComment = ref(false);
    const editedComment = ref(null);
    const comment = ref("");
    const picture = ref(null);
    const uuidEdit = ref(null);

    const likedPost = ref(false);
    const currentUser = computed(function(this: any){
      return this.$store.state.user.displayName;
    });
    const hasLikedPost = computed(function(this: any) {
      if (props.response.likes) {
        for (const like of props.response.likes) {
          if (like.username == this.currentUser) {
            return true;
          }
        }
      }
      return false;
    });

    const numLikes = computed(() => {
      if (props.response.likes) {
        return props.response.likes.length;
      }
    });


    const nbhood = computed(() => {
      if (props.response.neighborhood) {
        return props.response.neighborhood.toLowerCase()
          .split(' ')
          .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
          .join(' ');
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
    return { comment, send, picture, getMoment, deleteComment,
    editCommentFunc, editComment, editedComment, cancelEditComment,
    nbhood, bar, uuidEdit, turnOnEditComment,
    hasLikedPost, likePost, unLikePost, numLikes, likedPost, currentUser }
  }
});
</script>

<style>
    .busyness {
        font-size: 1.5rem;
    }
    .divider {
        margin-top: .75rem;
        margin-bottom: .75rem;
        padding: .05em;
    }
    .title {
        margin: .7rem;
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
    .comments {
        margin: .2rem;
        height: 12em;
        overflow-y: auto;
        width: 100%;
        background-color: grey;
        border: .3em solid black;
    }
    .no-comments {
        /* margin-left: .25rem;
        margin-right: .1em; */
        height: 4em;
        /* width: 100%; */
        /* background-color: grey; */
        border: .3em solid black;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .no-comment-text {
        font-size: 1.8em;
        font-weight: bold;
    }
    .descrip {
        font-size: 1.7em;
    }
    .comment {
        background-color: grey;
        box-shadow: 0 0 3pt 2pt black;
        font-size: 1rem;
    }
    .editingComment-1 {
        height: .7rem;
        font-size: 1.1rem;
        margin: .4rem;
        display: inline-block;
    }
    .editingComment-2 {
        height: .7rem;
        font-size: 1rem;
        margin: .4rem;
        display: inline-block;
        width: 13.8em;
    }
    .template {
        background-color: grey;
    }
    .editbtn {
        margin: .3em;
        align-items: center;
        margin-top: .2em;
    }
</style>
