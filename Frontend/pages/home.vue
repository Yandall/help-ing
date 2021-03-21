<template>
  <div>
    <b-navbar toggleable="lg" type="dark">
      <b-navbar-brand href="home">Helping</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>



      <b-collapse id="nav-collapse" is-nav>

        <b-navbar-nav>
          <b-nav-item-dropdown text="Temas" class="topicsDropDown">
            <b-dropdown-item v-for="(topic, index) in topics" :key="index" @click="changeTopic(topic)">{{topic}}</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>

        <b-navbar-nav>

          <b-button
            variant="light"
            size="sm"
            style="margin-inline: 5px"
            :to="{ name: 'createPost' }"
          >Crear Publicación
          </b-button>
          <b-button
            variant="light"
            size="sm"
            v-if="mod"
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

    <b-modal id="modal-1" title="Perfil">
      <img :src="image" height="100" width="100" style="margin: 10px"/>
      <p class="my-4">Nombre de usuario: {{ nickname }}</p>
      <p class="my-4">Correo electronico: {{ email }}</p>
    </b-modal>

    <div class="container">
      <h1 class="title" id="home.title" v-if="!isSearching">
        Ultimas publicaciones
      </h1>
      <h1 class="title" id="home.search" v-if="isSearching">
        Búsqueda
      </h1>

      <b-list-group>
        <b-list-group-item
          :key="item._id"
          v-for="item in post_list"
          class="card-post"
          style="border: none"
        >

          <h2>{{ item.title }}</h2>
          <b-card
            :img-src="item.file"
            img-alt=""
            tag="article"
            img-top
            style="max-width: 60rem;"
            class="mb-2"
            footer-tag="footer"
          >
            <b-card-text>

              {{ item.body }}

                <br>Tags: <b-badge pill variant="secondary" v-for="(tag, index) in item.tags" :key="index" style="margin-right: 5px">{{tag}}</b-badge>
            </b-card-text>
            <div class="link_file">
            <b-link  v-if="checkPDFFormat(item.file)" :href="item.file" >{{item.file}}</b-link>
            </div>
            <template #footer>

              <div class="post-footer">
                <div v-if="!item.likes.includes(user_id)">
                  <b-button size="sm" variant="secondary" class="mb-2 like-button-no-vote"
                            @click="updateLike(item, false)">
                    <b-icon icon="heart-fill" aria-label="Help"></b-icon>
                    <p>{{ item.nlikes }}</p>
                  </b-button>
                </div>
                <div v-else>
                  <b-button size="sm" variant="secondary" class="mb-2 like-button-vote" @click="updateLike(item, true)">
                    <b-icon icon="heart-fill" aria-label="Help"></b-icon>
                    <p>{{ item.nlikes }}</p>
                  </b-button>
                </div>

                <div class="post-footer-info">
                  {{ item.author }} {{ item.post_date }}
                </div>
              </div>

            </template>
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
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'

export default {
  beforeMount() {
    this.cargarPagina()
    this.loadPosts(new URLSearchParams(location.search).get("page"));
    this.cargarPerfil();


  },
  data() {
    return {
      post_list: null,
      url: `${config.url_api}`,
      nickname: "",
      email: "",
      image: "",
      user_id: "",
      topics:{
        0: 'Base de datos',
        1: 'Fundamentos',
        2: 'Integrales'
      },
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
      numberPages: 1,
      perPage: 10,
      typeSearch: 'title',
      search: '',
      mod: false,
      isSearching: false
    };
  },

  methods: {
    cargarPagina() {
      let url = config.url_api + "/login/verify";
      let token = localStorage.getItem("token");
      this.token = token;
      Axios
        .get(url, {headers: {token: token}})
        .then((response) => {
        })
        .catch((error) => {
          console.log(error);
          this.$router.push("/login");
          localStorage.setItem("nickname", "")
          localStorage.setItem("email", "")
          localStorage.setItem("range", "")
          localStorage.setItem("id", "")
        });
    },
    searchPost() {
      this.isSearching = true
      console.log(`${this.url}/post/${this.typeSearch}/${this.search}`)
      Axios.get(`${this.url}/post/${this.typeSearch}/${this.search}`)
        .then(res => {
          let data = res.data;
          data.forEach(item => {
            item.post_date = item.post_date.substring(0, 10);
          });

          this.post_list = data;
        })
        .catch(e => {
          console.log(e);
        });
    },
    loadPosts(index) {
      index = index || 1;
      Axios.get(this.url + "/post/" + index, {
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
            item.nlikes = (item.likes === "") ? item.likes.length - 1 : item.likes.length
          });

          this.post_list = data;
          this.numberPages = Math.ceil(res.data.cantPosts / this.perPage);
        })
        .catch(e => {
          console.log(e);
        });
    },
    updateLike(post, isOldLike) {
      let payload = {id_post: post._id, id_user: this.user_id}
      Axios.post(this.url + "/post/updateLikes", payload)
      .then(res => {
        if (isOldLike) {
          post.nlikes --
          let idx = post.likes.indexOf(this.user_id)
          post.likes.splice(idx, 1)
        } else {
          post.nlikes ++
          post.likes.push(this.user_id)
        }
      }).catch(e => {
        console.log(e)
      })
    },
    changeTopic(topic) {
      topic = topic.replace(/\s/g, "")
      this.$router.push({path: `/${topic}`})
    },
    logOut() {
      this.$router.push("/login");
      localStorage.setItem("nickname", "");
      localStorage.setItem("email", "");
      localStorage.setItem("image", "");
    },
    cargarPerfil() {
      if (localStorage.getItem("nickname") == "" || localStorage.getItem("email") == "") {
        this.$router.push("/login")

      } else {
        this.nickname = localStorage.getItem("nickname");
        this.email = localStorage.getItem("email");
        this.image = localStorage.getItem("image");
        this.user_id = localStorage.getItem("id");
        console.log("range",localStorage.getItem("range"))
        if (localStorage.getItem("range") == null) {
          this.mod = false
        } else {
          this.mod = localStorage.getItem("range") != 1;
        }
        localStorage.removeItem("range")
        console.log("Range later", localStorage.getItem("range"))
      }
    },

    linkGen(pageNum) {
      return pageNum === 1 ? "?" : `?page=${pageNum}`;
    },

    checkPDFFormat(url){
      const regex = /.pdf/;
      return (".pdf" == url.match(regex));


    },
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

.post-footer {
  height: inherit;
  width: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

.like-button-no-vote {
  margin-right: 15px;
  margin-top: 0.5rem;
  background-color: rgba(0, 0, 0, 0);
  color: darkgrey;
  border-color: darkgrey;
  border-radius: 1rem;
  display: flex;
  flex-direction: row;
}

.like-button-no-vote p {
  margin-bottom: 0;
  margin-left: 0.3rem;
}

.like-button-no-vote:hover {
  margin-right: 15px;
  margin-top: 0.5rem;
  background-color: #A00001;
  color: white;
  border-color: #A00001;
}

.like-button-vote {
  margin-right: 15px;
  margin-top: 0.5rem;
  background-color: #A00001;
  color: white;
  border-color: #A00001;
  border-radius: 1rem;
  display: flex;
  flex-direction: row;
}

.like-button-vote p {
  margin-bottom: 0;
  margin-left: 0.3rem;
}

.like-button-vote:hover {
  margin-right: 15px;
  margin-top: 0.5rem;
  background-color: rgba(0, 0, 0, 0);
  color: darkgrey;
  border-color: darkgrey;
}

.post-footer-info {
  color: darkgrey;
}

.topicsDropDown a span{
  color: white;
}

</style>




