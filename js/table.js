//Borrowed from HW6-Solution 

const CELL_HEIGHT = 20;
const PADDING = 15;

const SIZE_DICT = {
    price: 100,
    YGPC: 245,
    country: 100,
    consumption: 245
  };

class CountryTable{
    constructor(div, data) {
        this.div = div;
    
        this.data = data;

        this.header = [
            { name: 'Country', key: 'country' },
            { name: 'Price (USD)', key: 'price' },
            { name: 'Daily Oil Consumption (Barrels)', key: 'consumption' },
            { name: 'Yearly Gallons Per Capita', key: 'YGPC' },

      
          ];
          // this.svg = this.div.append("svg");
          this.table = this.div.append('table');
      
          this.tableBody = this.table.append('tbody');



          this.currentSortKeyword = '';

          this.sortAscend = false;

          this.makeHeader();

          this.filter = [];
          this.updateTable();

    }



    makeHeader (){
        const that = this;
        const th = this.table.append('thead')
          .append('tr')
          .selectAll('th')
          .data(this.header)
          .join('th')
          .append('svg')
          .attr('width', (d) => SIZE_DICT[d.key])
          .attr('height', 40);

          th.selectAll("rect")
          .data((d) => [d])
          .join("rect")
          .attr('class', 'header')
          .attr("width", (d) => SIZE_DICT[d.key])
          .attr("height", CELL_HEIGHT * 2)
          .attr('x', 0)
          .attr('y', 0);

          th.selectAll("text")
          .data((d) => [d])
          .join("text")
          .attr('class', 'header-text')
          .text((d) => d.name)
          .style("text-anchor", "middle")
          .style("font-weight", "700")
          .attr("transform", (d) => {
            return `translate(${(SIZE_DICT[d.key] ) / 2}, 20)`;
          });

          //TODO:
          th.on("click", (e, d) => {
            this.sorter(d.key);
          });


    }


  updateTable (){
    //   ///FORMATTING DATA///
    const formattedData = this.data
      .filter(d => this.filter.length ? this.filter.includes(d) : true)
      .map((d) => {
        return {
            country: d['Country'],
            price: d['Price Per Gallon (USD)'],
            consumption: d['Daily Oil Consumption (Barrels)'],
            YGPC: d['Yearly Gallons Per Capita'],
        };
      });
      console.log(formattedData)

      const tableRows = this.tableBody
      .selectAll('tr')
      .data(formattedData)
      .join('tr')
      .attr('class', 'background');

    const allCells = tableRows.selectAll('td')
      .data(d => d3Entries(d))
      .join('td')
      .attr('class', 'table-cell');

    allCells.text(d => d.value)
    .style('width', d => `${SIZE_DICT[d.key]}px`)
    .style('height', '25px');


      //console.log(formattedData)
    //   { name: 'Country', key: 'country' },
    //   { name: 'Price', key: 'price' },
    //   { name: 'World Share', key: 'share' },
    //   { name: 'Yearly Gallons Per Capita', key: 'YGPC' },

  }

  updateFilter (filter){

    if (filter && filter.length) {

        let filteredData = this.data.filter(function (d) {
            if (filter.includes(d.iso_code)) {
              return d;
            }
            });


        this.filter = filteredData;
        this.updateTable();


      } else {
        this.filter = [];
      }
  }

  resetTable(){
    this.filter = [];
    this.updateTable();

  }

  sorter (sortKeywordInput){

    if (this.currentSortKeyword && this.currentSortKeyword.includes(sortKeywordInput)) {
        //if clicking the same header, reverse the order
        this.sortAscend = !this.sortAscend;
      } else {
        this.sortAscend = false;
      }


      this.data.sort((entryA, entryB) => {
        switch (sortKeywordInput) {
          case 'country':
            this.currentSortKeyword = sortKeywordInput;
            return this.sortAscend ? entryA['Country'].localeCompare(entryB['Country']) : entryB['Country'].localeCompare(entryA['Country']);
          case 'price':
            this.currentSortKeyword = sortKeywordInput;
            return (this.sortAscend ? 1 : -1) * ((+entryA['Price Per Gallon (USD)']) - (+entryB['Price Per Gallon (USD)']));
          case 'consumption':
                this.currentSortKeyword = sortKeywordInput;
                return (this.sortAscend ? 1 : -1) * ((+parseFloat(entryA['Daily Oil Consumption (Barrels)'].replace(/,/g, ''))) - (+parseFloat(entryB['Daily Oil Consumption (Barrels)'].replace(/,/g, ''))));
          case 'YGPC':
                    this.currentSortKeyword = sortKeywordInput;
                    return (this.sortAscend ? 1 : -1) * ((+entryA['Yearly Gallons Per Capita']) - (+entryB['Yearly Gallons Per Capita']));                
  
        }
      });

    // sorting done. update the table. 
    this.updateTable();

  }



}

//Borrowed from HW6-Solution 
//make required data set for each row.
function d3Entries (obj) {
    return Object.entries(obj).map((entry) => ({
      key: entry[0],
      value: entry[1],
    }));
  }