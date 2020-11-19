<template>
  <div class="body">
    <b-container>
      <b-col>
        <!-- Content here -->

        <div class="container_login">
          <b-img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Escudo_Universidad_de_Medellin.svg/240px-Escudo_Universidad_de_Medellin.svg.png"
            fluid
            alt="Fluid image"
            width="80px"
          ></b-img>
          <div class="tittle">{{ message }}</div>
        </div>

        <br />

        <b-form action="javascript:void(0)">
          <b-form-group @submit.stop.prevent label="Documento" label-for="id">
            <b-form-input
              class="form-control"
              v-model="usuario.id"
              type="number"
              placeholder="Ingrese su documento de identidad"
              id="id"
            />
            <b-form-invalid-feedback :state="validar_id"
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
            >Solicitar una Cuenta</b-button
          >

          <b-button
            id="show-btn"
            @click="mostrar_modal_clave"
            block
            variant="outline-danger"
            >¿Olvidaste tu Contraseña?</b-button
          >

          <b-modal ref="my-modal" hide-footer title="Solicitar una Cuenta">
            <form ref="form" @submit.stop.prevent="solicitud">
              <b-form-group
                :state="estado_id"
                label="Identificacón"
                label-for="id_modal"
                invalid-feedback="El documento es obligatorio"
              >
                <b-form-input
                  id="id_modal"
                  v-model="usuario.id"
                  :state="estado_id"
                  required
                ></b-form-input>
              </b-form-group>

              <b-form-group
                :state="estado_correo"
                label="Correo"
                label-for="correo"
                invalid-feedback="El correo es obligatorio"
              >
                <b-form-input
                  id="correo"
                  v-model="usuario.correo"
                  :state="estado_correo"
                  required
                ></b-form-input>
              </b-form-group>

              <b-form-group
                label="¿Para qué quieres esta cuenta?"
                label-for="description"
              >
                <b-form-textarea
                  class="form-control"
                  v-model="usuario.descripcion"
                  placeholder="Ingrese una descripción"
                  id="descripcion"
                />
              </b-form-group>

              <p>
                Se te enviará un correo electrónico cuando se cree la cuenta.
              </p>
            </form>
            <b-button
              class="mt-3"
              variant="outline-danger"
              block
              @click="solicitar_cuenta()"
              >Solicitar</b-button
            >
          </b-modal>

          <b-modal ref="my-modal-pass" hide-footer title="Recuperar contraseña">
            <form ref="form" @submit.stop.prevent="recuperar">
              <b-form-group
                :state="estado_clave"
                label="Correo"
                label-for="correo"
                invalid-feedback="El correo es obligatorio"
              >
                <b-form-input
                  id="correo"
                  v-model="usuario.correo"
                  :state="estado_clave"
                  required
                ></b-form-input>
              </b-form-group>

              <p>
                Se te enviará un correo electrónico con una nueva contraseña.
              </p>
            </form>
            <b-button
              class="mt-3"
              variant="outline-danger"
              block
              @click="recuperar_clave()"
              >Recuperar</b-button
            >
          </b-modal>
          <div class="text">
            <br />
            {{ mensaje2 }}
          </div>
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
      mensaje2: "",
      usuario: {
        id: "",
        clave: "",
        correo: "",
        descripcion: "",
        primera_vez: "",
      },
    };
  },

  computed: {
    validar_id() {
      return this.usuario.id.length > 0;
    },

    validar_clave() {
      return this.usuario.clave.length > 0;
    },
  },
  methods: {
    carga_pagina() {
      let url = "http://localhost:8080/";
      this.url = url;
    },
    login() {
      let url = "http://localhost:8080/" + "login";

      if (this.usuario.id.length > 0 && this.usuario.clave.length > 0) {
        axios
          .post(url, this.usuario)
          .then((response) => {
            let data = response.data;
            console.log("Data:", data);
            localStorage.setItem("token", data.info);
            localStorage.setItem("id", this.usuario.id);
            console.log("Primera vez: ", data.primera_vez);
            console.log("Rol: ", data.rol);
            if(data.rol == 1) {
              this.$router.push("/admin");
              return;
            }
            if (!data.primera_vez) {
              this.$router.push("/perfil");
            } else {
              this.$router.push("/home");
            }
          })
          .catch((error) => {
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
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.log(error));
      this.ocultar_modal();
    },

    recuperar_clave() {
      if (!this.validar_pass()) {
        return;
      }
      this.usuario.clave = this.generar_clave();
      console.log(this.usuario);
      axios
        .put(this.url + "noPass/clave", this.usuario)
        .then((response) => {
          console.log(response);
          axios
            .post(this.url + "emails/recovery", this.usuario)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
      this.ocultar_modal_clave();
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
    },
  },
};
</script>

<style src="../css/login.css" />