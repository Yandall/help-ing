<template>
  <div class="body">
    <b-container>
      <h1>BIENVENIDO</h1>
    </b-container>
  </div>
</template>

<script>
export default {
  beforeMount() {

    if (localStorage.getItem("nickname") == ""){
        this.$router.push("/login");
    } else{
      this.$router.push("/home");
    }
  }
};
</script>
