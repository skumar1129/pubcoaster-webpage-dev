<template>
    <v-container class="outer" @click="goToSinglePost" data-app>
    <v-card elevation="6" outlined shaped class="grey">
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
            <v-col v-if="response['anonymous'] == false" class="middle">
                <i>{{response['createdBy']}}</i>
            </v-col>
            <v-col v-if="response['numLikes']==1" align="right" class="middle">
                {{response['numLikes']}} like
            </v-col>
            <v-col v-else-if="response['numLikes']==0" align="right" class="middle">
                No likes yet
            </v-col>
            <v-col v-else align="right" class="middle">{{response['numLikes']}} likes </v-col>
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
</template>

<script lang='ts'>
import { ref, computed, defineComponent} from '@nuxtjs/composition-api';
import moment from 'moment';

export default defineComponent({
  name: "feedpost",
  props: {
    response: {
        type: Object,
        required: true
    }
  },
  setup(props) {
      function getMoment(date: any) {
          let mydate = new Date(date);
          return moment.utc(mydate, 'YYYY-MM-DD hh:mm:ss').local().fromNow();
      }
      function goToSinglePost(this: any) {
        this.$router.push(`/singlepost/${props.response.uuid}`);
      }
      const picture = ref(null)
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
      })
      const bar = computed(() => {
        if (props.response.bar) {
          return props.response.bar.toLowerCase()
            .split(' ')
            .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
        }
      })

      return { picture, getMoment, goToSinglePost, bar, nbhood }
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
    .busyness {
        font-size: 1.5rem;
    }
    .middle {
        margin: .5rem;
        font-size: 1.5rem;
    }
    .footer {
        margin: .5rem;
        font-size: 1rem;
    }
    .outer {
        background-color: black;
        margin-bottom: 1rem;
    }
    .num-comments {
        margin: .3rem;
        font-size: 1.5rem;
        height: 4.35rem;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>
