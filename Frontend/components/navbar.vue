<template>
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
</template>

<script>
import Axios from "axios";

export default {
name: "navbar",

  methods: {
    logOut() {
      this.$router.push("/login");
      localStorage.setItem("nickname", "");
      localStorage.setItem("email", "");
      localStorage.setItem("image", "");
    },
    searchPost() {
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


  }
}
</script>

<style scoped>

</style>
