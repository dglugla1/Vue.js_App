<template>
<div class="row cont">
  <div class="col-md-3 col-sm-12 subreddits-list" align="center">

  <div class="row add-subreddit-btn">
  <button class="add" @click="this.ifAddSubreddit=!this.ifAddSubreddit">Add new subreddit</button>
  <p>{{msg}}</p>
  </div>

  <div class="row add-subreddit-form">
  <div v-if="ifAddSubreddit">
        <AddSubreddit v-on:subName="addSubreddit"/>
  </div>  
  </div>

  <div class="row add-subreddit-search">
  <div class="col-md-12 col-sm-12 search-post-input" >
    <input class="form-input" type="text" v-model="searchSub" placeholder="Search subreddit..." >
  </div>
  </div>

  
  <div class="row justify-content-md-center subreddit-list">
  <ul class="subreddit-list-items" v-for="subreddit in subredditsReturn" :key="subreddit.id">
      <router-link :to="{ path: '/subreddit/' + subreddit.name, params: {description: subreddit.description}}">{{ subreddit.name }}</router-link>
    </ul>
  </div>
  </div>

  <div class="col-md-9 col-sm-12 posts">
  <router-view :key="$route.path" />
  </div>
</div>
</template>

<script>

import axios from "axios";
import AddSubreddit from "../components/AddSubreddit.vue";

export default {
  name: 'Subreddits',
  components:{
    AddSubreddit
  },
  data(){
    return{
      subreddits: [],
      error:"",
      msg: "",
      searchSub: "",
      ifAddSubreddit: false,
      ifModerator: false,
      socket:[]
    }
  },
  computed:{
    subredditsReturn(){
      if(this.searchSub ===""){
      return this.subreddits;
      }else{
        return this.subreddits.filter((subreddit)=>{
          if(subreddit.name.includes(this.searchSub)){
            return true;
          }else{
            return false;
          }
        })
      }
    }
  },
  methods: {
    
    addSubreddit(newSubreddit){
      axios.post(`/subreddit/addSubreddit`,{
          name: newSubreddit.name,
          description: newSubreddit.description
        },{withCredentials: true})
        .then((value)=>{
          if("response" in value["data"]){
            this.msg = value["data"]["response"];
          }
          else {
            this.subreddits.push(value["data"][0]);
            this.msg = "Subreddit added successfully";

          }
        })
        .catch((err)=>{
          this.value = err;
        })
    }
  },
  async created(){
    
    axios.get(`/subreddit`,{withCredentials: true})
        .then((values)=>{
            this.subreddits = values["data"];
        })
        .catch((err)=>{
            this.subreddits = err;
        })

        
    }

}
</script>

<style lang="scss">
@import '../assets/styles/subreddits.scss';
</style>
