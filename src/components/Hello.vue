<template>
  <div class="hello">
    <h1 class="text-title">{{ msg }}</h1>
    <v-container>
        <div v-for="item in cards" :key="item.name">
          <v-card>
            <div class="card-content  has-text-white" :class="item.background">
              {{item.name}}
            </div>
          </v-card>
        </div>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data(){
    return{
      cards: [{
        name:'Primer Elemento',
        background: 'has-background-success-dark',
        link: '#'
      },
      {
        name:'Segundo Elemento',
        background: 'has-background-danger-dark',
        link: '#'
      },
      {
        name:'Tercer Elemento',
        background: 'has-background-link-dark',
        link: '#'
      }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
