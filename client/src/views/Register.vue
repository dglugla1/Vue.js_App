<template>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
<div class="wrapper">
  <div class="d-flex justify-content-center login">
    <form class="form" @submit.prevent="register">
    <header class="head-form">
      <h2>Register</h2>
      <p>register here using your nickname, e-mail and password</p>
      <p style="color: #c19683">{{value["response"]}}</p>
   </header>
    <div class="form-group">
       <span class="input-item">
           <i class="fa fa-user-circle"></i>
         </span>
      <input class="form-input" type="text" id="nickname" v-model="nickname" placeholder="Nickname" required/>
      </div>
      <div class="form-group">
      <span class="input-item">
           <i class="fa fa-envelope"></i>
         </span>
      <input class="form-input" type="text" id="email" v-model="email" placeholder="E-mail" required/>
      </div>
      <div class="form-group">
      <span class="input-item">
           <i class="fa fa-key"></i>
         </span>
      <input class="form-input" type="password" id="password" v-model="password" placeholder="Password" required/>
      </div>
       <div class="form-group">
       <span class="input-item">
           <i class="fa fa-key"></i>
         </span>
      <input class="form-input" type="password" id="password2" v-model="password2" placeholder="Repeat password" required/>
      </div>
      <input class="sbmt" type="submit" value="Register">
    </form>
  </div>
</div>
</template>

<script>

import axios from "axios";
export default {
  name: 'Register',
  data(){
    return{
      nickname:"",
      email:"",
      password:"",
      password2:"",
      value:""
    }
  },
  methods: {
    validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    register(){
      if(this.password !== this.password2){
        this.value = 'Hasła nie mogą być różne';
      }
      else if(!this.validateEmail(this.email)){
          this.value = "Email is not valid";
      }
      else {
        axios.post(`/register`,{
          nickname: this.nickname,
          email: this.email,
          password: this.password
        },{withCredentials: true})
        .then((value)=>{
            this.value = value["data"];
        })
        .catch((err)=>{
          this.value = err;
        })
      }
    }
  }

}
</script>
<style lang="scss">
@import '../assets/styles/form.scss';
</style>
