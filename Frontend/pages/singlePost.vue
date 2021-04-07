<template>
  <div class="container">
    <h1 class="title1">single post
      <b-button :to="{name: 'index'}" style="text-align: left">Back</b-button>
    </h1>


    <div>
      <h2>{{ post.title }}</h2>
          <b-card
            :img-src="post.file"
            img-alt=""
            tag="article"
            img-top
            style="max-width: 60rem"
            class="mb-2"
            footer-tag="footer"
          >
            <b-card-text>
              {{ post.body }}

              <br />Tags:
              <b-badge
                pill
                variant="secondary"
                v-for="(tag, index) in post.tags"
                :key="index"
                style="margin-right: 5px"
                >{{ tag }}
              </b-badge>
            </b-card-text>
            <div class="link_file">
              <b-icon
                icon="file-earmark-arrow-down"
                v-if="checkPDFFormat(post.file)"
              ></b-icon>
              <b-link v-if="checkPDFFormat(post.file)" :href="post.file">{{
                post.file
              }}</b-link>
            </div>

            <template #footer>
              <div class="post-footer">
                <div v-if="!post.likes.includes(user_id)">
                  <b-button
                    size="sm"
                    variant="secondary"
                    class="mb-2 like-button-no-vote"
                    @click="updateLike(post, false)"
                  >
                    <b-icon icon="heart-fill" aria-label="Help"></b-icon>
                    <p>{{ post.nlikes }}</p>
                  </b-button>
                </div>
                <div v-else>
                  <b-button
                    size="sm"
                    variant="secondary"
                    class="mb-2 like-button-vote"
                    @click="updateLike(post, true)"
                  >
                    <b-icon icon="heart-fill" aria-label="Help"></b-icon>
                    <p>{{ post.nlikes }}</p>
                  </b-button>
                </div>

                <div class="post-footer-info">
                  {{ post.author }} {{ post.post_date }}
                </div>
              </div>
            </template>
          </b-card>
      <b-table striped hover :items="post.comments" :fields="fields" ></b-table>
          <b-input-group :prepend="nickname">
            <b-form-textarea
              class="comment-input"
              maxlength="300"
              v-model="currentComment"
              :id="post._id"
            ></b-form-textarea>
            <b-input-group-append>
              <b-button @click="sendComment">Comentar</b-button>
            </b-input-group-append>
          </b-input-group>
    </div>

  </div>
</template>

<script>
import Axios from "axios";
import config from "../assets/config"

export default {
  beforeMount() {
    this.getPostData();
    //se hace un llamado a los métodos recien se carga la pagina, para mostrar la información
    this.loadPost();
    this.verifyToken();
    this.loadProfile();
  },
  data() {
    var date = Date.now()
    return {
      fields:[{key:'user', label:'Usuario'},{key:'comment', label: 'Comentario'},{
        // A virtual column with custom formatter
        key: 'date',
        label: 'Fecha comentario',
        formatter:'dateSimplified'
      }],
      post:{
        _id:'',
        coments:[],
        title:'',
        body:'',
        tags:'',
        author:'',
        post_date:'',
        file:'',
        likes:''
      },
      currentComment: '',
      id:'',
      url: `${config.url_api}`,
      nickname: "",
      email: "",
      image: "",
      user_id: "",
      token: ""
    }
  },
  computed: {
    fileName() {
      return this.file.name
    }
  },

  methods: {
    dateSimplified(value){
      return value!=null ? value.substring(0, 10) : value
    },
    sendComment() {
      let date = Date.now();
      let comment = this.currentComment
      let commentData = {
        'id_user': this.user_id,
        'id_post': this.id,
        date: date,
        comment: comment,
      };
      if (comment == "") alert("Por favor escribe un comentario");
      else {
        Axios.post(this.url + "/comments/saveComment", commentData)
          .then((res) => {
            this.loadPost()
            alert(res.data);
          })
          .catch((err) => {
            alert(err.response);
          })
          .finally(() => {
            this.currentComment = ""
          });
      }
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
          console.log("User", user);
        })
        .catch((error) => {
          console.log(error);
          console.log("Error");
        });
      this.mod = this.range == 1;
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

    /**
     * Metodo para cargar un post especifico en la pagina
     */
    loadPost() {
      Axios.get(`${this.url}/post/${this.id}`, {
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Expires: "0",
        },
      })
        .then((res) => {
          let data = res.data[0];
          console.log(data)
          data.post_date = data.post_date.substring(0, 10);
          data.nlikes =
          data.likes === "" ? data.likes.length - 1 : data.likes.length;
          this.post = data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    /**
     * Método para chequear el formato del pdf
     */
    checkPDFFormat(url) {
      const regex = /.pdf/;
      return ".pdf" == url.match(regex);
    },

    /**
     * Metodo para tomar el id del post a mostrar
     */
    getPostData(){
    this.id = localStorage.getItem("id_post");
    }
  }
}
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
</style>
