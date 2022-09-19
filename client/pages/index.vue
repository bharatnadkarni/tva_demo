<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="12" md="9" class="py-0">
        <div class="pa-4">
          <h4 class="asteroids_title">Asteroids of the day</h4>
        </div>
        <div class="select_holder pa-4">
          <v-row cols="12" md="6" sm="12">
            <v-col>
            <p class="select_text">Select one day to update the chart</p>
            <v-item-group mandatory v-model="selected_day" class="select_group">
              <div
                class="select_single_day ma-1"
                v-for="(day, n) in days"
                :key="n"
              >
                <v-item v-slot="{ active, toggle }">
                  <v-card
                    :class="active ? 'selected_day_card' : ''"
                    class="day_card"
                    @click="toggle"
                  >
                    <v-scroll-y-transition>
                      <p
                        class="single_day_text"
                        :class="active ? 'black-text' : 'white-text'"
                      >
                        {{ day }}
                      </p>
                    </v-scroll-y-transition>
                  </v-card>
                </v-item>
              </div>
            </v-item-group>
          </v-col>
          <v-col cols="12" md="6" sm="12" class="legend_col" :class="$vuetify.breakpoint.smAndDown ? `mt-10` : ``">
            <h4 class="diameter">DIAMETER</h4>
            <div id="legend"></div>
          </v-col>
          </v-row>
        </div>
        <div class="loading d-flex justify-center mt-8" v-if="loading">
          <h4>Loading...</h4>
        </div>
        <chart-view
          :class="$vuetify.breakpoint.smAndDown ? `mt-10` : ``"
          v-if="structuredData.length > 0"
          :structuredData="structuredData"
          :xRange="xRange"
          :yRange="yRange"
        />
      </v-col>
      <v-col cols="12" sm="12" md="3" class="py-0">
        <div
          class="pa-4"
          :class="$vuetify.breakpoint.mdAndUp ? 'left_border' : ''"
        >
          <h4 class="asteroids_title">Brightest of the week</h4>
          <h6 class="magnitude_title mt-10">MAGNITUDE</h6>
          <div class="magnitude_legend d-flex mt-8">
            <img src="/rect_filled.svg" alt="filled_rectangle" />
            Filled area: magnitude
          </div>
          <div class="magnitude_legend d-flex mt-1">
            <img src="/rect_empty.svg" alt="filled_rectangle" />
            Empty area: brightness
          </div>
          <div class="loading d-flex justify-center mt-8" v-if="loading">
            <h4>Loading...</h4>
          </div>
          <magnitude-list
            :magnitudeData="magnitudeData"
            :magnitudeMax="magnitudeMax"
            :day="selected_day"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from 'd3/dist/d3.min'
import MagnitudeList from '~/components/MagnitudeList.vue'
import ChartView from '~/components/ChartView.vue'

export default {
  name: 'IndexPage',
  components: { ChartView, MagnitudeList },
  data() {
    return {
      loading: false,
      weeklyData: null,
      structuredData: [],
      magnitudeData: [],
      magnitudeMax: null,
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      selected_day: 0,
      xRange: null,
      yRange: null,
    }
  },
  methods: {
    get_data() {
      this.loading = true
      this.$axios
        .get('/asteroids/get_data')
        .then((response) => {
          console.log(response)
          this.weeklyData = response.data.data.data

          const xRangeArray = this.weeklyData
            .map((el) => {
              return el.asteroids
            })
            .flatMap((m) => m)
            .map((el) => {
              return el.velocity
            })

          this.xRange = Math.max.apply(Math, xRangeArray)

          const yRangeArray = this.weeklyData
            .map((el) => {
              return el.asteroids
            })
            .flatMap((m) => m)
            .map((el) => {
              return el.distance
            })

          this.yRange = Math.max.apply(Math, yRangeArray)

          this.selected_day = response.data.data.today
          this.select_day(this.selected_day)
          this.loading = false
        })
        .catch((error) => {
          console.log(error)
        })
    },
    select_day(i) {
      this.structuredData = this.weeklyData[i].asteroids
      this.structuredData = this.structuredData.map((el) => {
        return {
          radius: el.diameter / 2,
          ...el,
        }
      })
      this.magnitudeData = this.structuredData
        .sort((a, b) => {
          return a.magnitude - b.magnitude
        })
        .slice(0, 5)

      this.magnitudeMax = Math.max(
        ...this.magnitudeData.map((o) => o.magnitude)
      )
    },
    draw_legend(){
      const svg = d3.select(`#legend`).append("svg").attr("width",300).attr("height",100).append("g");
      svg.append('circle')
            .attr('cx', 10)
            .attr('cy', 50)
            .attr('r', '8px')
            .attr('stroke', 'rgba(42, 245, 152, 1)')
            .attr('fill', 'none')
            .attr('stroke-width', '0.5px')
      svg.append('circle')
            .attr('cx', 10)
            .attr('cy', 50)
            .attr('r', '0.5px')
            .attr('stroke', 'rgba(42, 245, 152, 1)')
            .attr('stroke-width', '0.5px')
      svg.data([
          { d: '<p class="legend_label">Min km</p>' },
        ])
        .append('foreignObject')
        .attr('class', 'distance_text')
        .attr('x', 30)
        .attr('y', 42)
        .attr('width', 50)
        .attr('height', 18)
        .html((d) => {
          return d.d
        })
      svg.append('circle')
            .attr('cx', 130)
            .attr('cy', 50)
            .attr('r', '40px')
            .attr('stroke', 'rgba(42, 245, 152, 1)')
            .attr('fill', 'none')
            .attr('stroke-width', '0.5px')

      svg.append('circle')
            .attr('cx', 130)
            .attr('cy', 50)
            .attr('r', '0.5px')
            .attr('stroke', 'rgba(42, 245, 152, 1)')
            .attr('stroke-width', '0.5px')

      svg.data([
          { d: '<p class="legend_label">Max km</p>' },
        ])
        .append('foreignObject')
        .attr('class', 'distance_text')
        .attr('x', 140)
        .attr('y', 42)
        .attr('width', 50)
        .attr('height', 18)
        .html((d) => {
          return d.d
        })
    }
  },
  watch: {
    selected_day(i) {
      this.select_day(i)
    },
  },
  mounted() {
    this.get_data()
    this.draw_legend()
  },
}
</script>
