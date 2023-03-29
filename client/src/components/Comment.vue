<template>
<div class="com-content">
<p>{{comment.content}}</p>
<div class="div-btn">
<button class="del" v-if="ifModerator" @click="deleteComment" >Delete</button>
</div>
</div>
</template>

<script>
import axios from "axios";
export default {
  name: 'Comment',
  props:["comment","ifModerator"],
  components:{
  },
  data(){
    return{
        
    }
  },
  methods : {
    deleteComment(){
      this.$emit("deleteComment",this.$props.comment.id);
    }
  },
  created(){
  }
}
</script>


<style lang="scss">
.com-content{
  background-color: #d1c6c0;
  padding: 5px;
  margin: 2px;
  min-height: 40px;
    p{
      float: left;
    }
  .com-btn{
    overflow: hidden;
      .btn{
      border: none;
      padding: 5px;
      border-radius: 15px;
      float: right;
     }
  }
}
</style>
