<template>
  <v-container>
    <h1 class="text-center">
      Algoritmo Fifo (First-in-first-out)
    </h1>
    <div class="d-flex">
  <v-btn color="primary" to="/" right class="ml-auto">
    Regresar
  </v-btn>
  </div>
    <v-row class="text-center">
      <v-col cols="12">
        <v-container>
          <p class="text-h4">
            Procesos a ejecutar
          </p>
          <p class="text-subtitle">
            A continuación de muestran los procesos que se van a a ejecutar haciendo uso del algoritmo Fifo, al iniciar la ejecución se generarán nuevo procesos con tiempo de ejecución aleatorios (de 1 a 5 pasos) y un porcentaje de 25% de probabilidades de creación en cada paso, ademas se podra incluir procesos de manera manual; cada paso es t=1 seg.
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
      <v-btn @click="agregarNuevoProceso()" v-if="start && count > 8" color="primary">
        incluir proceso
      </v-btn>
    </v-row>
    
    <v-row v-if="count > 0" justify="center" class="mt-8">
      <span>
          Paso: {{count -1}}
      </span>
      <span class="ml-4">
        Promedio de espera: {{Number(promedio_t_finalizado).toFixed(2)}} seg
      </span>
      <span class="ml-4">
        Promedio de ejecución: {{Number(promedio_t_exe).toFixed(2)}} seg
      </span>
      <span class="ml-4">
        Promedio de procesos bloqueados: {{Number(promedio_procesos_bloqueados.toFixed(2)) * 100}}%
      </span>
    </v-row>

    


    <section class="mt-12">
      <v-row>
        <v-col cols="3">
          <p class="text-h6 text-center">
            Cola de listos
          </p>
          <Table2 :data="process_ready"/>
        </v-col>
        <v-col cols="3">
          <p class="text-h6 text-center">
            Cola de Bloqueados
          </p>
          <Table2 :data="process_block"/>
        </v-col>
        
        <v-col cols="3">
          <p class="text-h6 text-center">
            Cpu
          </p>
          <Table2 :data="cpu"/>
        </v-col>
        <v-col cols="3">
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
import aleatorio from '../static/aleatorio'
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
      promedio_t_finalizado: 0,
      promedio_t_exe: 0,
      promedio_procesos_bloqueados: 0,
      process_ready:[],
      process_block:[],
      process_finished:[],
      process_list:[
        {
          id:1,
          t_exe: 4,
          t_arr: 0,
          t_espera: 0,
        },
        {
          id:2,
          t_exe: 3,
          t_arr: 2,
          t_espera: 0,
        },
        {
          id:3,
          t_exe: 5,
          t_arr: 5,
          t_espera: 0,
        },{
          id:4,
          t_exe: 2,
          t_arr: 8,
          t_espera: 0,
        }
      ]
    }
  },
  watch:{
    process_finished(){
      let sumT_espera = 0
      let sumT_cpu = 0
      let process_blocks = 0
      if(this.process_finished.length > 0){
        this.process_finished.forEach(item =>{
          sumT_espera += item.t_espera
          sumT_cpu += item.t_cpu
          if(item.hasBlocked){
            process_blocks += 1
          }
        })
        this.promedio_t_finalizado = sumT_espera/this.process_finished.length
        this.promedio_t_exe = (sumT_cpu)/this.process_finished.length
        this.promedio_procesos_bloqueados = process_blocks/this.process_finished.length
      }else {
        this.promedio_procesos_bloqueados
        this.promedio_t_finalizado
        this.promedio_t_exe
      }
    },
    
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
          t_espera: 0,
        },
        {
          id:2,
          t_exe: 3,
          t_arr: 2,
          t_espera: 0,
        },
        {
          id:3,
          t_exe: 5,
          t_arr: 5,
          t_espera: 0,
        },{
          id:4,
          t_exe: 2,
          t_arr: 8,
          t_espera: 0,
        }
      ]
    },
    proceso(){
      /* Variable aleatoria para bloequear un proceso en cpu */
      const bloquearProceso = aleatorio(1,10) < 2
      console.log(bloquearProceso)
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

      /* Se incluye el proceso nuevo en la cola de listos */
      if(nuevoProceso.length > 0){
        this.process_ready.push(JSON.parse(JSON.stringify(nuevoProceso[0])))
      }
      /* Se le agrega una unidad de espera a los procesos que estan en la cola de listos*/
      if(this.process_ready.length > 0){
        this.process_ready.map(item =>{
          item.t_espera += 1
        })
      }

      /* ***************** Bloqueo********************* */
      /* Se evalua si hay un proceso en la cola de bloqueados
        si hay procesos bloqueados se quita 1 unidad de tiempo 
        si hay un proceso con tiempo de bloqueo 0 se quita y se incluye en la cola de listos
      */
      if(this.process_block.length>0){
        this.process_block = this.process_block.map(item=>{
          console.log(`item: ${JSON.stringify(item)}`)
          item.t_block -=1
          return item
        })
        
        this.process_block = this.process_block.filter(item=>{
          if(item.t_block === 0){
            this.process_ready.push(item)
            return false
          } else {
            return true
          }
        })
       }
       /* 
       ********************* CPU **************************
       */
      /* Incluyo un nuevo proceso si el cpu esta libre */
      if(this.cpu.length === 0 && this.process_ready.length>0){
        this.cpu.push(this.process_ready.shift())
        this.cpu[0].t_cpu = 1
      } 
      /* Si el proceso finalizo el tiempo de ejecución, sale del cpu y entra a la lista de finalizados */
      else if( this.cpu.length > 0 && this.cpu[0].t_exe === 0 ){
        this.process_finished.push(this.cpu.pop())
      } 
      /* Probabilidad de que el proceso de bloque y salga del procesador */
      else if(this.cpu.length > 0 && bloquearProceso){
        const newProcessBlock = this.cpu.shift()
        newProcessBlock.t_block = aleatorio(1,4)
        newProcessBlock.hasBlocked = true
        this.process_block.push(newProcessBlock)
      }
      /* Quemo 1 tiempo en el proceso */
        else if(this.cpu.length > 0){
          this.cpu[0].t_cpu += 1
          this.cpu[0].t_exe -= 1
      }

      /* Aumento el tiempo */
      this.count += 1
    },
    agregarNuevoProceso(){
      const t_arr = aleatorio(this.count, this.count+5)
      const id = this.process_list.length+1
      const t_exe = aleatorio(1,5)
      this.process_list.push({
        t_arr,
        id,
        t_exe,
        t_espera: 0
      })
    },
  }
}
</script>

<style>

</style>