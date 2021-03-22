<template>
  <div class="container">
    <h1 class="title1">Create new post
        <b-button :to="{name: 'index'}" style="text-align: left">Back</b-button>
    </h1>


    <div>
      <b-form v-if="show" @submit="onSubmit" class="form">
        <b-form-group  label="Title" label-for="title">
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
               <b-progress :value="progress_bar" :max="100" show-progress animated variant="danger"  ></b-progress>
              </b-card-body>
              </b-card>
            </div>

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </div>

  </div>
</template>

<script>
import Axios from "axios";
import config from "../assets/config"
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/helping-developer/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'myimzr53'

  export default {
    data() {
      var date = Date.now()
      return {
        file: '',
        form: {
          body: '',
          author: '',
          post_date: date
        },
        show: true,
        progress_bar: 0
      }
    },
    computed: {
      fileName(){
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
        this.clearInputs()
      },
      /**
       * Método para capturar la información del form, despues se envia al backend mediante una petición(post)
       * y así crear un nuevo post
       */
      async savePost() {
        try{
          if(!this.form.tags) this.form.tags = ''

          var formData = new FormData()
          formData.append('file', this.file)
          formData.append('title', this.form.title)
          formData.append('body', this.form.body)
          formData.append('tags', this.form.tags)
          formData.append('author', localStorage.getItem('nickname'))
          formData.append('post_date', this.form.post_date)
          const url = `${config.url_api}/post/saveFile`
          const res = await Axios.post(url, formData)
          alert(res.data)
        } catch(e) {
          console.error(e)      
          alert("Recuerda que solo puedes adjuntar imagenes tipo jpg png jpeg o PDF, vuelvelo a intentar")
        }

      },
      /**
       * Método para limpiar los campos del form luego de capturarlos
       */
      clearInputs(){
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
        headers:{
          'content-type':'multipart/form-data' 
        },
        onUploadProgress(e){
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
      .catch((error) =>{
        console.log("Hubo un error");
        console.log(error);
      })
      }
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
  font-family:
    'Quicksand',
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
