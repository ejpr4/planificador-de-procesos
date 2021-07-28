<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
      <h1>
        Algoritmo Fifo (First-in-first-out)
      </h1>
      </v-col>
      <v-col cols="12">

      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data(){
    return{
      process_ready:[
        {
          id:1,
          t_exe: 4,
          t_arr: 0,
          block: ''
        },
        {
          id:2,
          t_exe: 3,
          t_arr: 2,
          block: ''
        },
        {
          id:3,
          t_exe: 5,
          t_arr: 3,
          block: ''
        },{
          id:4,
          t_exe: 6,
          t_arr: 5,
          block: ''
        },
      ]
    }
  }
}
</script>

<style>

</style>