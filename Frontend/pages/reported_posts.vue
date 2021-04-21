<template>
  <div>
    <b-navbar toggleable="lg" type="dark">
      <b-navbar-brand href="/">Helping</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-button
            variant="light"
            size="sm"
            v-if="mod"
            style="margin-inline: 5px"
            :to="{ name: 'reported_posts' }"
            >Reportados
          </b-button>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
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
      <h2>Publicaciones reportadas</h2>

      <b-card-group
        class="card-post"
        v-for="(report, index) in reported_list"
        :key="report._id"
      >
            <b-card header-tag="header" footer-tag="footer">
              <h2 class="title-link" @click="getPostData(report.post[0]._id)">
                {{ report.post[0].title }}
              </h2>
              <template #header>
                <h6 class="mb-0">Cantidad de reportes: {{cantidadReport(index)}}</h6>
              </template>
              <b-button variant="primary" @click="cerrarCaso(report.post[0]._id)">Cerrar caso</b-button>
              <b-button variant="primary" @click="eliminarPost(report.post[0]._id)">Eliminar post</b-button>
            </b-card>
      </b-card-group>
    </div>
  </div>
</template>

<script>
import Axios from "axios";
import config from "../assets/config";

export default {
  beforeMount() {
    this.verifyToken();
    this.loadProfile();
    this.loadReported();
  },

  data() {
    return {
      reported_list: [],
      nickname: "",
      email: "",
      user_id: "",
      range: "",
      image: "",
      mod: false,
    };
  },

  methods: {
    loadReported() {
      let url = config.url_api + "/reported_post/";
      Axios.get(url).then((res) => {
        this.reported_list = res.data;
      })
      .catch((error) => {
          alert('Hubo un error cargando los post reportados')
          console.error(error)
      })
    },

    cantidadReport(index) {
        let report = this.reported_list[index]
        return report.users.length
    },

    getPostData(id){
    localStorage.setItem("id_post", id);
    location.assign("singlePost")
    },

    cerrarCaso(id){
        let url = config.url_api + "/reported_post/" + id
        Axios.post(url)
        .then(res => {
            alert(res.data)
            this.loadReported()
        }).catch(err => {
            alert('Hubo un error cerrando el caso')
            console.error(err)
        })
    },

    eliminarPost(id) {
        let url = config.url_api + "/reported_post/" + id
        Axios.delete(url)
        .then(res => {
            alert(res.data)
            this.loadReported()
        }).catch(err => {
            alert('Hubo un error al eliminar el post')
            console.error(err)
        })
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
  },
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  max-width: 50rem;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.card-post {
  margin: 15px 0 15px 0;
  width: inherit;
}

.title-link:hover {
  cursor:pointer;
  text-decoration:underline ;
}
</style>
