<template>
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
            uc: {
                title: "",
                author: "",
                url: "",
                file: "",
                type: "",
                icon: ""
            },

            types: []


        };

    },

    created() {
        this.loadTpyes();
    },

    computed: {},

    methods: {


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


