<template>
  <div class="container">
    <div>
      <h1 class="title">Helping
        <b-button variant="success" size="lg" :to="{name: 'createPost'}" style="margin: 30px 0 15px 0">Create!</b-button>

      </h1>
            
      <b-list-group>
        <b-list-group-item :key="item._id" v-for="item in post_list" class="card-post" style = "border: none"><b-card
          :title="item.title"
          :img-src="'posts/' + item.file"
          img-alt=""
          img-top
          tag="article"
          style="max-width: 60rem;"
          class="mb-2"
          :footer="item.author + ' ' + item.post_date"
          >
          <b-card-text>
            {{item.body}}
          </b-card-text>
        </b-card>
  </b-list-group-item>
      </b-list-group>
      
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import config from "../assets/config"

export default {
  beforeMount() {
    this.loadPosts()
  },
  data(){
    return {
      post_list : null,
      url: `${config.url_api}/post`,
      fields:[
        {
          key:"title",
          label:"Title",
          variant:"dark"
        },
        {
          key:"body",
          label:"Body"
          
        }
      ]
    }
  },
  methods: {
    loadPosts() {
      Axios.get(this.url)
        .then(res => {
          let data = res.data
          data.forEach(item => {
            console.log( item.post_date)
            item.post_date = item.post_date.substring(0, 10)
          })
          this.post_list = res.data;
        })
        .catch(e => {
          console.log(e);
        });
    },
  }
  
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.card-post {
  margin: 15px 0 15px 0;
}

</style>
