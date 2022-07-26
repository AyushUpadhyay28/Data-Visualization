var second_w = 800;
var second_h = 600;

const projection = d3.geoMercator()
    .center([132, -28])
    .translate([second_w / 2, second_h / 2])
    .scale(700);


// Define path generator
const path = d3.geoPath().projection(projection);

// Create SVG
var second_svg = d3.select("#second_viz").append("svg").attr("width", second_w).attr("height", second_h);
d3.json('./final_data/aust.json')
    .then(json => onGeoJsonLoaded(json))
    .catch(err => console.log('ERROR: ', err));


const onGeoJsonLoaded = json => {

    // Bind data and create one path per GeoJSON feature
    const states = second_svg.selectAll('g.state')
        .data(json.features)
        .enter()
        .append('g')
        .classed('state', true);


    states.append('path')
        .attr("d", path)
        .attr("stroke", 'white');

    states.append("text")
        .attr("fill", "red")
        .attr("font-size", "small")
        .attr("transform", d => {
            return "translate(" + path.centroid(d) + ")";
        })
        .attr("text-anchor", "middle")
        .attr("dy", 15)
        .text(d => d.properties.STATE_NAME);


    d3.json('./final_data/energy_per_state.json')
        .then(dataJson => onDataJsonLoaded(dataJson))
        .catch(err => console.log('ERR: ', err));
}

const tooltipPath = (width, height, offset, radius) => {
    const left = -width / 2;
    const right = width / 2;
    const top = -offset - height;
    const bottom = -offset;

    // Creating a polygon for containing data.
    return `M 0,0 
            L ${-offset},${bottom} 
            H ${left + radius}
            Q ${left},${bottom} ${left},${bottom - radius}  
            V ${top + radius}   
            Q ${left},${top} ${left + radius},${top}
            H ${right - radius}
            Q ${right},${top} ${right},${top + radius}
            V ${bottom - radius}
            Q ${right},${bottom} ${right - radius},${bottom}
            H ${offset} 
            L 0,0 z`;
}


const onDataJsonLoaded = json => {

    // Loading colour scheme.
    const valueRange = json.reduce((r, s) => r ? [Math.min(r[0], s.Total), Math.max(r[1], s.Total)] : [s.Total, s.Total], null);
    const second_colour = d3.scaleLinear()
        .domain(valueRange)
        .range(["#9AB0FF", "#001254"]);

    const new_states = second_svg.selectAll('g.state');


    new_states.select('path')
        .style('fill', d => {
            const stateData = json.find(s => s.States === d.properties.STATE_NAME);
            return stateData ? second_colour(stateData.Total) : '#ccc';
        })

    const rows = Object.keys(json[0]).filter(n => n !== 'States');
  

    const second_tooltip = second_svg.append('g')
        .classed('tooltip', true)
        .style('visibility', 'hidden');

    second_tooltip.append('path')
        .attr('d', tooltipPath(160, 120, 5, 5))
    rows.forEach((row, index) => {


        second_tooltip.append('text')
            .text(`${row} :`)
            .attr('x', -70)
            .attr('y', -100 + index * 18);
        second_tooltip.append('text')
            .classed(row.replace(' ', '_'), true)
            .attr('x', 30)
            .attr('y', -100 + index * 18);
    });


    const states = second_svg.selectAll('g.state');
    states.on('mousemove', d => {

            console.log("CCCCC");
            
            const stateData = json.find(s => s.States == d3.select(d.path[1]).text());
            rows.forEach(row => second_tooltip.select(`.${row.replace(' ', '_')}`).text(stateData[row]));

            d3.selectAll("g.state")
            .style("opacity", .1)
            
            d3.select(d.path[1]).style("opacity", 1);



            second_tooltip.attr('transform', `translate(${path.centroid(d.path[0].__data__)})`);
            second_tooltip.style('visibility', 'visible');
        })
        .on('mouseout', () =>{ 
            d3.selectAll("g.state")
      .style("opacity", 1.0);
            second_tooltip.style('visibility', 'hidden')});


    // Note: To create this choropleth, you need to use another JavaScript file as a website here:
    // https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.13.0/d3-legend.js
    second_svg.append("g")
        .attr("class", "legendLinear")
        .attr("transform", "translate(30,300)");

    const legendLinear = d3.legendColor()
        .shapeWidth(30)
        .cells([190, 380, 570, 760, 950, 1140, 1330, 1500])
        .orient('vertical')
        .scale(second_colour);

    second_svg.select(".legendLinear")
        .call(legendLinear)
        .style('font-family', 'Helvetica');
};


second_svg.append('text')
    .attr('x', -360)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('transform', 'rotate(270)')
    .style('font-family', 'Helvetica')
    .text('Energy by state and territory 2019-2020').style("fill", "#001254");




function updateChart(data) {

   console.log(second_svg); 
   switch(data){
        case "oil":
            //second_svg.selectAll("*").remove();
            d3.select("#second_viz").select("svg").remove();
            second_svg = d3.select("#second_viz").append("svg").attr("width", second_w).attr("height", second_h);
            getOilData(second_svg);

            second_svg.append('text')
            .attr('x', -360)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(270)')
            .style('font-family', 'Helvetica')
            .text('Oil consumption by state and territory 2019-2020').style("fill", "#505050");
            break;
        case "gas":
            //second_svg.selectAll("*").remove();
            d3.select("#second_viz").select("svg").remove();
            second_svg = d3.select("#second_viz").append("svg").attr("width", second_w).attr("height", second_h);
            getGasData(second_svg);

            second_svg.append('text')
            .attr('x', -360)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(270)')
            .style('font-family', 'Helvetica')
            .text('Gas consumption by state and territory 2019-2020').style("fill", "#A90000");
            break;
        case "coal":
            //second_svg.selectAll("*").remove();
            d3.select("#second_viz").select("svg").remove();
            second_svg = d3.select("#second_viz").append("svg").attr("width", second_w).attr("height", second_h);
            getCoalData(second_svg);
            
            second_svg.append('text')
            .attr('x', -360)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(270)')
            .style('font-family', 'Helvetica')
            .text('Coal consumption by state and territory 2019-2020').style("fill", "#6C4800");
            break;
        case "renewable":
            //second_svg.selectAll("*").remove();
            d3.select("#second_viz").select("svg").remove();
            second_svg = d3.select("#second_viz").append("svg").attr("width", second_w).attr("height", second_h);
            getRenewData(second_svg);

            second_svg.append('text')
            .attr('x', -300)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(270)')
            .style('font-family', 'Helvetica')
            .text('Renewable energy consumption by state and territory 2019-2020').style("fill", "#259500");;
            break;
        case "total":
            d3.select("#second_viz").select("svg").remove();
            second_svg = d3.select("#second_viz").append("svg").attr("width", second_w).attr("height", second_h);
            
            d3.json('./final_data/aust.json')
            .then(json => onGeoJsonLoaded(json))
            .catch(err => console.log('ERROR: ', err));
            second_svg.append('text')
            .attr('x', -360)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('transform', 'rotate(270)')
            .style('font-family', 'Helvetica')
            .text('Energy by state and territory 2019-2020').style("fill", "#001254");
            break;
        default:
            break;

   }

}


