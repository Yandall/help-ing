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
    <b-card
      border-variant="secondary"
      header-border-variant="secondary"
      header="      "
      align="left"
      title="Agregar contenido Universal"
    >
      <b-form action="javascript:void(0)" @submit="createUC()">
        <b-form-group label="Título:" label-for="title">
          <b-form-input
            id="title"
            v-model="uc.title"
            required
            placeholder="Ingrese el título"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Autor:" label-for="author">
          <b-form-input
            id="author"
            v-model="uc.author"
            required
            placeholder="Ingrese el autor"
          ></b-form-input>
        </b-form-group>

        <b-form-group label="Url:" label-for="url">
          <b-form-input
            id="url"
            v-model="uc.url"
            placeholder="Ingrese la url del recurso externo"
          ></b-form-input>
        </b-form-group>



        <b-form-group label="Tipo:" label-for="tipos">
          <b-form-radio-group
            v-model="uc.type"
            :options="types"
            value-field="name"
            text-field="name"
            disabled-field="notEnabled"
            stacked
            required
          ></b-form-radio-group>
        </b-form-group>

       <b-form-group label="File" laberl-for="file">
          <b-form-file
            v-model="uc.file"
            id="file"
            accept="image/jpeg, image/jpg, image/png, application/pdf"
            placeholder="Choose an image or PDF"
            drop-placeholder="Drop file here..."
          ></b-form-file>
        </b-form-group>

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-card>
  </div>
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
    beforeMount() { },

    data() {
        return {
          /**
           * Se inicializan las variables para luego usarlas
           */
            uc: {
                title: "",
                author: "",
                url: "",
                file: "",
                type: "",
                icon: ""
            },

            types: [],
          url: `${config.url_api}/uc`,
          typeSearch: 'title',
          search: '',
          isSearching: false,
          post_list: null


        };

    },

    created() {
        this.loadTpyes();
    },

    computed: {},

    methods: {

        /**
         * Método para cargar los tipos de publicaciones mediante una peticion(get) al backend
         */
        loadTpyes(){

            axios.get(config.url_api + "/types")
            .then(res => {
                let data = res.data;
                for(let i in data){
                    let type = {name: ""}
                    type.name = data[i].name;
                    this.types.push(type);
                    console.log(type);
                    console.log(this.types);
                }
            })
            .catch(err => console.log(err))

        },

        /**
         * Método para capturar la información del form despues se envia al backend mediante una petición(post)
         * y así crear un nuevo contenido universal
         */
       async createUC() {
             try {
                var formData = new FormData();
                formData.append("title", this.uc.title);
                formData.append("author", this.uc.author);
                formData.append("url", this.uc.url);
                formData.append("file", this.uc.file);
                formData.append("type", this.uc.type);
                formData.append("icon", this.uc.icon);
                const url = "http://localhost:8080/uc/saveUC";
                const res = await axios.post(url, formData);
                alert(res.data);

            } catch (e) {
                console.error(e);
            }
    }

    }
};
</script>


