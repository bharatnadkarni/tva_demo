<template>
  <v-list class="magnitude_list" color="transparent">
    <v-list-item v-for="(item, index) in magnitudeData" :key="index">
      <v-list-item-icon>
        <magnitude-square
          :day="dayUpdate ? dayUpdate : day"
          :index="index"
          :max="maxUpdate ? maxUpdate : magnitudeMax"
          :value="item.magnitude"
        />
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title class="magnitude_list_text"
          >Name: {{ item.name }}</v-list-item-title
        >
        <v-list-item-title class="magnitude_list_text"
          >Diameter: {{ item.diameter.toFixed(3) }} km</v-list-item-title
        >
        <v-list-item-title class="magnitude_list_text"
          >Magnitude: {{ item.magnitude.toFixed(3) }} h</v-list-item-title
        >
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
import MagnitudeSquare from "~/components/MagnitudeSquare.vue"

export default {
    props: ['magnitudeData', 'magnitudeMax', 'day'],
    components: {MagnitudeSquare},
    data(){
        return {
            dayUpdate: null,
            maxUpdate: null
        }
    },
    watch: {
        day(){
            this.dayUpdate = this.day
            this.maxUpdate = this.magnitudeMax
        }
    }
}
</script>