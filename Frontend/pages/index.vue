<template>
  <div>
    <b-navbar toggleable="lg" type="dark">
      <b-navbar-brand href="/">Helping</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item-dropdown text="Temas" class="topicsDropDown">
            <b-dropdown-item
              v-for="(topic, index) in topics"
              :key="index"
              @click="changeTopic(topic)"
              >{{ topic }}
            </b-dropdown-item>
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
            style="margin-inline: 5px"
            @click="showModalTopic"
            v-if="mod"
            >Crear Tema
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
              style="margin-right: 10px; color: white"
            >
              Tags
            </b-form-checkbox>
            <b-form-input
              size="sm"
              class="mr-sm-2"
              v-model="search"
              placeholder="Buscar"
              style="min-width: 300px"
            ></b-form-input>
            <b-button size="sm" class="btnBuscar" @click="searchPost"
              >Buscar</b-button
            >
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
      <img :src="image" height="100" width="100" style="margin: 10px" />
      <p class="my-4">Nombre de usuario: {{ nickname }}</p>
      <p class="my-4">Correo electronico: {{ email }}</p>
    </b-modal>

    <div class="container">
      <h1 class="title" id="home.title" v-if="!isSearching">
        Ultimas publicaciones
      </h1>
      <h1 class="title" id="home.search" v-if="isSearching">Búsqueda</h1>

      <b-list-group>
        <b-list-group-item
          :key="item._id"
          v-for="item in post_list"
          class="card-post"
          style="border: none"
        >
          <h2 class="title-link" @click="getPostData(item._id)">{{ item.title }}</h2>
          <b-card
            :img-src="item.file"
            img-alt=""
            tag="article"
            img-top
            style="max-width: 60rem"
            class="mb-2"
            footer-tag="footer"
          >
            <b-card-text>
              {{ item.body }}

              <br />Tags:
              <b-badge
                pill
                variant="secondary"
                v-for="(tag, index) in item.tags"
                :key="index"
                style="margin-right: 5px"
                >{{ tag }}
              </b-badge>
            </b-card-text>
            <div class="link_file">
              <b-icon
                icon="file-earmark-arrow-down"
                v-if="checkPDFFormat(item.file)"
              ></b-icon>
              <b-link v-if="checkPDFFormat(item.file)" :href="item.file">{{
                item.file
              }}</b-link>
            </div>

            <template #footer>
              <div class="post-footer">
                <div v-if="!item.likes.includes(user_id)">
                  <b-button
                    size="sm"
                    variant="secondary"
                    class="mb-2 like-button-no-vote"
                    @click="updateLike(item, false)"
                  >
                    <b-icon icon="heart-fill" aria-label="Help"></b-icon>
                    <p>{{ item.nlikes }}</p>
                  </b-button>
                </div>
                <div v-else>
                  <b-button
                    size="sm"
                    variant="secondary"
                    class="mb-2 like-button-vote"
                    @click="updateLike(item, true)"
                  >
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
          <b-table striped hover :items="item.comments" :fields="fields2" ></b-table>
          <b-input-group :prepend="nickname">
            <b-form-textarea
              class="comment-input"
              maxlength="300"
              :ref="item._id"
              :id="item._id"
            ></b-form-textarea>
            <b-input-group-append>
              <b-button @click="sendComment(item._id)">Comentar</b-button>
            </b-input-group-append>
          </b-input-group>

        </b-list-group-item>
      </b-list-group>

      <div class="overflow-auto">
        <b-pagination-nav
          v-if="!isSearching"
          :link-gen="linkGen"
          :number-of-pages="numberPages"
          use-router
          @change="loadPosts"
          align="center"
        ></b-pagination-nav>
      </div>
    </div>

    <b-modal ref="modalCreateTopic" hide-footer title="Crear Tema">
      <form ref="form" @submit.stop.prevent="solicitud">
        <b-form-group
          label="Tema"
          label-for="topic"
          invalid-feedback="El nombre del tema es obligatorio"
        >
          <b-form-input
            id="topic"
            v-model="topicInput"
            required
            size="lg"
          ></b-form-input>
        </b-form-group>
      </form>
      <b-button @click="createTopic()" variant="outline-danger">Crear</b-button>
    </b-modal>
  </div>
