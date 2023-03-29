<template>
<div class="row posts-nav">
  {{error}}
  <div class="row posts-nav-description">
    <div class="col-md-6 description-text">
    <h2>{{subredditDescription}}</h2>
    </div>
    <div class="col-md-6 edit-descr">
      <div class="edit-descr-check" v-if="ifModerator">
          <form class="form" @submit.prevent="editDescription">
              <div class="form-group">
                <input class="form-input" type="text" id="subredditDescription" v-model="subredditDescription" placeholder="Edit description...">
              </div>
              <input class="edit-dscr-btn" type="submit" value="Edit description">
        </form>
        </div>
    </div>
  </div>

  <div class="row posts-nav-buttons">
  <div class="col-md-4 col-sm-12 add">
  <button class="sbmt" id="join-btn" @click="this.ifAddPost=!this.ifAddPost">Add new post</button>
  </div>
  <div class="col-md-4 col-sm-12 join">
 
  <button class="sbmt" id="join-btn" v-if="!ifJoined" @click="joinSubreddit">+ Join subreddit</button>
  <button class="sbmt" id="join-btn" v-if="ifJoined" @click="joinSubreddit">Leave</button>
  </div>
  <div class="col-md-4 col-sm-12 sort">

 <button class="sbmt" id="join-btn" @click="this.dateSort=!this.dateSort">Sort by date</button>
  </div>
</div>

  <div class="row add-show-form" align="center">
<div class="colored-form" v-if="ifAddPost">
    <AddPost :subredditName="$route.params.name" v-on:subName="addPost"/>
    </div>
</div>


<div class="row search-post">
<input v-model="searchPos" class="search" type="text" placeholder="Search posts...">
</div>

<div class="row one-post" align="center">
  <ul v-for="post in subredditPosts" :key="post.id">
      <div class="col-md-10 post">
      <Post :post="post" :ifModerator="ifModerator"  v-on:deletePost="deletePost" />
      </div>
    </ul>
</div>
</div>
</template>

<script>
import axios from "axios";
import AddPost from "../components/AddPost.vue";
import Post from "../components/Post.vue";
import io from 'socket.io-client'; 
export default {
  name: 'Posts',
  components:{
    AddPost,
    Post
  },
  props:['description'],

  data(){
    return{
      posts: [],
      ifAddPost: false,
      ifModerator:false,
      ifJoined: false,
      subredditDescription: "",
      searchPos: "",
      dateSort: false,
      error:""
    }
  },
  computed:{
    subredditPosts() {
      if (this.searchPos === "") {
        if (this.dateSort) {
          let post_temp = [...this.posts];
          return post_temp.sort((a, b) => {
            return a.creation_date > b.creation_date
              ? -1
              : a.creation_date < b.creation_date
              ? 1
              : 0;
          });
        } else {
          return this.posts;
        }
      } else {
        if (this.dateSort) {
           let post_temp = [...this.posts];
          return post_temp.filter((post) => {
            if (post.content.includes(this.searchPos)) {
              return true;
            } else {
              return false;
            }
          }).sort((a, b) => {
            return a.creation_date > b.creation_date
              ? -1
              : a.creation_date < b.creation_date
              ? 1
              : 0;
          });
        } else {
          return this.posts.filter((post) => {
            if (post.content.includes(this.searchPos)) {
              return true;
            } else {
              return false;
            }
          });
        }
      }
    },

    postsReturn(){
      if(this.searchPos ===""){
      return this.posts;
      }else{
        return this.posts.filter((post)=>{
          if(post.title.includes(this.searchPos)){
            return true;
          }else{
            return false;
          }
        })
      }
    }
  },
  methods: {
    deletePost(id){
      this.error="Hello";
      axios.get(`/userid`,{withCredentials: true})
            .then((value)=>{
                this.idUser = value["data"][0]["id"];
                this.socket.emit("deletePost",{post_id:id});
            })
            .catch((err)=>{
            })
    },
    deletedPost(id){
      const post = this.posts.findIndex(post => post.id === id);
      this.posts.splice(post,1);
    },
    addPost(newPost){
      
      const form = new FormData();
            form.append('title', newPost.title);
            form.append('content', newPost.content);
            form.append('file', newPost.uploadedFile);
            form.append('video_url', newPost.video_url);
      axios.post(`/subreddit/${this.$route.params.name}/addPost`,form,{withCredentials: true})
        .then((value)=>{
          this.posts.push(value["data"][0]);
        })
        .catch((err)=>{
          this.value = err;
        })
    },
    editDescription(){
          axios.patch(`/subreddit/${this.$route.params.name}/editdescr`,{
          description: this.subredditDescription
        },{withCredentials: true})
        .then(()=>{
      
            //
        })
        .catch((err)=>{
          this.value = err;
        })
      },

      joinSubreddit(){
        axios.post(`/subreddit/${this.$route.params.name}/subscription`,{
          ifJoined: this.ifJoined
        },{withCredentials: true})
        .then((res)=>{
          this.ifJoined = !this.ifJoined

        })
        .catch((err)=>{
          this.value = err;
        })
      }
  },
  async created(){
    this.socket =await io(``, {transports: ['websocket']});
    this.socket.on("deletedPost",post => this.deletedPost(post));
    axios.get(`/subreddit/${this.$route.params.name}`,{withCredentials: true})
        .then((values)=>{
            this.posts = values["data"];
        })
        .catch((err)=>{
            this.subreddits = err;
        
        })
    axios.get(`/subreddit/mod/${this.$route.params.name}`,{withCredentials: true})
        .then((value)=>{
          this.ifModerator = value["data"]["ifModerator"];
        })
        .catch((err)=>{
            //
        })

       axios.get(`/subreddit/${this.$route.params.name}/descr`,{withCredentials: true})
        .then((value)=>{
          this.subredditDescription = value["data"][0]["description"];
        })
        .catch((err)=>{
            //
        })

        axios.get(`/subreddit/${this.$route.params.name}/subscription`,{withCredentials: true})
        .then((value)=>{
          this.ifJoined = value["data"]["ifJoined"];
        })
        .catch((err)=>{
            //
        })
    }
}
</script>
<style lang="scss">
@import '../assets/styles/subreddits.scss';
  // #add-post{
  //   background: none;
  //   border: 2px solid;
  //   font: inherit;
  //   line-height: 1;
  //   //margin: 0.5em;
  //   padding: 0.6em 1em;
  //   color: black;
  //   transition: 0.25s;

  //   &:hover,
  //   &:focus {
  //     box-shadow: inset 0 0 0 2em white;
  //     border-color: #D9D9D9;
  //     color: black;
  //     background: white;
  //   }
  // }

</style>

