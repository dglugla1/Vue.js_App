<template>
<div class="container-fluid">
  <div class="row justify-content-md-center navigation">
    <div class="col-sm nav-item" v-if="auth" align="center">
    <router-link to="/">Home</router-link>
    </div>
    <div class="col-sm nav-item" v-if="auth" align="center">
      <router-link to="/change">Change password</router-link>
    </div>
    <div class="col-sm" v-if="auth" align="center">
      <button id="logout" @click="logout">Log out</button>
    </div>
    <div class="col-sm" v-if="!auth" align="center">
      <router-link to="/register" id="register">Register</router-link>
    </div>
    <div class="col-sm" v-if="!auth" align="center">
      <router-link to="/login" id="login">Login</router-link>
    </div>
  </div>
  <router-view v-on:authenticated="authorize"/>
</div>
</template>

<script>
import axios from "axios";
export default {
  name: 'App',
  data(){
    return{
        auth: false
    }
  },
  methods: {
    logout(){
      axios.get(`/logout`,{withCredentials: true});
      this.auth=false;
      this.$router.push('/login');
    },
    authorize(){
      this.auth = true;
    }
  },
   created(){
      axios.get(`/auth`,{withCredentials: true})
       .then(()=>{
        this.auth = true;
      })
      .catch(()=>{
        this.auth = false;
        this.$router.push('/login');
      })
    }
}

</script>
<style lang="scss">
.navigation {
  background-color: black;
  padding:10px;
  a{
    display: inline-block;
    text-decoration: none !important;
    color: white;
    &:hover{
      color: gray;
    }
  }
  #logout{
    background: none;
    border: 2px solid;
    font: inherit;
    line-height: 1;
    //margin: 0.5em;
    padding: 0.6em 1em;
    color: white;
    transition: 0.25s;

    &:hover,
    &:focus {
      box-shadow: inset 0 0 0 2em white;
      border-color: #D9D9D9;
      color: black;
      background: white;
    }
  }
}
</style>
