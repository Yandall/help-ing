<template>

  <div class="body">

    <b-container >
      <b-row>
        <b-col >



          <b-img src="../static/logo_login.png" height="200" width="400" ></b-img>
        </b-col>
        <b-col align-self="center">
          <b-form action="javascript:void(0)">
            <b-card-group>
              <b-card class="card-login" >

                <div class="container_login">
                  <div class="tittle">{{ message }}</div>
                </div>

                <br />

                <b-form-group @submit.stop.prevent >
                  <b-form-invalid-feedback :state="validar_email">*</b-form-invalid-feedback>
                  <b-input-group size="sm" class="mb-2">
                    <b-input-group-prepend is-text>
                      <b-icon icon="envelope"></b-icon>
                    </b-input-group-prepend>
                  <b-form-input
                    class="form-control"
                    v-model="usuario.email"
                    type="email"
                    placeholder="Ingrese su correo electronico"
                    id="email"
                    size="lg"
                    icon="envelope"
                  />

                  </b-input-group>
                </b-form-group>

                <b-form-group @submit.stop.prevent >
                  <b-form-invalid-feedback :state="validar_password">*</b-form-invalid-feedback>
                  <b-input-group size="sm" class="mb-2">
                    <b-input-group-prepend is-text>
                      <b-icon icon="shield-lock"></b-icon>
                    </b-input-group-prepend>
                  <b-form-input
                    class="form-control"
                    type="password"
                    v-model="usuario.password"
                    placeholder="Ingrese su contraseña"
                    id="password"
                    size="lg"/>
                  </b-input-group>

                </b-form-group>

                <br>


                <b-button type="submit" @click="login()" block variant="danger">Ingresar</b-button>

                <br>

                <b-button
                  id="show-btn"
                  @click="mostrar_modal"
                  block
                  variant="outline-danger">Crear una Cuenta</b-button>
              </b-card>

            </b-card-group>
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
                    v-model="tempUser.email"
                    :state="estado_correo"
                    required
                    size="lg"
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
                    v-model="tempUser.nickname"
                    :state="estado_nombre"
                    required

                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  :state="estado_clave"
                  label="Contraseña"
                  label-for="password"
                  invalid-feedback="La contraseña es obligatoria"
                >
                  <b-form-input
                    id="password"
                    v-model="tempUser.clave"
                    type="password"
                    :state="estado_clave"
                    required

                  ></b-form-input>
                </b-form-group>

                <b-form-group label="File" laberl-for="file">
                  <b-form-file
                    v-model="file"
                    id="file"
                    accept="image/jpeg, image/jpg, image/png"
                    placeholder="Choose an image"
                    drop-placeholder="Drop file here..."
                  ></b-form-file>
                  <b-button @click="subirImagen()" variant="outline-danger">Subir imagen</b-button>
                </b-form-group>
              </form>
              <b-button @click="crearCuenta(file)" variant="outline-danger">Crear cuenta</b-button>
            </b-modal>
          </b-form>


          <br />
        </b-col>

      </b-row>
    </b-container>

  </div>

</template>

<script>
import Axios from "axios"
import { BootstrapVueIcons } from 'bootstrap-vue';
import 'bootstrap-vue/dist/bootstrap-vue-icons.min.css'
import md5 from 'md5'
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/helping-developer/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'myimzr53'
export default {
  beforeMount() {

    this.carga_pagina();
  },
  data() {
    return {
      estado_nombre: null,
      estado_correo: null,
      estado_clave: null,
      url: "",
      message: "INICIAR SESIÓN",
      file: "",
      usuario: {
        email: "",
        password: ""
      },
      tempUser: {
        email: "",
        clave: "",
        nickname: "",
        range: 1
      }
    };
  },

  computed: {
    fileName() {
      return this.file.name;
    },validar_email() {
      return this.usuario.email.length > 0;
    },

    validar_password() {
      return this.usuario.password.length > 0;
    }
  },
  methods: {
    onSubmit(evt) {
      evt.preventDefault();
      this.crearCuenta(this.file);
    },

    carga_pagina() {
      if (localStorage.getItem("nickname") == ""){
        this.$router.push("/login");
      } else{
        this.$router.push("/");
      }
      let url = "http://localhost:8080/";
      this.url = url;
    },
    login() {
      let url =
        "http://localhost:8080/login"

      if (this.usuario.email.length > 0 && this.usuario.password.length > 0) {
        let payload = {... this.usuario}
        payload.password = md5(payload.password)

        Axios.post(url, payload)
          .then(response => {
            let user = this.user
            let data = response.data
            if (data.ok) {
              localStorage.setItem("nickname", data.nickname)
              localStorage.setItem("email", data.email)
              localStorage.setItem("range", data.range)
              localStorage.setItem("id", data._id)
              localStorage.setItem("token", data.token)
              if (data.image) {
                localStorage.setItem("image", data.image);
              } else {
                localStorage.setItem(
                  "image",
                  "https://external-content.duckduckgo.com/iu/" +
                  "?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP." +
                  "PB3QCTk1kCZZ6ZvvVqpM5gHaHa%26pid%3DApi&f=1"
                );
              }

              this.$router.push("/");
              return;
            } else {
              alert("Asegurese de que todos los campos esten correctos");
            }
          })
          .catch(error => {
            this.mensaje2 = error.response.data.message;
            console.log(error.response);
          });
      } else {
        alert("LLene todos los campos correctamente")
      }
    },
    async crearCuenta(file) {
      console.log(file)
      try {
        var user = {}
        if (file) {
          if (file.length == 0) {
            alert("Se debe seleccionar una imagen")
            return
          } else {
            user.file = file;
          }
        } else {
          alert("Se debe seleccionar una imagen")
          return
        }

        if(this.tempUser.clave == ""){
          alert("Todos los campo son obligatorios")
          return
        }else {
          user.password = md5(this.tempUser.clave)
        }

        user.nickname = this.tempUser.nickname
        user.email = this.tempUser.email

        user.range = this.tempUser.range
        const url = "http://localhost:8080/users/createUser"
        const res = await Axios.post(url, user)
        alert(res.data)
        this.clearInputs()
      } catch (e) {
        alert("Error al crear el usuario")
        console.error(e);
      }
    },

    /**
       * Se sube el archivo a cloudinary, y se obtiene el link que queda asociado al post
       */
      subirImagen() {
      const IMG = document.getElementById('file');
      const formData = new FormData();

      formData.append('file', this.file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

      Axios.post(CLOUDINARY_URL, formData, {
        headers:{
          'content-type':'multipart/form-data'
        }
      }).then((response) => {
        console.log("Imagen de usuario agregada");
        console.log(response);
        this.file = response.data.secure_url;
        console.log("File: " + this.file)
        IMG.src = response.data.secure_url;
      })
      .catch((error) =>{
        console.log("Hubo un error");
        console.log(error);
      })
      },

    clearInputs() {
      this.tempUser.nickname = "";
      this.tempUser.clave = "";
      this.tempUser.email = "";
      this.file = "";
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
