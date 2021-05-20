<template>
    <v-container class="outer-liked" data-app>
    <v-card elevation="10" outlined shaped class="grey">
        <v-row>
            <v-col class="icon-liked">
                <v-icon v-if="item=='bar'" x-large color="white">mdi-table-chair</v-icon>
                <v-icon v-else-if="item=='brand'" x-large color="white">mdi-billboard</v-icon>
                <v-icon v-else x-large color="white">mdi-glass-mug-variant</v-icon>
            </v-col>
            <v-col v-if="item=='bar'" class="bar-col">
                <v-row>
                    <b>{{response['barName']}}</b>
                </v-row>
                <v-row v-if="response['neighborhood']">
                    <i>{{response['neighborhood']}}, {{response['location']}}</i>
                </v-row>
                <v-row v-else>
                    <i>{{response['location']}}</i>
                </v-row>
            </v-col>
            <v-col v-else-if="item=='brand' && response['type']" class="bar-col">
                <v-row>
                    <b>{{response['brandName']}}</b>
                </v-row>
                <v-row>
                    <i>{{response['type']}}</i>
                </v-row>
            </v-col>
            <v-col v-else-if="item=='brand' && !response['type']" class="name">
                <b>{{response['brandName']}}</b>
            </v-col>
            <v-col v-else class="name">
                <b>{{response['drinkName']}}</b>
            </v-col>
            <v-col v-if="mylikes" align="right">
                <v-btn @click="deleteItem" white icon x-large class="delete-liked">
                <v-icon>mdi-delete</v-icon>
                </v-btn>
            </v-col>
            <v-col v-else-if="newlike && hasLikedItem">
                <v-btn white icon @click="unLikeItem" class="heart-icon"><v-icon x-large>mdi-heart</v-icon></v-btn>
            </v-col>
            <v-col v-else-if="newlike && !hasLikedItem">
                <v-btn white icon @click="likeItem" class="heart-icon"><v-icon x-large>mdi-heart-outline</v-icon></v-btn>
            </v-col>
        </v-row>
    </v-card>
    </v-container>
</template>

<script lang='ts'>
import { ref, computed, defineComponent} from '@nuxtjs/composition-api';

export default defineComponent({
  name: "likeditem",
  props: {
    response: {
        type: Object,
        required: true
    },
    item: {
        type: String,
        required: true
    },
    mylikes: {
        type: Boolean,
        required: true
    },
    newlike: {
        type: Boolean,
        required: true
    }
  },
  setup(props) {


    const hasLikedItem = computed(() => {
      if (props.newlike && props.response.userLiked == true) {
        return true;
      }
      return false;
    });

     const nbhood = computed(() => {
        if (props.item.toLowerCase() == 'bar' && props.response.neighborhood) {
          return props.response.neighborhood.toLowerCase()
            .split(' ')
            .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');
        }
        else {
          return '';
        }
      })

    function postBody(this: any) {
        if (this.item.toLowerCase() == 'bar') {
            if (this.response['neighborhood']) {
                return {'username': this.$store.state.user.displayName, 'bar': this.response['barName'], 'location': this.response['location'], 'neighborhood': this.response['neighborhood']};
            } else {
                return {'username': this.$store.state.user.displayName, 'bar': this.response['barName'], 'location': this.response['location'], 'neighborhood': ''};
            }
        } else if (this.item.toLowerCase() == 'brand') {
            return {'username': this.$store.state.user.displayName, 'brand': this.response['brandName'], 'type': this.response['type']};
        } else {
            return {'username': this.$store.state.user.displayName, 'drink': this.response['drinkName']};
        }
    }

    async function likeItem(this: any) {
      const token = await this.$fire.auth.currentUser.getIdToken();
      this.$axios.setHeader('Authorization', `Bearer ${token}`);
      let postData = this.postBody(); 
      await this.$axios.$post(`/userapi/user/${this.item.toLowerCase()}`, postData );
      this.response['userLiked'] = true;
    }
    async function unLikeItem(this: any) {
        let deleteData = {'username': this.$store.state.user.displayName, 'uuid': this.response['uuid']}
        const token = await this.$fire.auth.currentUser.getIdToken();
        this.$axios.setHeader('Authorization', `Bearer ${token}`);
        await this.$axios.$delete(`/userapi/user/${this.item}`, { data: deleteData });
        this.response['userLiked'] = false;
    }

    async function deleteItem(this: any) {
        let deleteData = {'username': this.$store.state.user.displayName, 'uuid': this.response['uuid']}
        const token = await this.$fire.auth.currentUser.getIdToken();
        this.$axios.setHeader('Authorization', `Bearer ${token}`);
        await this.$axios.$delete(`/userapi/user/${this.item}`, { data: deleteData });
        location.reload();
    }
     
      return { nbhood, deleteItem, likeItem, unLikeItem, postBody, hasLikedItem };
  }
});
</script>

<style>
    .icon-liked {
        margin: .5em;
        margin-left: 3em;
    }
 
    .outer-liked {
        background-color: black;
        margin-bottom: 2rem;
        width: 40em;
    }

    .name {
        font-size: 1.25em;
        margin-right: 6em;
        margin-top: .3em;
    }
    .bar-col {
        font-size: 1em;
        margin-right: 6em;
        margin-top: .6em;
        margin-bottom: .6em;
        vertical-align: middle;
    }
    .delete-liked {
        margin-top: .4em;
        margin-right: 3em;
    }
    .heart-icon {
        margin-top: 1em;
        margin-left: 2em;
    }
</style>
