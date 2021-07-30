<template>
  <v-container>
    <div class="d-flex">
      <v-btn color="primary" to="/" right class="ml-auto">
        Regresar
      </v-btn>
    </div>
    <h1 class="text-center mb-4">
      Algoritmo Slow Job First
    </h1>
  <v-row justify="center">
  <v-col cols="6">
  <p class="subtitle text-center">
    La caracteristica de este algoritmo es tomar el proceso con menor tiempo de ejecución de la cola de listos y los envia al cpu para ser procesados.
  </p>
  </v-col>
  </v-row>
    <v-row class="text-center">
      <v-col cols="12">
        <v-container>
          <p class="text-h5 font-weight-bold">
            Procesos a ejecutar
          </p>
          <p class="text-subtitle">
            A continuación de muestran los procesos que se van a a ejecutar haciendo uso del algoritmo Slow-Job-First (el de menor trabajo primero), al iniciar la ejecución se generarán nuevos procesos con tiempo de ejecución aleatorios que se puede configurar, se podra incluir procesos de manera manual, la velocidad de los pasos, el porcentaje de probabilidad de creación de un proceso por cada paso, al igual que el promedio de procesos bloqueados tambien son configurables.
          </p>
          <v-row justify="center">
            <v-col cols="12">
            <Table :data="process_list"/>
            </v-col>
          </v-row>
        </v-container>  
      </v-col>
    </v-row>

    <v-row>

      <v-text-field 
        label="Tiempo de ejecución en milisegundos" 
        v-model="tiempoEjecución" 
        type="number"
        :disabled="count > 0"
        />
      
      <v-spacer/>

      <v-select
      :items="itemsPromedyExec" 
        label="Promedio de tiempo de ejecución de procesos" 
        v-model="promedyExec"
        messages="bajo: 1-5, medio: 6-10, alto: 11-20 pasos"
        type="number"
        :disabled="count > 0"
        />
      
      <v-spacer/>
      
      <v-text-field 
        label="Promedio de creación de proceso por cada paso" 
        v-model="newPromedy"
        suffix="%"
        type="number" 
        hint="de 1 a 99"
        :disabled="count > 0"
        />
      
      <v-spacer/>
      
      <v-select 
        :items="itemsProbabilityBlock" 
        label="Probabilidad de proceso bloqueado" 
        v-model="probabilityBlock" 
        :disabled="count > 0"
      />
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
      <v-btn @click="agregarNuevoProceso()" v-if="start && count > 4" color="primary">
        incluir proceso
      </v-btn>
    </v-row>
    
    <v-row v-if="count > 0" justify="center" class="mt-8">
      <span>
          Paso: {{count -1}}
      </span>
      <span class="ml-4">
        Promedio de espera: {{Number(promedio_t_finalizado).toFixed(2)}} pasos
      </span>
      <span class="ml-4">
        Promedio de ejecución: {{Number(promedio_t_exe).toFixed(2)}} pasos
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
      newPromedy: 25,
      promedyExec: 5,
      tiempoEjecución: 1000,
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
          t_arr: 1,
          t_espera: 0,
        },
        {
          id:3,
          t_exe: 5,
          t_arr: 3,
          t_espera: 0,
        },{
          id:4,
          t_exe: 2,
          t_arr: 4,
          t_espera: 0,
        }
      ],
      probabilityBlock: 2,
      itemsPromedyExec: [
      {
        text: 'bajo',
        value: 5
      },
      {
        text: 'medio',
        value: 10
      },
      {
        text: 'alto',
        value: 20
      },],
      itemsProbabilityBlock:[
      {
        text: '20%',
        value: 2
      },
      {
        text: '30%',
        value: 3
      },
      {
        text: '40%',
        value: 4
      },],
      
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
      this.intervalo = setInterval(this.proceso, this.tiempoEjecución)
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
          t_arr: 1,
          t_espera: 0,
        },
        {
          id:3,
          t_exe: 5,
          t_arr: 3,
          t_espera: 0,
        },{
          id:4,
          t_exe: 2,
          t_arr: 4,
          t_espera: 0,
        }
      ]
    },
    proceso(){
      /* Variable aleatoria para bloequear un proceso en cpu */
      const bloquearProceso = aleatorio(1,10) < this.probabilityBlock
      if(this.count > 8){
        /* Crear un nuevo proceso con newPromedy de probabilidad en el paso actual */
        if(Math.floor(Math.random() * 100) + 1 >= 100 - this.newPromedy){
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

      /* Ordena la cola de listos con los procesos de menor tiempo de ejecución primero*/
      this.process_ready.sort((a, b) => a.t_exe - b.t_exe )
      /* ***************** Bloqueo********************* */
      /* Se evalua si hay un proceso en la cola de bloqueados
        si hay procesos bloqueados se quita 1 unidad de tiempo 
        si hay un proceso con tiempo de bloqueo 0 se quita y se incluye en la cola de listos
      */
      if(this.process_block.length>0){
        this.process_block = this.process_block.map(item=>{
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
    agregarNuevoProceso(manual){
      let t_arr
      if(manual){
        t_arr = aleatorio(this.count, this.count+10)
      }else {
        t_arr = aleatorio(this.count, this.count+5)
      }
      const id = this.process_list.length+1
      const t_exe = aleatorio(1,this.promedyExec)
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