<template>
  <v-container class="pt-12">
    <v-row class="text-center">
      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
          Bienvenidos
        </h1>

        <p class="subheading font-weight-regular mt-8">
          Este es un simulador de planificador de procesos <br>
          a corto plazo
        </p> 
        
      </v-col>

      <v-col
        class="mb-5"
        cols="12"
      >
        <h2 class="headline font-weight-bold mb-3">
          Selecciona un algoritmo de planificación
        </h2>

        <v-row justify="center" class="mt-6">
          <v-card
            v-for="(option, i) in options"
            :key="i"
            :to="option.href"
            class="subheading mx-3 py-2 my-4"
            link
            :color="option.background"
          >
          <v-card-content class="white--text text-subtitle-1 font-weight-medium pa-4">
            
            {{ option.text }}
            </v-card-content>
          </v-card>
        </v-row>
      </v-col>

    </v-row>
    <p class="caption text-center">Desarrollado por: Elvis J. Páez R.<br> c.i: 24.853.972</p>
  </v-container>
</template>

<script>
  export default {
    name: 'HelloWorld',

    data: () => ({
      options: [
       {
        text:'Fifo',
        background: 'success',
        href: '/fifo'
      },
      {
        text:'Segundo Elemento',
        background: 'warning',
        href: '#'
      },
      {
        text:'Tercer Elemento',
        background: 'indigo',
        href: '#'
      }
      ],
    }),
  }
</script>
