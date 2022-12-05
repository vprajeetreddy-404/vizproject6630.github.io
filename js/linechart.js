// Constants for the chart, that would be useful.
// const CHART_WIDTH = 1000;
// const CHART_HEIGHT = 500;
// const MARGIN = { left: 50, bottom: 20, top: 20, right: 20 };
// const ANIMATION_DURATION = 300;

//Set up




class LineChart{

    constructor(petrolPricesViz) {
      // Set some class level variables
      this.petrolPricesViz = petrolPricesViz;
  
      this.countries = [];
      this.petrolPricesViz.filteredTimeDate.forEach(row => {
        this.countries.push(row['Country'])
      });
      // console.log(countries)
     


      this.update();


      
  }

update(){

  this.data = petrolPricesViz.petrolTimeData;





      this.data = petrolPricesViz.petrolTimeData.filter(row => this.countries.includes(row['Country Name']) )
      
      console.log(this.petrolPricesViz.filteredTimeDate)

  d3.select("#Linechart-svg")
            .remove()

  d3.select('#Linechart-div')
.append('svg')
.attr('id', 'Linechart-svg')
.append('g')
.attr('id', 'Linechart-x-axis');
d3.select('#Linechart-svg')
.append('g')
.attr('id', 'Linechart-y-axis');
d3.select('#Linechart-svg')
.append('g')
.attr('id', 'LineChart')
.attr('class', 'line-chart')
.append('path');

    const yScale= d3.scaleLinear()
    .domain([0, Math.max(...this.data.map((row) => row['pump price']*3.78))])
    .range([CHART_HEIGHT - MARGIN.bottom - MARGIN.top, 0])
    .nice();
    //.domain([0, d3.max(this.data.map(d => parseInt(d['pump price'])))])



    // Use d3 group to get the line data in groups
    const groupedCountries = d3.group(this.data, (d) => d['Country Name']);
    const countryNames = groupedCountries.keys();

// console.log(groupedCountries)
// console.log(countryNames)

    //Get countries for color scale
  // let countries = [];
  // petrolPricesViz.petrolData.forEach(row => {
  //   countries.push(row['Country'])
  // });

//Color sclae:
const colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain([...countryNames]);




    const xScale = d3.scaleTime()
    .domain(d3.extent(this.data.map((row) => new Date(row.year))))
    .range([MARGIN.left, CHART_WIDTH])

    const xaxis = d3.select('#Linechart-x-axis')
    .attr('transform', `translate(0,${CHART_HEIGHT - MARGIN.bottom})`)
    .call(d3.axisBottom(xScale))
    // .selectAll('text')
    // .remove()

    // d3.select('#Linechart-x-axis').selectAll('line')
    // .remove()

    // Append x axis label
    d3.select('#Linechart-svg')
      .append('text')
      .text('Year')
      .style("font", "12px times")
      .attr('x', 510)
      .attr('y', CHART_HEIGHT);

          // Append Y axis label
    d3.select('#Linechart-svg')
    .append('text')
    .text('Pump Price USD per Gallon')
    .style("font", "12px times")
    .attr('x', 0)
    .attr('y', 11);


    d3.select('#Linechart-y-axis')
    .call(d3.axisLeft(yScale))
    .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

    var tooltip = d3.select("#Linechart-div")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("top", "0")
    .style("left", "0")

    

//Append lines

let svg =d3.select('#Linechart-svg')
.append('g')
.attr('id', 'lines')
.selectAll('.line')
      .data(groupedCountries)
      .join('path')
      .attr('fill', 'none')
      .attr('stroke', ([country, values]) => colorScale(values[0]['Country Name']))
      .attr('stroke-width', 1)
      .attr('d', ([country, values]) => {
        return d3.line()
          .x((d) => xScale(new Date(d.year)) )
          .y((d) => yScale(d['pump price']*3.78))
          (values);
      });

      // d3.select('#Linechart-svg')
      // .append('g')
      // .attr('id', 'overlay')
      // .append('line')


          // Add the points
    d3.select('#Linechart-svg')
    .append("g")
    .selectAll("dot")
    .data(this.data)
    .enter()
    .append("circle")
      .attr("cx", (d) => xScale(new Date(d.year)) )
      .attr("cy", (d) => yScale(d['pump price']*3.78))
      .attr("r", 5)
      .attr("fill", (d) => colorScale(d['Country Name']))
      .attr("stroke-width", 3)



  // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
  // Its opacity is set to 0: we don't see it by default.


      // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  var mousemove = function(d, values) {
    tooltip
      .html(values[0])
      .style("left", d.offsetX+ "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", d.offsetY-30+ "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  // var mouseleave = function(d) {
  //   tooltip
  //     .transition()
  //     .duration(200)
  //     .style("opacity", 0)
  // }

  svg.on("mouseover", mouseover )
  svg.on("mousemove", mousemove )
  //svg.on("mouseleave", mouseleave )

          // Add an interaction for the x position over the lines
    // svg.on('mousemove', (event) => {
    //   // const svgEdge = svg.node().getBoundingClientRect().x;
    //   // const distanceFromSVGEdge = event.clientX - svgEdge;

    //   if (event.offsetX > 10 && event.offsetX < CHART_WIDTH ) {
    //     // Set the line position
    //     // d3
    //     // .select('#overlay')
    //     // .select('line')
    //     // .attr('stroke', 'black')
    //     // .attr('x1', event.offsetX)
    //     // .attr('x2', event.offsetX)
    //     // .attr('y1', 0)
    //     // .attr('y2', CHART_HEIGHT );

    //     // Find the relevant data (by date and location)
    //     const dateHovered = xScale.invert(event.offsetX);
    //     var options = { year: 'numeric'};
    //     //console.log(dateHovered.toLocaleDateString('en-CA',options))

    //     const filteredData = petrolPricesViz.petrolTimeData
    //       .filter((row) => (
    //         row.year === dateHovered.toLocaleDateString('en-CA',options)
    //         && (
    //           (petrolPricesViz.selectedLocations.length > 0 &&
    //             petrolPricesViz.selectedLocations.includes(row['Country ISO Code']))
    //           ||
    //           (petrolPricesViz.selectedLocations.length === 0 )
    //         )
    //       ))
    //       .sort((rowA, rowB) => rowB['pump price'] - rowA['pump price']);

    //     // // Remove any existing text
    //     // this.svg
    //     //     .select('#overlay')
    //     //     .selectAll('text')
    //     //     .remove();

    //     // Add text to the SVG
    //     // d3.select('#overlay')
    //     // .selectAll('text')
    //     //   .data(filteredData)
    //     //   .join('text')
    //     //   .text((d) => `${d['Country Name']}, ${d3.format(".2s")(d['pump price'])}`)
    //     //   // .attr('x', distanceFromSVGEdge > 500 ? distanceFromSVGEdge - 200 : distanceFromSVGEdge + 5)
    //     //   .attr('x', event.offsetX > 500 ? event.offsetX - 170 : event.offsetX + 5)
    //     //   .attr('alignment-baseline', 'hanging')
    //     //   .attr('y', (d, i) => (i + 1) * 20)
    //     //   .attr('fill', (d) => colorScale(d['Country Name']));
    //   }
    // });





      // const lineGenerator = d3.line()
      // .x((data) => xScale(data.x))
      // .y((data) => yScale(data.y) + MARGIN.top);
    
      // d3.select('#Linechart-div')
      // .select('path')
      // .datum(data)
      // .transition(2200)
      // .attr('d', lineGenerator);
    
    
}






update2(data){

  // this.data =  petrolPricesViz.petrolTimeData;
  // this.petrolPricesViz.filteredTimeDate.forEach(row => {
  //   countries.push(row['Country'])
  // });

  d3.select("#Linechart-svg")
            .remove()

  d3.select('#Linechart-div')
.append('svg')
.attr('id', 'Linechart-svg')
.append('g')
.attr('id', 'Linechart-x-axis');
d3.select('#Linechart-svg')
.append('g')
.attr('id', 'Linechart-y-axis');
d3.select('#Linechart-svg')
.append('g')
.attr('id', 'LineChart')
.attr('class', 'line-chart')
.append('path');


  console.log(data)


  this.data = petrolPricesViz.petrolTimeData.filter(row => data.includes(row['Country ISO Code']) )
  console.log(this.data)

  if (data.length == 0){
    this.update()
    exit()
  }


  const yScale= d3.scaleLinear()
  .domain([0, Math.max(...this.data.map((row) => row['pump price']*3.78))])
  .range([CHART_HEIGHT - MARGIN.bottom - MARGIN.top, 0])
  .nice();
  //.domain([0, d3.max(this.data.map(d => parseInt(d['pump price'])))])



  // Use d3 group to get the line data in groups
  const groupedCountries = d3.group(this.data, (d) => d['Country Name']);
  const countryNames = groupedCountries.keys();

// console.log(groupedCountries)
// console.log(countryNames)

  //Get countries for color scale
// let countries = [];
// petrolPricesViz.petrolData.forEach(row => {
//   countries.push(row['Country'])
// });

//Color sclae:
const colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain([...countryNames]);




  const xScale = d3.scaleTime()
  .domain(d3.extent(this.data.map((row) => new Date(row.year))))
  .range([MARGIN.left, CHART_WIDTH])

  const xaxis = d3.select('#Linechart-x-axis')
  .attr('transform', `translate(0,${CHART_HEIGHT - MARGIN.bottom})`)
  .call(d3.axisBottom(xScale))
  // .selectAll('text')
  // .remove()

  // d3.select('#Linechart-x-axis').selectAll('line')
  // .remove()

  // Append x axis label
  d3.select('#Linechart-svg')
    .append('text')
    .style("font", "12px times")
    .text('Year')
    .attr('x', 510)
    .attr('y', CHART_HEIGHT);

        // Append Y axis label
        d3.select('#Linechart-svg')
        .append('text')
        .text('Pump Price USD per Gallon')
        .style("font", "12px times")
        .attr('x', 0)
        .attr('y', 11);

  d3.select('#Linechart-y-axis')
  .call(d3.axisLeft(yScale))
  .attr('transform', `translate(${MARGIN.left}, ${MARGIN.top})`);

  var tooltip = d3.select("#Linechart-div")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("padding", "10px")
  .style("top", "0")
  .style("left", "0")

  

//Append lines

let svg =d3.select('#Linechart-svg')
.append('g')
.attr('id', 'lines')
.selectAll('.line')
    .data(groupedCountries)
    .join('path')
    .attr('fill', 'none')
    .attr('stroke', ([country, values]) => colorScale(values[0]['Country Name']))
    .attr('stroke-width', 1)
    .attr('d', ([country, values]) => {
      return d3.line()
        .x((d) => xScale(new Date(d.year)) )
        .y((d) => yScale(d['pump price']*3.78))
        (values);
    });

    // d3.select('#Linechart-svg')
    // .append('g')
    // .attr('id', 'overlay')
    // .append('line')


        // Add the points
  d3.select('#Linechart-svg')
  .append("g")
  .selectAll("dot")
  .data(this.data)
  .enter()
  .append("circle")
    .attr("cx", (d) => xScale(new Date(d.year)) )
    .attr("cy", (d) => yScale(d['pump price']*3.78))
    .attr("r", 5)
    .attr("fill", (d) => colorScale(d['Country Name']))
    .attr("stroke-width", 3)



// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
// Its opacity is set to 0: we don't see it by default.


    // A function that change this tooltip when the user hover a point.
// Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
var mouseover = function(d) {
  tooltip
    .style("opacity", 1)
}

var mousemove = function(d, values) {
  tooltip
    .html(values[0])
    .style("left", d.offsetX+ "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
    .style("top", d.offsetY-30+ "px")
}

// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
// var mouseleave = function(d) {
//   tooltip
//     .transition()
//     .duration(200)
//     .style("opacity", 0)
// }

svg.on("mouseover", mouseover )
svg.on("mousemove", mousemove )



}







}





