<template>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<div class="wrapper">
  <div class="d-flex justify-content-center login">
    <form class="form" @submit.prevent="login">
    <header class="head-form">
      <h2>Log In</h2>
      <p>login here using your username and password</p>
      <p style="color: #c19683">{{value}}</p>
   </header>
    <div class="form-group">
    <span class="input-item">
           <i class="fa fa-user-circle"></i>
         </span>
      <input class="form-input" type="text" id="email" v-model="email" placeholder="E-mail" required/>
      </div>
      <div class="form-group">
        <span class="input-item">
          <i class="fa fa-key"></i>
        </span>
       <input class="form-input" type="password" id="password" v-model="password" placeholder="Password" required/>
      </div>
      <input class="sbmt" type="submit" value="Login">
    </form>
  </div>
</div>
</template>

<script>

import axios from "axios";
export default {
  name: 'Login',
  data(){
    return{
      email:"",
      password:"",
      value:""
    }
  },
  methods: {
    login(){
        axios.post(`/login`,{
          username: this.email,
          password: this.password
        },{withCredentials: true})
        .then((value)=>{
            this.value = value["data"]['msg'];
            this.$emit('authenticated');
            this.$router.push('/');
        })
        .catch((err)=>{
          this.value = 'Unauthorized';
        })
    }
  }

}
</script>
<style lang="scss">
</style>
