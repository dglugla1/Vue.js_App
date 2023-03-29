<template>
<div class="input-container post-addition">
  <form class="form" @submit.prevent="addPost">
    <div class="form-group">
        <input class="form-input" type="text" id="title" v-model="title" placeholder="Ttile" style="width:300px;" required/>
    </div>
    <div class="form-group">
        <input class="form-input" type="text" id="content" v-model="content" placeholder="Content" style="width:300px;" required/>
    </div>
    <div class="form-group">
        <input class="form-input" type="file" id="image_url" v-on:change="processFile($event)" placeholder="Image path" style="width:300px;" required/>
    </div>
    <div class="form-group">
        <input class="form-input" type="text" id="video_url" v-model="video_url" placeholder="Video url" style="width:300px;"/>
    </div>
    <input class="sbmt" id="add-post" type="submit" value="Add">
</form>
</div>
</template>
<script>
export default {
  name: 'AddPost',
  props:["subredditName"],
  data(){
    return{
      title: "",
      content: "",
      image_path: "",
      video_url: "",
      ifAddPost: false,
      uploadedFile: ""
    }
  },
  methods : {
      addPost(){
          this.$emit("subName",{
            title: this.title,
            content: this.content,
            image_path: this.image_path,
            video_url: this.video_url,
            uploadedFile: this.uploadedFile
          });
          this.title="";
          this.content="";
          this.image_path="";
          this.video_url="";
          this.uploadedFile="";
      },
      processFile(event){
            this.uploadedFile = event.target.files[0];
            console.log(this.uploadedFile)
        }
  }
}
</script>


<style lang="scss">
@import '../assets/styles/form.scss';
</style>