</template>

<script>
import Axios from "axios";
import config from "../assets/config";
import "bootstrap-vue/dist/bootstrap-vue-icons.min.css";

export default {
  beforeMount() {
    //se hace un llamado a los métodos recien se carga la pagina, para mostrar la información
    this.loadPosts(new URLSearchParams(location.search).get("page"));
    this.verifyToken();
    this.loadProfile();
    this.loadTopics();
  },

  data() {
    return {
      //se inicializan variables
      post_list: null,
      url: `${config.url_api}`,
      nickname: "",
      email: "",
      image: "",
      user_id: "",
      topics: {},
      token: "",
      comments:[],
      fields2:[{key:'user', label:'Usuario'},{key:'comment', label: 'Comentario'},{
        // A virtual column with custom formatter
        key: 'date',
        label: 'Fecha comentario',
        formatter:'dateSimplified'
      }],
      fields: [
        {
          key: "title",
          label: "Title",
          variant: "dark",
        },
        {
          key: "body",
          label: "Body",
        },

      ],
      numberPages: 1,
      perPage: 10,
      typeSearch: "title",
      search: "",
      mod: false,
      isSearching: false,
      topicInput: "",
      inputComment: "",
    };
  },

  methods: {
    dateSimplified(value){
      return value!=null ? value.substring(0, 10) : value
    },
    /**
     * Método para validar que el token que esta en el local storage si sea un token valido
     */
    verifyToken() {
      let token = document.cookie.split(";").toString().split("token=")[1];
      let url = config.url_api + "/login/verify";
      this.token = token;
      Axios.get(url, { headers: { token: token } })
        .then((response) => {
          return true;
        })
        .catch((error) => {
          this.$router.push("/login");
        });
    },

    /**
     * Método para cargar todos los Post que estan creados, enviando una petición(get) al backend, y luegos mostrarlos
     */
    loadPosts() {
      let index = this.$route.query.page ? this.$route.query.page : 1;
      let topic = this.$route.query.topic ? this.$route.query.topic : "home";
      Axios.get(`${this.url}/post/${topic}/${index}`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
        .then((res) => {
          let data = res.data.values;
          data.forEach((item) => {
            item.post_date = item.post_date.substring(0, 10);
            item.nlikes =
              item.likes === "" ? item.likes.length - 1 : item.likes.length;
          });

          this.post_list = data;

          this.numberPages = Math.ceil(res.data.cantPosts / this.perPage);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    /**
     * Método para enviar el like que le da el usuario a la publicación mediante una peticion(post) al backend
     */
    updateLike(post, isOldLike) {
      let payload = { id_post: post._id, id_user: this.user_id };
      Axios.post(this.url + "/post/updateLikes", payload)
        .then((res) => {
          if (isOldLike) {
            post.nlikes--;
            let idx = post.likes.indexOf(this.user_id);
            post.likes.splice(idx, 1);
          } else {
            post.nlikes++;
            post.likes.push(this.user_id);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    sendComment(id_post, item) {
      let date = Date.now();
      console.log("Item", item)
      let comment = this.$refs[id_post][0].localValue;
      let commentData = {
        id_user: this.user_id,
        id_post: id_post,
        date: date,
        comment: comment,
      };
      if (comment == "") alert("Por favor escribe un comentario");
      else {
        Axios.post(this.url + "/comments/saveComment", commentData)
          .then((res) => {
            alert(res.data);
            this.loadPosts()
          })
          .catch((err) => {
            alert(err.response);
          })
          .finally(() => {
            this.$refs[id_post][0].localValue = "";
            //await item.comments.push(commentData);
          });
      }
    },
    /**
     * Método para general el link, cada que se cambia la pagina para ver las publicaciones
     */
    linkGen(pageNum) {
      let querys = this.$route.query.topic
        ? "?topic=" + this.$route.query.topic
        : "?";
      querys += pageNum === 1 ? "&" : `&page=${pageNum}`;
      console.log(querys);
      return querys;
    },

    /**
     * Método para chequear el formato del pdf
     */
    checkPDFFormat(url) {
      const regex = /.pdf/;
      return ".pdf" == url.match(regex);
    },

    //Metodos del navbar

    /**
     * Método para agregarle a la url el elemento(tema) que se haya elegido para buscarlo en el backend y filtrar las publicaciones
     */
    changeTopic(topic) {
      topic = topic.replace(/\s/g, "_");
      this.$router.push({ path: "/", query: { topic: topic } });
      setTimeout(() => {
        window.location.reload();
      }, 10);
    },

    /**
     * Método para cerrar la sesión del usuario
     */
    logOut() {
      this.$router.push("/login");
      document.cookie = `token=`;
    },

    /**
     * Método para cargar los datos al localStorage de la persona que esta logueada en la aplicación
     */
    loadProfile() {
      let url = config.url_api + "/login/decode";
      Axios.get(url, { headers: { token: this.token } })
        .then((response) => {
          let user = response.data.data;
          this.nickname = user.nickname;
          this.email = user.email;
          this.user_id = user._id;
          this.range = user.range;
          this.image = user.image
            ? user.image
            : "https://external-content.duckduckgo.com/iu/" +
              "?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP." +
              "PB3QCTk1kCZZ6ZvvVqpM5gHaHa%26pid%3DApi&f=1";
          this.mod = this.range == 2;
          //console.log("User", user);
        })
        .catch((error) => {
          console.log("Error");
          console.log(error);

        });


    },
    /**
     * Método para buscar un Post en especifico enviando petición(get) con filtro al backend y mostrarlo en el frontend
     */
    searchPost() {
      this.isSearching = true;
      console.log(`${this.url}/post/search/${this.typeSearch}/${this.search}`);
      Axios.get(`${this.url}/post/search/${this.typeSearch}/${this.search}`)
        .then((res) => {
          console.log("RESPONSE", res);
          let data = res.data;
          data.forEach((item) => {
            item.post_date = item.post_date.substring(0, 10);
          });

          this.post_list = data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    /**
     * Carga la lista topics de los datos obtenidos del backend
     */
    loadTopics() {
      Axios.get(this.url + "/topics").then((res) => {
        let data = [];
        res.data.forEach((topic) => {
          data.push(topic.name);
        });
        this.topics = data;
      });
    },

    /**
     * Metodo para crear un tema y guardarlo en la base de datos
     */
    async createTopic() {
      //TO DO
      try{

        let url = config.url_api + '/topics/saveTopic/';
        console.log(url)


        if(!this.topicInput.trim() == ''){
          if (this.topics.includes(this.topicInput)) {
            alert("Este tema ya existe");
          } else {
            var formData = new FormData();
            //console.log(this.topicInput);
            //formData.append('name', this.topicInput);
            //console.log(formData)
            var newTopic ={}
            newTopic.name = this.topicInput
            console.log(newTopic)
            const res  = await Axios.post(url, newTopic);
            alert(res.data);
            location.reload();

          }


        }else{
          alert("Rellene todos los campos")
        }


      }catch(e){
        console.error(e);
      }



    },

    /**
     * Metodo para cargar modal de crear tema
     */
    showModalTopic() {
      this.$refs["modalCreateTopic"].show();
    },

    /**
     * Metodo para almacenar el id de un post en el localstorage para ser accedido por el mediante otra url
     */
    getPostData(id){
    localStorage.setItem("id_post", id);
    location.assign("singlePost")
    }
  },
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

.card-img-top {
  max-width: inherit;
}

.navbar {
  background-color: #a00001;
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
  background-color: #a00001;
  color: white;
  border-color: #a00001;
}

.like-button-vote {
  margin-right: 15px;
  margin-top: 0.5rem;
  background-color: #a00001;
  color: white;
  border-color: #a00001;
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

.topicsDropDown a span {
  color: white;
}

.link_file {
  border-color: lightgrey;
  border-style: solid;
  border-width: 1px;
  border-radius: 5px;
  display: inline-block;
  padding: 0.2rem;
}

.comment-input {
  resize: none;
  height: 2.5rem;
}

/**estilos para el link */
body {
  width: 300px;
  margin: 0 auto;
  font-size: 1.2rem;
  font-family: sans-serif;
}

.title-link:hover {
  cursor:pointer;
  text-decoration:underline ;
}

</style>




