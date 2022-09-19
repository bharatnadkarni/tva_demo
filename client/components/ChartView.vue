<template>
  <div id="chart" ref="chart" class="pa-4"></div>
</template>
<script>
import * as d3 from 'd3/dist/d3.min'
export default {
  props: ['structuredData', 'xRange', 'yRange'],
  data() {
    return {
      chart: null,
      x: null,
      y: null,
      z: null,
      tooltip: null,
    }
  },
  watch: {
    structuredData(newData) {
      this.draw_bubbles()
    },
  },
  created(){
    
  },
  mounted() {
    this.render_chart()    
    window.addEventListener('resize', ()=>{
      this.render_chart()
    })
  },
  methods: {
    render_chart() {
      d3.selectAll('#chart svg').remove()
      const margin = { top: 30, right: 40, bottom: 30, left: 40 }
      const height = 400 - margin.top - margin.bottom
      const width = this.$refs.chart.offsetWidth- margin.left - margin.right

      this.chart = d3
        .select('#chart')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + 0 + ',' + margin.top + ')')

      this.x = d3.scaleLinear().domain([0, this.xRange]).range([0, width])

      // this.chart.append("g").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x))
      
      this.y = d3.scaleLinear().domain([0, this.yRange]).range([height, 0])

      // this.chart.append("g").call(d3.axisLeft(y));

      this.chart
        .data([
          { d: '<label><img src="/arrow-up.png"/> DISTANCE (au)</label>' },
        ])
        .append('foreignObject')
        .attr('class', 'distance_text')
        .attr('x', 0)
        .attr('y', height - 30)
        .attr('width', 150)
        .attr('height', 20)
        .html((d) => {
          return d.d
        })

      this.chart
        .data([
          { d: '<label><img src="/arrow-right.png"/> VELOCITY (km/s)</label>' },
        ])
        .append('foreignObject')
        .attr('class', 'distance_text')
        .attr('x', 0)
        .attr('y', height + 5)
        .attr('width', 150)
        .attr('height', 20)
        .html((d) => {
          return d.d
        })


      // Define the gradient
      const gradient = this.chart
        .append('svg:defs')
        .append('svg:radialGradient')
        .attr('id', 'gradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '100%')
        .attr('spreadMethod', 'pad')

      // Define the gradient colors
      gradient
        .append('svg:stop')
        .attr('offset', '0%')
        .attr('stop-color', '#2AF598')
        .attr('stop-opacity', 0)

      gradient
        .append('svg:stop')
        .attr('offset', '100%')
        .attr('stop-color', '#2AF598')
        .attr('stop-opacity', 0.2)


      // Draw grid lines

      const lines = [100, 200, 300, 400]

      this.chart
        .selectAll('line.horizontalGrid')
        .data(lines)
        .enter()
        .append('line')
        .attr('class', 'horizontalGrid')
        .attr('x1', -30)
        .attr('y1', (d) => {
          return d - margin.bottom * 2
        })
        .attr('x2', width + 60)
        .attr('y2', (d) => {
          return d - margin.bottom * 2
        })
        .attr('stroke', 'white')
        .attr('opacity', 0.5)
        .attr('stroke-width', '0.5px')
        .attr('shape-rendering', 'crispEdges')

      //   Create the tooltip

      this.tooltip = d3
        .select('#chart')
        .append('div')
        .style('opacity', 0)
        .attr('class', 'tooltip')

      this.draw_bubbles()
    },

    draw_bubbles() {
      this.chart
        .selectAll('.bubble_group')
        .transition()
        .duration(500)
        .style('opacity', 0)
        .remove()

      // Add a scale for bubble size
      this.z = d3
        .scaleSqrt()
        .domain([
          Math.min(...this.structuredData.map((o) => o.radius)),
          Math.max(...this.structuredData.map((o) => o.radius)),
        ])
        .range([8, 40])

      // this.chart.selectAll(".bubble_group").remove()
      setTimeout(() => {
        const bubbles = this.chart
          .append('g')
          .attr('class', 'bubble_group')
          .selectAll('dot')
          .data(this.structuredData)
          .enter()
          .append('circle')
          .attr('class', 'bubble')
          .attr('cx', (d) => {
            return this.x(d.velocity)
          })
          .attr('cy', (d) => {
            return this.y(d.distance)
          })
          .attr('r', (d) => {
            return this.z(d.radius)
          })
          .attr('stroke', '#2AF598')
          .attr('stroke-width', '1px')
          .attr('fill', 'url(#gradient)')
          .style('opacity', 0)

        bubbles.transition().duration(200).style('opacity', 1)

        bubbles
          .on('mouseover', (event, data) => {
            this.showTooltip(
              data,
              this.x(data.velocity) + 16,
              this.y(data.distance) + 30 + 16
            )
          })
          .on('mouseout', this.hideTooltip)

        this.chart
          .append('g')
          .attr('class', 'bubble_group')
          .selectAll('dot')
          .data(this.structuredData)
          .enter()
          .append('circle')
          .attr('class', 'bubble_point')
          .attr('cx', (d) => {
            return this.x(d.velocity)
          })
          .attr('cy', (d) => {
            return this.y(d.distance)
          })
          .attr('r', '0.5px')
          .attr('stroke', '#2AF598')
          .attr('stroke-width', '0.5px')
      }, 500)
    },
    showTooltip(data, x, y) {
      this.tooltip.transition().duration(200)
      this.tooltip
        .style('opacity', 1)
        .html(
          `Name: ${data.name}<br/>Diameter: ${data.diameter} km<br/>Magnitude: ${data.magnitude} h<br/>Distance: ${data.distance} au<br/>Velocity: ${data.velocity} km/s`
        )
        .style('left', x + 'px')
        .style('top', y + 'px')
    },
    hideTooltip() {
      this.tooltip.transition().duration(200).style('opacity', 0)
    },
  },
}
</script>