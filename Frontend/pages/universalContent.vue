<template>
  <div class="container">
    
    <b-card title="Lista de Contenidos">
      <b-table
        stacked
        responsive
        :items="universalContents"
        
      >
        <template  v-slot:cell(icon)="data">
          
          <b-img :src="data.item.icon" width="100px" height="100px"></b-img>
         
        </template>
      </b-table>
    </b-card>
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



<style>
</style>