<template>

  <div>
  <b-navbar toggleable="lg" type="dark">
    <b-navbar-brand href="home">Helping</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-button
          variant="light"
          size="sm"
          style="margin-inline: 5px"
          :to="{ name: 'createUC' }"
        >Crear Contenido Universal
        </b-button>

        <b-button
          variant="light"
          size="sm"
          style="margin-inline: 5px"
          :to="{ name: 'universalContent' }"
        >Contenido Universal
        </b-button>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-form-checkbox
            id="checkbox-tags"
            v-model="typeSearch"
            name="checkbox-tags"
            value="tags"
            unchecked-value="title"
            style="margin-right: 10px; color: white;"
          >
            Tags
          </b-form-checkbox>
          <b-form-input size="sm" class="mr-sm-2" v-model="search" placeholder="Buscar"
                        style="min-width: 300px"></b-form-input>
          <b-button size="sm" class="btnBuscar" @click="searchPost">Buscar</b-button>

        </b-nav-form>

        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template #button-content>
            <em>Usuario</em>
          </template>
          <b-dropdown-item href="#" v-b-modal.modal-1>Perfil</b-dropdown-item>
          <b-dropdown-item href="#" @click="logOut">Salir</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>


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
  </div>
</template>

<script>
import axios from "axios";
import config from "../assets/config";
import Vue from "vue";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import Axios from "axios";
Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);


export default {
    beforeMount() {},

    data() {
        return {
            universalContents: [],
            url: `${config.url_api}/uc`,
            typeSearch: 'title',
            search: '',
            isSearching: false,
            post_list: null


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
        },

      logOut() {
        this.$router.push("/login");
        localStorage.setItem("nickname", "");
        localStorage.setItem("email", "");
        localStorage.setItem("image", "");
      },

      searchPost() {
        //TO DO
      },


    }

};


</script>

<style src="../css/uc.css"/>
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
