<template>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <div class="wrapper">
    <div class="d-flex justify-content-center login">
      <form class="form" @submit.prevent="change">
      <header class="head-form">
      <h2>Change your password</h2>
      <p style="color: #c19683">{{value}}</p>
      </header>
      <div class="form-group">
    
        <input class="form-input" type="password" id="password" v-model="password" placeholder="Password" required/>
      </div>
      <div class="form-group">
  
        <input class="form-input" type="password" id="password1" v-model="password1" placeholder="New password" required/>
      </div>
      <div class="form-group">

        <input class="form-input" type="password" id="password2" v-model="password2" placeholder="Repeat new password" required/>
      </div>
      <input class="sbmt" type="submit" value="Change">
      </form>
    </div>
</div>
</template>

<script>
import axios from "axios";
export default {
  name: 'Change',
  data(){
    return{
      password:"",
      password1:"",
      password2:"",
      value:""
    }
  },
  methods: {
    change(){
        if(this.password1 !== this.password2){
        this.value = 'New password and repeated new password do not match';
      }
      else if(this.password === this.password1){
          this.value = 'New password cannot be the same as old one';
      }
      else {
        axios.post(`/change`,{
        password: this.password,
        password1: this.password1,
        password2: this.passwod2
        },{withCredentials: true})
            .then((value)=>{
            this.value = 'Password changed';
            this.password="";
            this.password1="";
            this.password2="";
        })
        .catch((err)=>{
          this.value = 'Something went wrong';
        })
      }
    }
  }

}
</script>
<style>
</style>
