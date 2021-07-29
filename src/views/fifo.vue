<template>
  <v-container>
    <h1 class="text-center">
      Algoritmo Fifo (First-in-first-out)
    </h1>

    <v-row class="text-center">
      <v-col cols="12">
        <v-container>
          <p class="text-h4">
            Procesos a ejecutar
          </p>
          <p class="text-subtitle">
            A continuación de muestran los procesos que se van a a ejecutar haciendo uso del algoritmo Fifo, al iniciar la ejecución se podra generar nuevo procesos con tiempo de ejecución aleatorios
          </p>
          <v-row justify="center">
            <v-col cols="12">
            <Table :data="process_list"/>
            </v-col>
          </v-row>
        </v-container>  
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-btn color="green" class="white--text  mx-2" @click="iniciar()" v-if="!start">
        Comenzar
      </v-btn>
      <v-btn color="red" class="white--text  mx-2" v-if="start" @click="detener()">
        Detener
      </v-btn>
      <v-btn color="yellow darken-2" class="white--text mx-2" v-if="count > 0 && !start" @click="reiniciar()">
        Reiniciar
      </v-btn>
      <v-btn @click="agregarNuevoProceso()" v-if="start && count > 8">
        incluir proceso
      </v-btn>
    </v-row>
    
    <v-row v-if="count > 0" justify="center" class="mt-8">
      <span>
          Paso: {{count -1}}
      </span>
    </v-row>


    <section class="mt-12">
      <v-row>
        <v-col cols="4">
          <p class="text-h6 text-center">
            Cola de listos
          </p>
          <Table2 :data="process_ready"/>
        </v-col>
        <v-col>
          <p class="text-h6 text-center">
            Cpu
          </p>
          <Table2 :data="cpu"/>
        </v-col>
        <v-col>
          <p class="text-h6 text-center">
            Finalizados
          </p>
          <Table2 :data="process_finished"/>
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>

<script>
import Table from '../components/tableProcess'
import Table2 from '../components/tableProcess2'
export default {
  components:{
    Table,
    Table2
  },
  data(){
    return{
      start: false,
      intervalo: '',
      count: 0,
      cpu: [],
      process_ready:[],
      process_finished:[],
      process_list:[
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
          t_arr: 5,
          block: ''
        },{
          id:4,
          t_exe: 6,
          t_arr: 8,
          block: ''
        }
      ]
    }
  },
  methods:{
    iniciar(){
      this.start = true
      this.intervalo = setInterval(this.proceso, 1000)
    },
    detener(){
      this.start = false
      clearInterval(this.intervalo)
    },
    reiniciar(){
      this.count= 0
      this.cpu= []
      this.process_ready=[]
      this.process_finished=[]
      this.process_list=[
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
          t_arr: 5,
          block: ''
        },{
          id:4,
          t_exe: 6,
          t_arr: 8,
          block: ''
        }
      ]
    },
    proceso(){

      if(this.count > 8){
        /* Crear un nuevo proceso con 25% de probabilidad en el paso actual */
        if(Math.floor(Math.random() * 100) + 1 >= 75){
          this.agregarNuevoProceso()
        }
      }
      /* Se evalua si llega un nuevo proceso */
      const nuevoProceso = this.process_list.filter(item=>{
        return item.t_arr === this.count
      })

      /* Se inclue el proceso nuevo en la cola de listos */
      if(nuevoProceso.length > 0){
        this.process_ready.push(JSON.parse(JSON.stringify(nuevoProceso[0])))
      }
      

      /* Incluyo un nuevo proceso si el cpu esta libre */
      if(this.cpu.length === 0 && this.process_ready.length>0){
        this.cpu.push(this.process_ready.shift())
      } 
      /* Si el proceso finalizo el tiempo de ejecución, sale del cpu y entra a la lista de finalizados */
      else if( this.cpu.length > 0 && this.cpu[0].t_exe === 0 ){
        this.process_finished.push(this.cpu.pop())
      }
      /* Quemo 1 tiempo en el proceso */
        else if(this.cpu.length > 0){
          this.cpu[0].t_exe -= 1
      }

      /* Aumento el tiempo */
      this.count += 1
    },
    agregarNuevoProceso(){
      const t_arr = this.aleatorio(this.count, this.count+5)
      const id = this.process_list.length+1
      const t_exe = this.aleatorio(1,10)
      this.process_list.push({
        t_arr,
        id,
        t_exe
      })
    },
    aleatorio(minimo,maximo){
      return Math.floor(Math.random() * ((maximo+1)-minimo)+minimo);
    }
  }
}
</script>

<style>

</style>