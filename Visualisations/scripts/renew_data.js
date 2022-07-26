function getRenewData(coal_svg){
    d3.json('./final_data/aust.json')
    .then(json => onGeoJsonLoadedRenew(json))
    .catch(err => console.log('ERROR: ', err));
    
    const onGeoJsonLoadedRenew = json => {
    console.log("everything is called");
    // Bind data and create one path per GeoJSON feature
    const states = coal_svg.selectAll('g.state')
    .data(json.features)
    .enter()
    .append('g')
    .classed('state', true);
    
    
    states.append('path')
    .attr("d", path)
    .attr("stroke", 'white');
    
    states.append("text")
    .attr("fill", "black")
    .attr("font-size", "small")
    .attr("transform", d => {
    return "translate(" + path.centroid(d) + ")";
    })
    .attr("text-anchor", "middle")
    .attr("dy", 15)
    .text(d => d.properties.STATE_NAME);
    
    
    d3.json('./final_data/energy_per_state.json')
    .then(dataJson => onDataJsonLoadedRenew(dataJson))
    .catch(err => console.log('ERR: ', err));
    }
    
    const tooltipPathRenew = (width, height, offset, radius) => {
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
    
    
    const onDataJsonLoadedRenew = json => {
    
    // Loading colour scheme.
    const valueRange = json.reduce((r, s) => r ? [Math.min(r[0], s.Renewables), Math.max(r[1], s.Renewables)] : [s.Renewables, s.Renewables], null);
    
    console.log("just checking");
    console.log(valueRange);
    const second_colour = d3.scaleLinear()
    .domain(valueRange)
    .range(["#ACFF90", "#259500"]);
    
    const new_states = coal_svg.selectAll('g.state');
    
    new_states.select('path')
    .style('fill', d => {
    const stateData = json.find(s => s.States === d.properties.STATE_NAME);
    return stateData ? second_colour(stateData.Renewables) : '#ccc';
    })
    
    const rows = Object.keys(json[0]).filter(n => n !== 'States');
    
    const second_tooltip = coal_svg.append('g')
    .classed('tooltip', true)
    .style('visibility', 'hidden');
    
    // second_tooltip.append('path')
    // .attr('d', tooltipPathRenew(160, 120, 5, 5))
    // rows.forEach((row, index) => {
    // second_tooltip.append('text')
    // .text(`${row} :`)
    // .attr('x', -70)
    // .attr('y', -100 + index * 18);
    // second_tooltip.append('text')
    // .classed(row.replace(' ', '_'), true)
    // .attr('x', 30)
    // .attr('y', -100 + index * 18);
    // });
    
    second_tooltip.append('path')
    .attr('d', tooltipPathRenew(160, 40, 5, 5))
    var row = "Renewables";
    second_tooltip.append('text')
    .text(`Renewables :`)
    .attr('x', -70)
    .attr('y', -20);
    second_tooltip.append('text')
    .classed(row.replace(' ', '_'), true)
    .attr('x', 30)
    .attr('y', -20);

    second_tooltip.append('text')
    .classed(row.replace(' ', '_'), true)
    .attr('x', 30)
    .attr('y', -20);


    const states = coal_svg.selectAll('g.state');
    states
    .on('mousemove', d => {
    const stateData = json.find(s => s.States == d3.select(d.path[1]).text());
    var row = "Renewables";
    second_tooltip.select(`.${row.replace(' ', '_')}`).text(stateData[row]);
    d3.selectAll("g.state")
    .style("opacity", .3)
    
    d3.select(d.path[1]).style("opacity", 1);
    second_tooltip.attr('transform', `translate(${path.centroid(d.path[0].__data__)})`);
    second_tooltip.style('visibility', 'visible');
   
    })
    .on('mouseout', () => {
        second_tooltip.style('visibility', 'hidden');
        d3.selectAll("g.state")
      .style("opacity", 1.0);
    });
    
    
    // Note: To create this choropleth, you need to use another JavaScript file as a website here:
    // https://cdnjs.cloudflare.com/ajax/libs/d3-legend/2.13.0/d3-legend.js
    coal_svg.append("g")
    .attr("class", "legendLinear")
    .attr("transform", "translate(30,300)");
    
    const legendLinear = d3.legendColor()
    .shapeWidth(30)
    .cells([0, 25, 50, 75, 100, 125, 150, 175, 200])
    .orient('vertical')
    .scale(second_colour);
    
    coal_svg.select(".legendLinear")
    .call(legendLinear)
    .style('font-family', 'Helvetica');
    };
    
    
    
    }