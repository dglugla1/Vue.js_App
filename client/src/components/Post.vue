<template>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

<div class="row post-header">
<div class="col-md-6 post-title">
<h1>{{post.title}}</h1>
<button class="del-pos" v-if="ifModerator" @click="deletePost">Delete</button>
</div>
<div class="col-md-6 post-votes">
<button class="icon" @click="addVote"><i class="fa fa-arrow-up"></i></button>{{sumVotes}}<button class="icon" @click="removeVote"><i class="fa fa-arrow-down"></i></button>
</div>
</div>

<div class="row post-content">
<p>{{post.content}}</p>
</div>

<div class="row justify-content-md-center post-pic">
<div class="col-md-3" align="center">
<img :src="post.image_path" width="200" height="200">
</div>

</div>

<div class="row post-vid" v-if="post.video_url !== ''">
<iframe width=400 height=400 :src="embed_video_url" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
     </iframe>
</div>

<div class="row post-comments">
<button class="com" v-if="showComments" @click="this.showComments = !this.showComments" >
Show Comments
</button>
<div v-else>
<button class="com" v-if="!showComments" @click="this.showComments = !this.showComments">
Close Comments
</button>
<ul v-for="comment in commentsInPost" :key="comment.id">
     <Comment :comment="comment" v-on:deleteComment="deleteComment" :ifModerator="ifModerator"/>
</ul>
<button class="add-com" id="add-comment" @click="this.ifAddComment=!this.ifAddComment">Add comment</button>
        <div v-if="ifAddComment">
        <AddComment v-on:addComment="addComment"/>
         </div>
</div>
</div>
</template>

