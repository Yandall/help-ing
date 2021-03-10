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

        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </div>

  </div>
</template>

<script>
import Axios from "axios";
import config from "../assets/config"
  export default {
    data() {
      var date = Date.now()
      return {
        file: [],
        form: {
          body: '',
          author: '',
          post_date: date
        },
        show: true
      }
    },
    computed: {
      fileName(){
        return this.file.name
      }
    },
    methods: {
      onSubmit(evt) {
        evt.preventDefault()

        this.savePost(this.file)
        this.clearInputs()
      },
      async savePost(file) {
        try{
          var formData = new FormData()
          formData.append('file', file)
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
      clearInputs(){
        this.form.title = ''
        this.form.body = ''
        this.form.tags = ''
        this.form.file = ''
      },
      cargarPerfil() {
        this.nickname = localStorage.getItem("nickname")
        this.email = localStorage.getItem("email")
        this.image = localStorage.getItem("image")
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
