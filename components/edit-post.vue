<template>
    <v-container class="outer" @click="goToSinglePost" v-if="!edit" data-app>
      <v-card elevation="6" outlined shaped color="grey">
        <v-row>
            <v-col class="title">
                <h1>{{bar}}</h1>
            </v-col>
            <v-col align="center" class="title">
                <v-btn
                elevation="4"
                depressed
                large
                rounded
                color="primary"
                @click="edit=true"
                >Edit Post</v-btn>
            </v-col>
            <v-col align="right" class="title">
                <h3>Rating: {{response['rating']}} / 10</h3>
            </v-col>
        </v-row>
        <v-divider color="black" class="divider"> </v-divider>
        <v-row>
            <v-col align="center">
                <h1>{{response['description']}}</h1>
            </v-col>
        </v-row>
        <v-row v-if="response['picLink']">
            <v-col align="center">
                <v-img :src="response['picLink']" max-height="480" max-width="820"></v-img>
            </v-col>
        </v-row>
        <v-divider color="black" class="divider"> </v-divider>
        <v-row>
            <v-col class="middle">
                <i>{{response['createdBy']}}</i>
            </v-col>
            <v-col v-if="response['numLikes']==1" align="right" class="middle">
                {{response['numLikes']}} like
            </v-col>
            <v-col v-else-if="response['numLikes']==0" align="right" class="middle">
                No likes yet
            </v-col>
            <v-col v-else align="right" class="middle">{{response['numLikes']}} likes</v-col>
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
        <v-row v-if="response['numComments'] == 0" class="num-comments">
            No comments yet
        </v-row>
        <v-row v-else-if="response['numComments'] != 1" class="num-comments">
            {{response['numComments']}} Comments
        </v-row>
        <v-row v-else class="num-comments">
            {{response['numComments']}} Comment
        </v-row>
      </v-card>
    </v-container>
    <v-container v-else class="outer">
        <v-card elevation="6" outlined shaped color="grey">
            <v-row>
            <v-col class="title">
                <v-text-field
                    label="Name of Bar"
                    v-model="barName"
                    filled
                    clearable
                    dense
                    rounded
                    outlined
                    :placeholder="bar"
                ></v-text-field>
            </v-col>
            <v-col align="center" class="title">
                <v-btn
                elevation="4"
                depressed
                large
                rounded
                color="error"
                @click="cancelEdit"
                >Cancel Edit</v-btn>
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
        <v-divider color="black" class="divider"> </v-divider>
        <v-row>
            <v-col align="center">
                <v-text-field
                    label="Post Description"
                    v-model="description"
                    filled
                    clearable
                    dense
                    rounded
                    outlined
                    :placeholder="response['description']"
                ></v-text-field>
            </v-col>
        </v-row>
        <!--TODO: add someway to edit the picture at a later point-->
        <v-divider color="black" class="divider"> </v-divider>
        <v-row>
            <v-col align="left">
                <v-btn @click="deletePost" icon class="title" large>
                <v-icon>mdi-delete</v-icon>
                </v-btn>
                <v-btn
                elevation="4"
                depressed
                large
                rounded
                color="primary"
                class="title"
                @click="saveEdits"
                >Save Edits</v-btn>
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
                    outlined
                    class="neighborhood"
                    :placeholder="nbhood"
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
                ></v-text-field><b class="ml-4">  ,  {{response['location']}}</b>
                </div>
            </v-col>
        </v-row>
        </v-card>
    </v-container>
</template>

<script lang='ts'>
import { ref, computed, defineComponent} from '@nuxtjs/composition-api';
import moment from 'moment';

export default defineComponent({
  name: "editpost",
  props: {
    response: {
        type: Object,
        required: true
    }
  },
  setup(props) {
      function getMoment(date: any) {
          let mydate = new Date(date);
          return moment.utc(mydate, 'YYYY-MM-DD hh:mm:ss').local().fromNow()
      }
      async function saveEdits(this: any) {
          let postData = {
            picLink: null,
            neighborhood: neighborhood.value,
            rating: rating.value,
            bar: barName.value,
            description: description.value
          };
          const token = await this.$fire.auth.currentUser.getIdToken();
          this.$axios.setHeader('Authorization', `Bearer ${token}`);
          let data = await this.$axios.$patch(`/postapi/post/${props.response['uuid']}`, postData);
          edit.value = false;
          //reset values
          barName.value = null;
          rating.value = null;
          description.value = null;
          neighborhood.value = null;
          location.reload();
      }
      async function deletePost(this: any) {
          const token = await this.$fire.auth.currentUser.getIdToken();
          this.$axios.setHeader('Authorization', `Bearer ${token}`);
          let data = await this.$axios.$delete(`/postapi/post/${props.response['uuid']}`);
          edit.value = false;
          location.reload();
      }
      function cancelEdit(this: any) {
          edit.value = false;
          //reset values
          barName.value = null;
          rating.value = null;
          description.value = null;
          neighborhood.value = null;
      }
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
      function goToSinglePost(this: any) {
        this.$router.push(`/singlepost/${props.response.uuid}`);
      }
      const picture = ref(null)
      const edit = ref(false)
      const barName = ref(null)
      const rating = ref(null)
      const description = ref(null)
      const neighborhood = ref(null)

      return { picture, getMoment,
      edit, barName, rating, description,
      neighborhood, saveEdits, deletePost,
      cancelEdit, bar, nbhood, goToSinglePost }
  }
});
</script>

<style>
    .divider {
        margin-top: .75rem;
        margin-bottom: .75rem;
        padding: .05em;
    }
    .title {
        margin: .5rem;
    }
    .middle {
        margin: .5rem;
        font-size: 1.5rem;
    }
    .busyness {
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
        font-size: 1rem;
        box-shadow: 0 0 3pt 2pt darkgrey;
    }
    .selectRating {
        margin: .5rem;
        font-size: 1.35rem;
        font-weight: bold;
    }
    .locationInput {
        margin: .6rem;
        font-size: 1.4rem;
        font-weight: bold;
    }
    .neighborhood {
        width: 70%;
        display: inline-block;
        font-weight: bold;
    }
    .num-comments {
        margin: .3rem;
        font-size: 1.5rem;
        display: flex;
        height: 4.35rem;
        justify-content: center;
        align-items: center;
    }
</style>
