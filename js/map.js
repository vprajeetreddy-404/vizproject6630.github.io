class MapViz {


    constructor(petrolPricesViz) {
        this.petrolPricesViz = petrolPricesViz;

        // Set up the map projection
        this.projection = d3.geoWinkel3()
            .scale(150) 
            .translate([400, 250]); 

 

        let world_data = this.petrolPricesViz.mapData;
        console.log("abc" + world_data);

        this.nation = topojson.feature(world_data, world_data.objects.countries);
        console.log(this.nation.features);

        this.countries = [];
        for (let x of this.nation.features) {
            this.countries.push(x.id);
        }

        let path = d3.geoPath().projection(this.projection);
        //console.log(path);
        let graticule = d3.geoGraticule();

        this.map_svg = d3.select('#map');

        this.map_svg
            .select('#graticules')
            .append('path')
            .datum(graticule)
            .attr('d', path)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .style('opacity', 0.2);

        this.map_svg
            .select('#graticules')
            .append('path')
            .datum(graticule.outline())
            .attr('d', path)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .style('opacity', 0.6);


        var metric = document.getElementById("metric");
        var metricValue = metric.value;
        this.updateMap(metricValue);

    }



    
    updateMap(metric){

        console.log("change")

        let petrol_data = this.petrolPricesViz.petrolData;
        console.log(petrol_data);
        let pData = 10


        const dict = {};
        for (let y of this.countries) {
            let temp = true
            for (let x of petrol_data) {
                if (y == x.iso_code) {
                    if (x[metric] != "") {
                        dict[y] = parseFloat(x[metric]);
                        temp = false
                    }
                }
                if (temp) {
                    dict[y] = pData
                }
            }
        }

        var values = Object.values(dict);

        console.log(dict);


        console.log("Aa" + d3.max(values));
        let path = d3.geoPath().projection(this.projection);

        let colorScale 
    

        console.log(metric)
        colorScale = d3.scaleSequentialLog(d3.interpolateGnBu).domain([d3.min(values), (d3.max(values))]);

        // if(metric == "Price Per Gallon (USD)"){
        //     colorScale = d3.scaleSequentialLog(d3.interpolateGnBu).domain([d3.min(values), (d3.max(values)+20)]);
        // }

        if( metric == "World Share"){
            colorScale = d3.scaleSequentialLog(d3.interpolateGnBu)
            console.log(typeof((d3.max(values))))
            console.log(values)
        }


        // if( metric == "Yearly Gallons Per Capita"){
        //     colorScale = d3.scaleSequentialLog(d3.interpolateYlGn).domain([d3.min(values), (d3.max(values))]);
        // }
        // if(metric == "GDP Per Capita ( USD )"){
        //     colorScale = d3.scaleSequentialLog(d3.interpolateCubehelixDefault).domain([d3.min(values), (d3.max(values))]);
        // }   

        



        

        // var step = d3.scaleLinear()
        //     .domain([1, 8])
        //     .range([d3.max(values), d3.min(values)]);

        // var color3 = d3.scaleLinear()
        //     .domain([1, step(2), step(3), step(4), step(5), step(6), step(7), 20])
        //     .range(['#d73027', '#f46d43', '#fdae61', '#fee08b', '#d9ef8b', '#a6d96a', '#66bd63', '#1a9850'])


        d3.select('#map')
            .select('#countries')
            .append('path')
            .attr('d', path(this.nation))
            .attr('fill', 'none')
            .attr('stroke', 'lightgrey')


        const stateD3 = this.map_svg
            .select('#countries')
            .selectAll('path')
            .data(this.nation.features)
            .join(
                enter => enter
                .append('path')
                .attr('d', path)
                .attr('fill', (d) => colorScale(parseFloat(dict[d.id])))
                .attr('stroke', 'lightgrey')
                .on('click', (d) => {
                    console.log('clicked', d)}),
          
                update => update
                .attr('fill', (d) => colorScale(parseFloat(dict[d.id])))
                .attr('stroke', 'lightgrey')
                .on('click', (d) => {
                    console.log('clicked', d)})
            
            )


        let legend = d3.select('#legend')
            .append('rect')
            .attr('width', 150)
            .attr('y', 0)
            .attr('height', 25)
            .attr("transform", "translate(650 475)")
            .attr('fill', 'url(#color-gradient)');

        let legendColor = d3.range(10).map(d=> ({color:d3.interpolateGnBu(d/10), value:d}))
        let extent = d3.extent(legendColor, d => d.value); 
        
        let linearGradient = d3.select('#color-gradient')
        .selectAll("stop")
        .data(legendColor)
        .enter().append("stop")
        .attr("offset", d => ((d.value - extent[0]) / (extent[1] - extent[0]) * 100) + "%")
        .attr("stop-color", d => d.color);

        d3.select("#start")
            .append("text")
            .attr("transform", "translate(655 470)")
            .text("0");

        let gMax = d3.max(values)

        let z 

        if(metric == "Price Per Gallon (USD)"){
            z=770
        }

        if( metric == "World Share"){
            z=780
        }

        if( metric == "Yearly Gallons Per Capita"){
            z=750
        }
        if(metric == "GDP Per Capita ( USD )"){
            z=773
        }   

        d3.select("#end")
            .remove()

        d3.select("#legend").append("g")
        .attr("id", "end") 
            .append("text")
            .attr("transform", "translate("+z+" 470)")
            .text(gMax)
        
        // d3.select("#end")
        // .data(gMax)
        // .join(
        //     enter => enter
        //     .append("text")
        //     .attr("transform", "translate(770 470)")
        //     .text(gMax),
      
        //     update => update
        //     .append("text")
        //     .attr("transform", "translate(770 470)")
        //     .text(gMax)
        //     ,

        //     exit => exit
        //     .remove()
        
        // )

        // var text = d3.select("#end")

        // text.exit().remove();
      
        // text.enter()
        // .append("text")
        // .attr("transform", "translate(770 470)")
        // .text(gMax),
          
        // text.text(gMax)
        


        stateD3.on("click", (d) => this.updateSelectedCountries(d));


        ////---


    }

        updateSelectedCountries (data) {


          let checkifexists = this.petrolPricesViz.selectedLocations.indexOf(
            data.currentTarget.__data__.id
          );
          if(checkifexists == -1){
            this.petrolPricesViz.selectedLocations.push(data.currentTarget.__data__.id);
            data.currentTarget.setAttribute("class", "country selected");
          }
          else{
            this.petrolPricesViz.selectedLocations.splice(checkifexists, 1);
            data.currentTarget.setAttribute("class", "country");

          }

          let selected = this.petrolPricesViz.selectedLocations;
          console.log(this.petrolPricesViz.selectedLocations);

          if (selected.length > 0) {
            this.petrolPricesViz.barChart.drawBars(selected);
            this.petrolPricesViz.table.updateFilter(selected);
            this.petrolPricesViz.lineChart.update2(selected);

          } 
          else {
            this.petrolPricesViz.barChart.update("Price Per Gallon (USD)");
            this.petrolPricesViz.lineChart.update();
            this.petrolPricesViz.table.resetTable();


            

          }



        }

}
