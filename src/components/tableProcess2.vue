<template>
  <v-simple-table
    fixed-header
    dense
    height="160px">
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-center">
            Id Proceso
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in data"
          :key="item.id"
        >
          <td  class="text-center">{{ item.id }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
name: 'TablaDeProcesos',
props:{
  data:{
    type: Array,
    required: true,
  }
},
}
</script>

<style>

</style>