<template>
  <div class="container">
    
     <h1 class="title" id="home.title">
       Contenido Universal</h1>
      <b-list-group>
        <b-list-group-item
          :key="item._id"
          v-for="item in universalContents"
          class="card-post"
          style="border: none"
        >
         <b-card
            :title="item.title"
            :img-src="item.icon"
            img-alt=""
            img-top
            style="max-width: 45rem;"
            class="mb-2"
            
            :footer="item.url">
              <b-card-text>
               Autor: {{item.author}}
               <br>
               Tipo: {{item.type}}
             
              <br>
            </b-card-text>
            <div></div>
          </b-card>
        </b-list-group-item>
      </b-list-group>
  </div>
</template>

<script>
import axios from "axios";
import config from "../assets/config";
import Vue from "vue";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);


export default {
    beforeMount() {},

    data() {
        return {
            universalContents: [],


        };

    },

    created() {
        this.loadUC();
    },

    computed: {},

    methods: {



        loadUC() {
            console.log(config.url_api + "/uc")
            axios.get(config.url_api + "/uc")
            .then(res => {
               
                let data = res.data;

                for(let i in data){
                    let uc = {title: "", icon: "", author: "", url: "", file: "", type: "" };
                    uc.file = data[i].file;
                    uc.title = data[i].title;
                    uc.author = data[i].author;
                    uc.url = data[i].url;
                    uc.type = data[i].type;
                    uc.icon = data[i].icon;
                    this.universalContents.push(uc);
                    console.log(uc)

                }
            })
            .catch(err => console.log(err))
        }


    }

};


</script>


<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  max-width: 900px;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
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

<style>
.card{
  width: auto;
}

.card-img-top{
  height: auto;
  max-width: 700px;
}

</style>