<template>
<div class="input-container">
  <form class="form" @submit.prevent="addComment">
    <div class="form-group">
        <input type="text" id="title" v-model="content" required/>
    </div>
    <input class="add-comm" type="submit" value="Add">
</form>
</div>
</template>
<script>
export default {
  name: 'AddComment',
  props:[""],
  data(){
    return{
      content: "",
      ifAddComment: false
    }
  },
  methods : {
      addComment(){
          this.$emit("addComment",{
            content: this.content
          });
          this.content="";
      }
  }
}
</script>


<style lang="scss">
.add-comm{
        background: none;
        border: 2px solid;
        border-radius: 5px;
        font: inherit;
        line-height: 1;
        padding: 0.6em 1em;
        transition: 0.25s;
        margin: 5px;
        display: inline-block;
        color: #252537;
        height: 50px;
        padding: 0 20px;
        background-color: #d1c6c0;
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
</style>
