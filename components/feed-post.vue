<template>
    <v-container class="outer" @click="goToSinglePost">
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
            <v-col v-else-if="response['numLikes']==0" align="right" class="middle">
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
        <v-row v-if="response['numComments'] == 0" class="num-comments">
            No comments yet
        </v-row>
        <v-row v-else-if="response['numComments'] != 1" class="num-comments">
            <v-col>
                {{response['numComments']}} Comments
            </v-col>
        </v-row>
        <v-row v-else class="num-comments">
            <v-col>
                {{response['numComments']}} Comment
            </v-col>
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
      function getMoment(this: any, date: any) {
          let mydate = new Date(date);
          return moment.utc(mydate, 'YYYY-MM-DD hh:mm:ss').local().fromNow()
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
    .outer {
        background-color: black;
        margin-bottom: 1rem;
    }
    .inner {
        background-color: white;
    }
    .num-comments {
        margin: .2rem;
        font-size: 1rem;
    }
</style>
