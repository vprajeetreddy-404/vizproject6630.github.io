
//let dataSet = null;

setup();
// Constants for the charts, that would be useful.
const CHART_WIDTH = 1000;
const CHART_HEIGHT = 500;
const MARGIN = { left: 50, bottom: 20, top: 20, right: 20 };
const ANIMATION_DURATION = 4;



function setup(){
    d3.select('#Barchart-div')
    .append('svg')
    .attr('id', 'Barchart-svg')
    .append('g')
    .attr('id', 'Barchart-x-axis');
  d3.select('#Barchart-svg')
    .append('g')
    .attr('id', 'Barchart-y-axis');
  d3.select('#Barchart-svg')
    .append('g')
    .attr('id', 'BarChart')
    .attr('class', 'bar-chart')
    ;

    d3.select('#BarChart')
    .append("text")
    .attr("id", "ylabel")

    
    d3.select('#BarChart')
    .append("text")
    .attr("id", "xlabel")

}

class BarChart {

  constructor(petrolPricesViz) {

    // Set some class level variables
    this.petrolPricesViz = petrolPricesViz;

    this.data = petrolPricesViz.petrolData;



    var metric = document.getElementById("metric");
    var metricValue = metric.value;

    //this.update(metricValue);

    // document.getElementById('metric').addEventListener('change', function() {
    //   console.log('You selected: ', this.value);
    //   metricValue = this.value
    // });
    
    this.update(metricValue);

    
}

//Render bar-chart
  update(metric){

    //var metric = document.getElementById("metric");
    //var metricValue = metric.value;

    //metric.on('change', d=>)

console.log(metric);

    let sortedByPrice = this.data
    sortedByPrice = sortedByPrice.sort(function(a,b) {
      return parseInt(b[metric])-parseInt(a[metric])
  });

  let filteredData = sortedByPrice.slice(0, 10);
  console.log(filteredData)

  this.petrolPricesViz.filteredTimeDate = filteredData;


      const heightScale = d3.scaleLinear()
        .domain([0, d3.max(filteredData.map(d => parseInt(d[metric])))])
        .range([CHART_HEIGHT - MARGIN.bottom - MARGIN.top, 0])
        .nice();
    
      const barchartBandScale = d3.scaleBand()
        .domain(filteredData.map(d => d.Country))
        .range([MARGIN.left, CHART_WIDTH])
        .padding(0.2)
        
    
      const xaxis = d3.select('#Barchart-x-axis')
        .attr('transform', `translate(0,${CHART_HEIGHT - MARGIN.bottom})`)
        .call(d3.axisBottom(barchartBandScale))
        //.selectAll('text')
        //.remove()

        //d3.select('#Barchart-x-axis').selectAll('line')
        //.remove()

      //   xaxis.selectAll('text')
      //   .remove()



      d3.select('#Barchart-y-axis')
        .call(d3.axisLeft(heightScale))
        .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

        //Define a color scale 
        //const colorScale = d3.scaleSequential(d3.interpolateRgb("red", "blue")(0.5))

        // const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(filteredData.map(function(value,index) { return value["Country"]; }));

        // // Set input domain for color scale based on the min and max
        // colorScale.domain([0,
        //     d3.max(filteredData, d => parseInt(d[metric]))
        // ])

      // let colorScale = d3.scaleSequentialLog(d3.interpolateRdYlGn).domain([d3.max(values), d3.min(values)]);
 
        d3.select('#ylabel')
        .attr("x", "0")
        .attr("y", 12)
        .style("font", "12px times")
        .text(metric);

        d3.select('#xlabel')
        .attr("x", CHART_WIDTH/2)
        .attr("y", CHART_HEIGHT)
        .text("");


        //Render Bar chart:

        d3.select('#BarChart')
        .selectAll('rect')
        .data(filteredData, d => d.Country)
        .join(
          enter => enter
            .append('rect')
            .attr('width', barchartBandScale.bandwidth())
            .attr('x', d => barchartBandScale(d.Country))
            .attr('y', d => heightScale(parseInt(d[metric])) + MARGIN.top)
            .attr('height', d => heightScale(0) - heightScale(parseInt(d[metric])))
            .attr('opacity', 0)
            // .attr('fill',d => colorScale((d.Country)))
            .attr('fill','#1cb2f5')
            .transition()
            .duration(ANIMATION_DURATION)
            .delay(ANIMATION_DURATION)
            .attr('height', d => heightScale(0) - heightScale(parseInt(d[metric])))
            .attr('opacity', 1)
            ,
    
          update => update
            .transition()
            .duration(ANIMATION_DURATION)
            .attr('x', d => barchartBandScale(d.Country))
            .attr('y', d => heightScale(parseInt(d[metric])) + MARGIN.top)
            .attr('width', barchartBandScale.bandwidth())
            .attr('height', d => heightScale(0) - heightScale(parseInt(d[metric]))),
    
          exit => exit
            .transition()
            .duration(10)
            .attr('width', 0)
            .attr('height', 0)
            .remove()
            
        )
    

      }





