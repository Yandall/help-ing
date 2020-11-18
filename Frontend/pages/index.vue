<template>
  <div class="container">
    <div>
      <h1 class="title">Helping
        <b-button variant="success" size="lg" :to="{name: 'createPost'}" style="margin: 30px 0 15px 0">Create!</b-button>
      </h1>

      <b-list-group>
        <b-list-group-item :key="item._id" v-for="item in post_list" class="card-post" style = "border: none">
          <b-card
          :title="item.title"
          :img-src="'posts/' + item.file"
          img-alt=""
          img-top
          tag="article"
          style="max-width: 60rem;"
          class="mb-2"
          :footer="item.author + ' ' + item.post_date">
          <b-card-text>
            {{item.body}}
          </b-card-text>
        </b-card>
        </b-list-group-item>
      </b-list-group>

      <div class="overflow-auto">
        <b-pagination-nav :link-gen="linkGen" :number-of-pages="numberPages" use-router @change="loadPosts($event)"
        align="center"></b-pagination-nav>
      </div>

    </div>
  </div>
</template>

<script>
import Axios from "axios";
import config from "../assets/config"

export default {
  beforeMount() {
    this.loadPosts(new URLSearchParams(location.search).get('page'))
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
      ],
      numberPages: 3,
      perPage: 5
    }
  },
  methods: {
    loadPosts(index) {
      index = index || 1
      Axios.get(this.url + '/' + index, {headers: {'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',}})
        .then(res => {
          let data = res.data.values
          data.forEach(item => {
            item.post_date = item.post_date.substring(0, 10)
          })
          this.post_list = data;
          this.numberPages = Math.ceil((res.data.cantPosts / this.perPage))
          console.log(this.numberPages)
        })
        .catch(e => {
          console.log(e);
        });
    },
    linkGen(pageNum) {
      return pageNum === 1 ? '?' : `?page=${pageNum}`
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