<script>
import axios from "axios";
import Comment from "./Comment.vue";
import AddComment from "./AddComment.vue";
import io from 'socket.io-client'; 
export default {
  name: 'Post',
  props:["post","ifModerator"],
  components:{
      Comment,
      AddComment
  },
  data(){
    return{
        sumVotes: 0,
        userVotes: 0,
        val:"",
        voteValue:0,
        commentsInPost:[],
        showComments:true,
        ifAddComment: false,
        socket:[],
        userId: ""
    }
  },
  computed: {
         embed_video_url : function(){
             this.val = this.$props.post.video_url
            if(this.$props.post["video_url"]===null){
                return "";
            }
            let url = this.$props.post["video_url"];
            let id = url.split("v=")[1];
            return `https://www.youtube.com/embed/${id}`;
     }

},
  methods : {
     deletePost(){
         this.$emit("deletePost",this.$props.post.id);
     }, 
     deleteComment(id){
         axios.get(`/userid`,{withCredentials: true})
            .then((value)=>{
                this.idUser = value["data"][0]["id"];
                this.socket.emit("deleteComment",{comment_id:id});
            })
            .catch((err)=>{
            })
     },
     updateComments(comment){
         if(comment.post_id === this.$props.post.id){
         this.commentsInPost.push(comment)
         }
     },
     updateVotes(vote){
         this.sumVotes=vote;
     },
     updateDeletedComments(comm){
        const comments = this.commentsInPost.findIndex(comment => comment.id === comm.comment_id);
        this.commentsInPost.splice(comments,1);
     },
     addComment(content){
         axios.get(`/userid`,{withCredentials: true})
            .then((value)=>{
                this.idUser = value["data"][0]["id"];
                this.socket.emit("addComment",{content: content.content,user_id: this.idUser, post_id: this.$props.post.id});
            })
            .catch((err)=>{
                ///

            })
        
     },
     addVote(){
        //  axios.get(`/userid`,{withCredentials: true})
        //  .then((value)=>{
        //      this.idUser = value["data"][0]["id"];
        //      this.socket.emit("vote",{voteValue: 1, post_id: this.$props.post.id, user_id: this.idUser})


        //  })
            axios.post(`/subreddit/${this.$route.params.name}/p/voting`,{
                post_id: this.$props.post.id,
                voteValue: 1
            },{withCredentials: true})
            .then(()=>{
                if(this.userVotes === 0){
                    this.userVotes=1;
                    this.sumVotes=this.sumVotes+1;
                }
                else if(this.userVotes === -1){
                    this.userVotes=1;
                     this.sumVotes=this.sumVotes+2;
                }
            
            })
            .catch((err)=>{
                ///

            })

     },
     removeVote(){
    //      axios.get(`/userid`,{withCredentials: true})
    //      .then((value)=>{
    //          this.idUser = value["data"][0]["id"];
    //          this.socket.emit("vote",{voteValue: -1, post_id: this.$props.post.id, user_id: this.idUser})

    //      })
    //  }
         axios.post(`/subreddit/${this.$route.params.name}/p/voting`,{
            post_id: this.$props.post.id,
            voteValue: -1
            },{withCredentials: true})
            .then(()=>{
                if(this.userVotes === 0){
                    this.userVotes=-1;
                     this.sumVotes=this.sumVotes-1;
                }
                else if(this.userVotes === 1){
                    this.userVotes=-1;
                    this.sumVotes=this.sumVotes-2;
                }
            
            })
            .catch((err)=>{
                ///

            })
     }
  },
  async created(){
      //this.socket =await io(``, {transports: ['websocket']});
      this.socket =await io();
      this.socket.on("addedComment",comment => this.updateComments(comment));
      this.socket.on("deletedComment",comment => this.updateDeletedComments(comment));
      //this.socket.on("sumVotes", vote => this.updateVotes(vote));
      axios.post(`/subreddit/${this.$route.params.name}/p/comments`,{
          post_id: this.$props.post.id
      },{withCredentials: true})
      .then((values)=>{
          this.commentsInPost= values["data"];
            })
          
        .catch((err)=>{
          this.err = 'Something went wrong';
        })


       // /subreddit/:name/p/votes
      axios.post(`/subreddit/${this.$route.params.name}/p/votes`,{
        post_id: this.$props.post.id
        },{withCredentials: true})
        .then((value)=>{
            this.userVotes = value["data"];
            if(value["data"]["sumVotes"][0]["sum"]!==null){
                if(value["data"]["userVotes"].length === 0){
                this.userVotes = 0;
                this.sumVotes = parseInt(value["data"]["sumVotes"][0]["sum"]);
                }else{
                this.userVotes = parseInt(value["data"]["userVotes"][0]["vote"]);
                this.sumVotes = parseInt(value["data"]["sumVotes"][0]["sum"]);
                }
                }
            else {
                this.sumVotes = 0;
                this.userVotes = 0;
            }

            })
          
        .catch((err)=>{
          this.err = 'Something went wrong';
        })
  }
}
</script>

<style lang="scss">
.com{
        background: none;
        border: 2px solid;
        border-radius: 5px;
        font: inherit;
        line-height: 1;
        //margin: 0.5em;
        padding: 0.6em 1em;
        transition: 0.25s;
        margin: 20px;

        display: inline-block;
        color: #252537;
      
        //width: 280px;
        height: 50px;
      
        padding: 0 20px;
        background-color: #c19683;
        border-radius: 5px;
        outline: none;
        cursor: pointer;
        text-align: center;
        letter-spacing: 0.05em;
    
        &:hover,
        &:focus {
          box-shadow: inset 0 0 0 2em white;
          border-color: #D9D9D9;
          color: black;
          background: white;
        }
}
.del-pos{
    border: none;
    padding: 5px;
    border-radius: 15px;
}
.add-com{
    border: none;
    padding: 5px;
    border-radius: 15px;
    float: left;
}
.icon {
  background-color: #c19683;
  border-radius: 20px;
  border: none;
  color: white; 
  padding: 6px 8px;
  font-size: 10px;
  cursor: pointer;
  margin: 10px;

  &:hover{
      background-color: #d1c6c0;

  }
}
</style>
