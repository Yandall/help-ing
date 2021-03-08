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
            :to="{ name: 'createPost' }"
          >Crear Publicación</b-button>
          <b-button
            variant="light"
            size="sm"
            v-if="mod"
            style="margin-inline: 5px"
            :to="{ name: 'createUC' }"
          >Crear Contenido Universal</b-button>
          <b-button
            variant="light"
            size="sm"
            style="margin-inline: 5px"
            :to="{ name: 'universalContent' }"
          >Contenido Universal</b-button>
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
            <b-form-input size="sm" class="mr-sm-2" v-model="search" placeholder="Buscar" style="min-width: 300px"></b-form-input>
            <b-button size="sm"  class="btnBuscar" @click="searchPost">Buscar</b-button>

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
      <h1 class="title" id="home.title" v-if="!isSearching">
        Ultimas publicaciones
      </h1>
      <h1 class="title" id="home.search" v-if="isSearching">
        Búsqueda
      </h1>

        <b-modal id="modal-1" title="Perfil" :hide-footer="true">
          <img :src="image" height="100" width="100" style="margin: 10px" />
          <p class="my-4">Nombre de usuario: {{ nickname }}</p>
          <p class="my-4">Correo electronico: {{ email }}</p>
        </b-modal>


      <b-list-group>
        <b-list-group-item
          :key="item._id"
          v-for="item in post_list"
          class="card-post"
          style="border: none"
        >
          <b-card
            :title="item.title"
            :img-src="'posts/' + item.file"
            img-alt=""
            img-bottom
            tag="article"
            style="max-width: 60rem;"
            class="mb-2"
            :footer="item.author + ' ' + item.post_date"

          >
            <b-card-text>
              {{ item.body }}
              <br>Tags: <b-badge pill variant="secondary" v-for="tag in item.tags" style="margin-right: 5px">{{tag}}</b-badge>
            </b-card-text>

          </b-card>
        </b-list-group-item>
      </b-list-group>

      <div class="overflow-auto">
        <b-pagination-nav
          v-if="!isSearching"
          :link-gen="linkGen"
          :number-of-pages="numberPages"
          use-router
          @change="loadPosts($event)"
          align="center"
        ></b-pagination-nav>
      </div>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import config from "../assets/config";

export default {
  beforeMount() {
    this.loadPosts(new URLSearchParams(location.search).get("page"));
    this.cargarPerfil();

  },
  data() {
    return {
      post_list: null,
      url: `${config.url_api}/post`,
      nickname: "",
      email: "",
      image: "",
      fields: [
        {
          key: "title",
          label: "Title",
          variant: "dark"
        },
        {
          key: "body",
          label: "Body"
        }
      ],
      numberPages: 3,
      perPage: 5,
      typeSearch: 'title',
      search: '',
      mod: false,
      isSearching: false
    };
  },
  methods: {
    searchPost(){
      this.isSearching = true
      Axios.get(`${this.url}/${this.typeSearch}/${this.search}`)
        .then(res => {
          let data = res.data;
          data.forEach(item => {
            item.post_date = item.post_date.substring(0, 10);
          });
          console.log(data)
          this.post_list = data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    loadPosts(index) {
      index = index || 1;
      Axios.get(this.url + "/" + index, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0"
        }
      })
        .then(res => {
          let data = res.data.values;
          data.forEach(item => {
            item.post_date = item.post_date.substring(0, 10);
          });
          console.log(data)
          this.post_list = data;
          this.numberPages = Math.ceil(res.data.cantPosts / this.perPage);
          console.log(this.numberPages);
        })
        .catch(e => {
          console.log(e);
        });
    },
    linkGen(pageNum) {
      return pageNum === 1 ? "?" : `?page=${pageNum}`;
    },
    logOut() {
      this.$router.push("/login");
      localStorage.setItem("nickname", "");
      localStorage.setItem("email", "");
      localStorage.setItem("image", "");
    },
    cargarPerfil() {
      this.nickname = localStorage.getItem("nickname");
      this.email = localStorage.getItem("email");
      this.image = localStorage.getItem("image");
      if(localStorage.getItem("range") == 1){
        this.mod = false
      } else {
        this.mod = true
      }
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

.navbar {
  background-color: #A00001;
}
</style>

<style src="../css/home.css" />



