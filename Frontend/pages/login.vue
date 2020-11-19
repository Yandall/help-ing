<template>
  <div class="body">
    <b-container>
      <b-col>
        <!-- Content here -->

        <div class="container_login">
          <div class="tittle">{{ message }}</div>
        </div>

        <br />

        <b-form action="javascript:void(0)">
          <b-form-group @submit.stop.prevent label="Correo" label-for="email">
            <b-form-input
              class="form-control"
              v-model="usuario.email"
              type="email"
              placeholder="Ingrese su correo electronico"
              id="email"
            />
            <b-form-invalid-feedback :state="validar_email"
              >Campo obligatorio</b-form-invalid-feedback
            >
          </b-form-group>

          <b-form-group
            @submit.stop.prevent
            label="Contraseña"
            label-for="password"
          >
            <b-form-input
              class="form-control"
              type="password"
              v-model="usuario.clave"
              placeholder="Ingrese su contraseña"
              id="password"
            />
            <b-form-invalid-feedback :state="validar_clave"
              >Campo obligatorio</b-form-invalid-feedback
            >
          </b-form-group>

          <b-button @click="login()" type="submit" block variant="danger"
            >Ingresar</b-button
          >

          <b-button
            id="show-btn"
            @click="mostrar_modal"
            block
            variant="outline-danger"
            >Crear una Cuenta</b-button
          >

          <b-modal ref="my-modal" hide-footer title="Crear una cuenta">
            <form ref="form" @submit.stop.prevent="solicitud">
              <b-form-group
                :state="estado_correo"
                label="Correo"
                label-for="correo"
                invalid-feedback="El correo es obligatorio"
              >
                <b-form-input
                  id="correo"
                  v-model="usuario.email"
                  :state="estado_correo"
                  required
                ></b-form-input>
              </b-form-group>
              <b-form-group
                :state="estado_nombre"
                label="Nombre de usuario"
                label-for="nickname"
                invalid-feedback="El nombre de usuario es obligatorio"
              >
                <b-form-input
                  id="nickname"
                  v-model="usuario.nickname"
                  :state="estado_correo"
                  required
                ></b-form-input>
              </b-form-group>

              <b-form-group
                :state="estado_nombre"
                label="Contraseña"
                label-for="password"
                invalid-feedback="La contraseña es obligatoria"
              >
                <b-form-input
                  id="password"
                  v-model="usuario.nickname"
                  :state="estado_clave"
                  required
                ></b-form-input>
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
            </form>
           <b-button type="submit" variant="outline-danger">Crear cuenta</b-button>
          </b-modal>
        </b-form>
        <br />
      </b-col>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";

export default {
  beforeMount() {
    this.carga_pagina();
  },
  data() {
    return {
      estado_id: null,
      estado_correo: null,
      estado_clave: null,
      url: "",
      message: "INICIAR SESIÓN",
      file : [],
      usuario: {
        email: "",
        clave: "",
        nickname: "",
        range : 1
      }
    };
  },

  computed: {
    validar_email() {
      return this.usuario.email.length > 0;
    },

    validar_clave() {
      return this.usuario.clave.length > 0;
    }
  },
  methods: {
    onSubmit(evt){
      evt.preventDefault()

    },
    carga_pagina() {
      let url = "http://localhost:8080/";
      this.url = url;
    },
    login() {
      let url = "http://localhost:8080/" + "users/" + this.usuario.email + "/" + this.usuario.clave;

      if (this.usuario.email.length > 0 && this.usuario.clave.length > 0) {
        axios
          .get(url)
          .then(response => {
            let data = response.data;
            console.log("Data:", data);
            if(data.length == 1){
              this.$router.push("/");
              return
            }
          })
          .catch(error => {
            this.mensaje2 = error.response.data.message;
            console.log(error.response);
          });
      } else {
        alert("LLene todos los campos correctamente");
      }
    },

    mostrar_modal() {
      this.$refs["my-modal"].show();
    },

    mostrar_modal_clave() {
      this.$refs["my-modal-pass"].show();
    },
    ocultar_modal() {
      this.$refs["my-modal"].hide();
    },

    ocultar_modal_clave() {
      this.$refs["my-modal-pass"].hide();
    },

    solicitar_cuenta() {
      if (!this.validar()) {
        return;
      }
      axios
        .post(this.url + "emails/request", this.usuario)
        .then(response => {
          console.log(response);
        })
        .catch(error => console.log(error));
      this.ocultar_modal();
    },

    validar() {
      const valid = this.$refs.form.checkValidity();
      this.estado_id = valid;
      this.estado_correo = valid;
      return valid;
    },
    validar_pass() {
      const valid = this.$refs.form.checkValidity();
      this.estado_correo = valid;
      this.estado_clave = valid;
      return valid;
    },
    vaciar_modal() {
      this.usuario.id = "";
      this.estado_id = null;
      this.usuario.correo = "";
      this.estado_correo = null;
      this.estado_clave = null;
      this.estado_id = null;
    },
    generar_clave() {
      let r = Math.random()
        .toString(36)
        .substring(3)
        .toUpperCase();
      console.log(r);
      return r;
    }
  }
};
</script>

<style src="../css/login.css" />
