<template>
<div class="col-md-12 col-sm-12">
<form class="col-md-12 col-sm-12 form" @submit.prevent="addSubreddit">
      <div class="form-group">
        <input class="form-input" type="text" id="name" v-model="name"  placeholder="Name" required/>
      </div>
      <div class="form-group">
      <input class="form-input" type="text" id="description" v-model="description" placeholder="Description">
      </div>
      <input class=" sbmt" id="sub-add-btn" type="submit" value="Add">
</form>
</div>
</template>

<script>
export default {
  name: 'AddSubreddit',
  //props:["subredditName"],
  data(){
    return{
      name: "",
      description: "",
      ifAddSubreddit: false
    }
  },
  methods : {
      addSubreddit(){
          this.$emit("subName",{
            name: this.name,
            description: this.description
          });
          this.name="";
          this.description="";
      }
  }
}
</script>


<style lang="scss">

.form-group{
        padding: 10px;
        margin: 20px;
        .input-item {
          background: #fff;
          color: #333;
          padding: 14.5px 10px 15px 9px;
          border-radius: 5px 0px 0px 5px;
      }

      input[class="form-input"]{
        width: 240px;
        height: 30px;
        margin-top: 0.5%;
        padding: 5px;
        font-size: 12px;
        font-family: 'Abel', sans-serif;
        color: #5E6472;
        outline: none;
        border: none;
        border-bottom: solid;
        border-radius: 0px 0px 0px 0px;
        transition: 0.2s linear;
        background-color:  transparent;
    }
      }

      .sbmt{
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
      
        width: 280px;
        height: 50px;
      
        padding: 0 20px;
        background: #fff;
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
