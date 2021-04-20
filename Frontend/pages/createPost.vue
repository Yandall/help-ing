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
  <div class="container">

    <h1 class="title1">Create new post</h1>
    
    <div>
      <b-form v-if="show" @submit="onSubmit" class="form">
        <b-form-group label="Title" label-for="title">
          <b-form-input
            id="title"
            v-model="form.title"
            required
            placeholder="Input an interesting title"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Body" label-for="body">
          <b-form-textarea
            id="body"
            v-model="form.body"
            placeholder="Enter name"
            style="min-height: 20vh"
          ></b-form-textarea>
        </b-form-group>


          <b-form-group label="Tema" label-for="topic">
            <b-form-select
              id="topic"
              v-model="form.topic"
              required
              :options="topics"
              placeholder="Ingrese el tema o materia"
            ></b-form-select>
          </b-form-group>

        <b-form-group label="Tags" label-for="tags">
          <b-form-tags
            id="tags"
            v-model="form.tags"
            placeholder="Enter tags"
          ></b-form-tags>
        </b-form-group>

        <b-form-group label="File" laberl-for="file">
          <b-form-file
            v-model="file"
            id="file"
            accept="image/jpeg, image/jpg, image/png, application/pdf"
            placeholder="Choose an image or PDF"
            drop-placeholder="Drop file here..."
          ></b-form-file>
        </b-form-group>

        <div class="mx-auto" style="width: 300px;">
          <b-card
            id="card-img"
            title="post Image"
            img-alt="Image"
            img-top
            tag="article"
            style="max-width: 20rem;"
            class="mb-2"
          >
            <b-card-body>
              <b-img id="image" src="" fluid alt="Imagen" variant="success"></b-img>
              <b-progress :value="progress_bar" :max="100" show-progress animated variant="danger"></b-progress>
            </b-card-body>
          </b-card>
        </div>

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </div>

  </div>
  </div>
</template>

<script>
import Axios from "axios";
import config from "../assets/config"

const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/helping-developer/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'myimzr53'

export default {

  beforeMount(){
    this.loadTopics();
  },

  data() {
    var date = Date.now()
    return {
      url: `${config.url_api}`,
      file: [],
      form: {
        body: '',
        author: '',
        post_date: date,
        title: '',
        tags: [],
        topic: ''
      },
      nickname: "",
      show: true,
      progress_bar: 0,
      topics: [],
      typeSearch: "title",
      search: "",
      mod: false,
      isSearching: false,
      topicInput: "",
    }
  },
  computed: {
    fileName() {
      return this.file.name
    }
  },

  mounted() {
    //alert("Para subir archivo en el post, se debe dar click primero en el boton 'upload file' ")
  },

  methods: {
    onSubmit(evt) {
      evt.preventDefault()
      this.uploadImage()

    },
    /**
     * Método para capturar la información del form, despues se envia al backend mediante una petición(post)
     * y así crear un nuevo post
     */
    async savePost() {
      try {
        await this.getName()
        if (!this.form.tags) this.form.tags = ''
        var formData = new FormData()
        formData.append('file', this.file)
        formData.append('title', this.form.title)
        formData.append('body', this.form.body)
        formData.append('tags', this.form.tags)
        formData.append('author', this.form.author)
        formData.append('post_date', this.form.post_date)
        formData.append('topic', this.form.topic)
        console.log("Form", this.form)
        const url = `${config.url_api}/post/saveFile`
        const res = await Axios.post(url, formData)
        this.clearInputs()
        alert(res.data)
      } catch (e) {
        console.error(e)
        alert("Recuerda que solo puedes adjuntar imagenes tipo jpg png jpeg o PDF, vuelvelo a intentar")
      }

    },
    async getName() {
      let url2 = config.url_api + "/login/decode"
      let token = document.cookie.split(";").toString().split("token=")[1]
      await Axios
        .get(url2, {headers: {token: token}})
        .then((response) => {
          let user = response.data
          this.form.author = user.data.nickname
        })
        .catch((error) => {
          console.log(error)
        })
    },
    /**
     * Método para limpiar los campos del form luego de capturarlos
     */
    clearInputs() {
      this.form.title = ''
      this.form.body = ''
      this.form.tags = ''
      this.form.file = ''
      this.file = ''
    },
    /**
     * Método para cargar los datos al localStorage de la persona que se esta logueando en la aplicación
     */
    uploadProfile() {
      this.nickname = localStorage.getItem("nickname")
      this.email = localStorage.getItem("email")
      this.image = localStorage.getItem("image")
    },

    /**
     * Método para subir  el archivo a cloudinary, y se obtiene el link que queda asociado al post
     */
    uploadImage() {
      const IMG = document.getElementById('image');
      const formData = new FormData();

      formData.append('file', this.file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      Axios.post(CLOUDINARY_URL, formData, {
        headers: {
          'content-type': 'multipart/form-data'
        },
        onUploadProgress(e) {
          //this.progress = Math.round(e.loaded * 100)/e.total;
          console.log(this.progress);
        }
      }).then((response) => {
        console.log("Imagen agregada");
        console.log(response);
        this.file = response.data.secure_url;
        console.log("File: " + this.file)
        IMG.src = response.data.secure_url;
        this.savePost()
      })
        .catch((error) => {
          console.log("Hubo un error");
          console.log(error);
        })
    },

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



  }
}
</script>

<style scoped>
.container {
  padding: 3em 5em 1em 5em;
  min-height: 50vh;
  display: block;
  justify-content: center;
  align-items: initial;
  text-align: initial;
}

.title1 {
  font-family: 'Quicksand',
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
  font-size: 50px;
  color: #35495e;
  letter-spacing: 1px;
}

.form {
  text-align: initial;
}

</style>