    drawBars(selected){

      var metric = document.getElementById("metric");
      metric = metric.value;
    
      // for(let x of this.data)
      //   if (selected.includes(x.id)) {
      //     return x
      //   }

        let filteredData = this.data.filter(function (d) {
          if (selected.includes(d.iso_code)) {
            return d;
          }
          });
        
    
      console.log(metric);
    
      //   let sortedByPrice = this.data
      //   sortedByPrice = sortedByPrice.sort(function(a,b) {
      //     return parseInt(b[metric])-parseInt(a[metric])
      // });
    
      // let filteredData = sortedByPrice.slice(0, 10);


      
    
    
    
          const heightScale = d3.scaleLinear()
            .domain([0, d3.max(filteredData.map(d => parseInt(d[metric])))])
            .range([CHART_HEIGHT - MARGIN.bottom - MARGIN.top, 0])
            .nice();
        
          const barchartBandScale = d3.scaleBand()
            .domain(filteredData.map(d => d.Country))
            .range([MARGIN.left, CHART_WIDTH])
            .padding(0.2)
            
        
          const xaxis = d3.select('#Barchart-x-axis')
            .attr('transform', `translate(0,${CHART_HEIGHT - MARGIN.bottom})`)
            .call(d3.axisBottom(barchartBandScale))
            //.selectAll('text')
            //.remove()
    
            //d3.select('#Barchart-x-axis').selectAll('line')
            //.remove()
    
          //   xaxis.selectAll('text')
          //   .remove()
    
    
    
          d3.select('#Barchart-y-axis')
            .call(d3.axisLeft(heightScale))
            .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);
    
            //Define a color scale 
            //const colorScale = d3.scaleSequential(d3.interpolateRgb("red", "blue")(0.5))
            // const colorScale = d3.scaleOrdinal(d3.schemeCategory10).domain(filteredData.map(function(value,index) { return value["Country"]; }));
    
            // // Set input domain for color scale based on the min and max
            // colorScale.domain([0,
            //     d3.max(filteredData, d => parseInt(d[metric]))
            // ])
    
            d3.select('#ylabel')
            .attr("x", "0")
            .attr("y", 15)
            .text(metric);
    
            d3.select('#xlabel')
            .attr("x", CHART_WIDTH/2)
            .attr("y", CHART_HEIGHT)
            .text("");
    
    
            //Render Bar chart:
    
            d3.select('#BarChart')
            .selectAll('rect')
            .data(filteredData, d => d.Country)
            .join(
              enter => enter
                .append('rect')
                .attr('width', barchartBandScale.bandwidth())
                .attr('x', d => barchartBandScale(d.Country))
                .attr('y', d => heightScale(parseInt(d[metric])) + MARGIN.top)
                .attr('height', d => heightScale(0) - heightScale(parseInt(d[metric])))
                .attr('opacity', 0)
                // .attr('fill',d => colorScale((d.Country)))
                .attr('fill','#1cb2f5')
                .transition()
                .duration(ANIMATION_DURATION)
                .delay(ANIMATION_DURATION)
                .attr('height', d => heightScale(0) - heightScale(parseInt(d[metric])))
                .attr('opacity', 1)
                ,
        
              update => update
                .transition()
                .duration(ANIMATION_DURATION)
                .attr('x', d => barchartBandScale(d.Country))
                .attr('y', d => heightScale(parseInt(d[metric])) + MARGIN.top)
                .attr('width', barchartBandScale.bandwidth())
                .attr('height', d => heightScale(0) - heightScale(parseInt(d[metric]))),
        
              exit => exit
                .transition()
                .duration(ANIMATION_DURATION)
                .attr('width', 0)
                .attr('height', 0)
                .remove()
                
            )
        
    
          }
          
  }
