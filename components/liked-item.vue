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
            <v-col v-else-if="item=='brand'" class="name">
                <b v-if="item=='brand'">{{response['brandName']}}</b>
            </v-col>
            <v-col v-else class="name">
                <b>{{response['drinkName']}}</b>
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
    }
  },
  setup(props) {
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
     
      return { nbhood };
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
        font-size: 1.5em;
        margin-right: 6em;
    }
    .bar-col {
        font-size: 1em;
        margin-right: 6em;
        margin-top: .6em;
        margin-bottom: .6em;
        vertical-align: middle;
    }

</style>
