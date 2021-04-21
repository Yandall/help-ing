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

          <b-button
            variant="light"
            size="sm"
            style="margin-inline: 5px"
            :to="{ name: 'advisory' }"
          >Calendario Asesorias
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
    <div class="calendar">
    <iframe src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;ctz=America%2FBogota&amp;src=dTgzdGhhbXI5c29icDIyZW5ybWk0cGFqNmdAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&amp;color=%238E24AA&amp;showTitle=1&amp;title=Asesorias&amp;showPrint=0&amp;showTz=1&amp;showCalendars=0&amp;showTabs=1" style="border-width:0" width="800" height="600" frameborder="0" scrolling="no"></iframe>
    </div>

  </div>

</template>

<script>
import config from "~/assets/config";
import Axios from "axios";

export default {
  name: "createAdvisory",

  beforeMount() {
    this.verifyToken();
    this.loadProfile();
    this.loadTopics();
  },
  data() {

    return{

      post_list: null,
      url: `${config.url_api}`,
      nickname: "",
      email: "",
      image: "",
      user_id: "",
      topics: {},
      token: "",


      typeSearch: "title",
      search: "",
      mod: false,
      isSearching: false,
      topicInput: "",
      inputComment: "",

    }
  },

  methods: {

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
    //Metodos del navbar

    /**
     * Método para agregarle a la url el elemento(tema) que se haya elegido para buscarlo en el backend y filtrar las publicaciones
     */
    changeTopic(topic) {
      topic = topic.replace(/\s/g, "_");
      this.$router.push({path: "/", query: {topic: topic}});
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
      Axios.get(url, {headers: {token: this.token}})
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
      try {

        let url = config.url_api + '/topics/saveTopic/';
        console.log(url)


        if (!this.topicInput.trim() == '') {
          if (this.topics.includes(this.topicInput)) {
            alert("Este tema ya existe");
          } else {
            var formData = new FormData();
            //console.log(this.topicInput);
            //formData.append('name', this.topicInput);
            //console.log(formData)
            var newTopic = {}
            newTopic.name = this.topicInput
            console.log(newTopic)
            const res = await Axios.post(url, newTopic);
            alert(res.data);
            location.reload();

          }


        } else {
          alert("Rellene todos los campos")
        }


      } catch (e) {
        console.error(e);
      }


    },

    /**
     * Metodo para cargar modal de crear tema
     */
    showModalTopic() {
      this.$refs["modalCreateTopic"].show();
    },

  },
}








</script>

<style scoped>

.calendar{
  text-align: center;
}

</style>
