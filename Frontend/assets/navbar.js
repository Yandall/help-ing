import Axios from 'axios'

/**
* Método para buscar un Post en especifico enviando petición(get) con filtro al backend y mostrarlo en el frontend
*/
function searchPost() {
    this.isSearching = true
    console.log(`${this.url}/post/${this.typeSearch}/${this.search}`)
    Axios.get(`${this.url}/post/${this.typeSearch}/${this.search}`)
      .then(res => {
        let data = res.data
        data.forEach(item => {
            item.post_date = item.post_date.substring(0, 10)
        })
        this.post_list = data
    
    })
        .catch(e => {
        console.log(e)
    })
}

 /**
** Método para cargar los datos al localStorage de la persona que esta logueada en la aplicación
*/
  function loadProfile() {
    if (localStorage.getItem("nickname") == "" || localStorage.getItem("email") == "") {
      this.$router.push("/login")

    } else {
      this.nickname = localStorage.getItem("nickname");
      this.email = localStorage.getItem("email");
      this.image = localStorage.getItem("image");
      this.user_id = localStorage.getItem("id");
      console.log("range",localStorage.getItem("range"))
      if (localStorage.getItem("range") == null) {
        this.mod = false
      } else {
        this.mod = localStorage.getItem("range") != 1;
      }
      localStorage.removeItem("range")
      console.log("Range later", localStorage.getItem("range"))
    }
}

  /**
     * Método para agregarle a la url el elemento(tema) que se haya elegido para buscarlo en el backend y filtrar las publicaciones
     */
function changeTopic(topic) {
    topic = topic.replace(/\s/g, "")
    this.$router.push({path: `/${topic}`})
}

  /**
   * Método para cerrar la sesión del usuario
   */
function logOut() {
    this.$router.push("/login");
    localStorage.setItem("nickname", "");
    localStorage.setItem("email", "");
    localStorage.setItem("image", "");
}

function getTopics() {

}