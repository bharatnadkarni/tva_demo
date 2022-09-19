<template>
    <div :id="`magnitude_${day}_${this.index}`"></div>
</template>
<script>
import * as d3 from 'd3'
export default {
    props: ['day','index', 'value', 'max'],
    data(){
        return {
            width: 48,
            height: 48,
            squareSize: 34,
            svg: null
        }
    },
    watch: {
        day(){
            this.plotSquare(this.value, this.max)
        }
    },
    mounted(){
        this.svg = d3.select(`#magnitude_${this.day}_${this.index}`).append("svg").attr("width",this.width).attr("height",this.height).append("g").attr("transform", "translate(24, 0)");
        this.plotSquare(this.value, this.max)
    },
    methods: {
        plotSquare(value, max){
            this.svg.selectAll(".mag").remove()
            this.svg.append("rect")
                .attr("width", this.squareSize)
                .attr("height", this.squareSize)
                .attr("class", "mag")
                .attr('stroke', 'white')
                .attr('stroke-width', '0.5px')
                .attr("transform", "rotate(45)")
                .attr("fill", "transparent")
            
            //  size of filled square
            const filledSquareSize = this.squareSize * value / max
            const oldSquareHyp = Math.sqrt(Math.pow(this.squareSize, 2) + Math.pow(this.squareSize, 2));
            const newSquareHyp = Math.sqrt(Math.pow(filledSquareSize, 2) + Math.pow(filledSquareSize, 2));
            const translateDistance = (oldSquareHyp - newSquareHyp) / 2
            
            this.svg.append("rect")
                .attr("width", filledSquareSize)
                .attr("height", filledSquareSize)
                .attr("class", "mag")
                .attr("max", max)
                .attr("v", value)
                .attr("transform", `translate(0,${translateDistance}) rotate(45)`)
                .attr("fill", "white")

            this.svg.append('circle')
            .attr('cx', 0)
            .attr("class", "mag")
            .attr('cy', this.width/2)
            .attr('r', '1px')
            .attr('stroke', 'black')
            .attr('stroke-width', '0.5px')
        }
    }
}
</script>