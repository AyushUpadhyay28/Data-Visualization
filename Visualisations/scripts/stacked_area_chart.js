var dataset2;
//Set up stack method
var stack = d3.stack();
// import csv file and pass it to the barchart
// since we have three columns, we need to initilise the variables
d3.csv("./final_data/renewables.csv", function(item) {
    return {
        Period: item.Period,
        Hydro: parseFloat(item.Hydro.replace(",", "")),
        Wind: parseFloat(item.Wind.replace(",", "")),
        Solar: parseFloat(item.Solar.replace(",", "")),
        Bioenergy: parseFloat(item.Bioenergy.replace(",", "")),
    };
}).then(function(data2) {

    var dataset2 = data2;
    console.table(dataset2, ["Period", "Hydro", "Wind", "Solar", "Bioenergy"]);
    //Now that we know the column names in the data…
    var keys = dataset2.columns;
    console.log("keys");
    console.log(keys);
    keys.shift(); //Remove first column name ('Period')
    var stackType = stack.keys(keys); //Stack using what's left 
    //Data, stacked
    var series = stackType(dataset2);
    var w3 = 1000;
    var h3 = 600;
    var padding = 80;

    
    // xScale = d3.scaleTime().domain([
    //     d3.min(dataset2, function(d) {
    //         return d.Period;
    //     }),
    //     d3.max(dataset2, function(d) {
    //         return d.Period;
    //     })
    // ]).range([padding, w3 - padding]);

    xScale  = d3.scaleLinear().domain([1995, 2020]).range([padding, w - padding]);

    yScale = d3.scaleLinear().domain([0, d3.max(dataset2, function(d) {
            return (d.Hydro);
        }) +
        d3.max(dataset2, function(d) {
            return (d.Solar);
        }) +
        d3.max(dataset2, function(d) {
            return (d.Wind);
        }) +
        d3.max(dataset2, function(d) {
            return (d.Bioenergy);
        })
    ]).range([h3 - padding, padding]);

    // controlling of the ticks 
    var xAxis = d3.axisBottom().scale(xScale).ticks(5).tickFormat(d3.format("d"));; // add the x-axis

    var yAxis = d3.axisLeft().scale(yScale); // add the y-axis
    var svg3 = d3.select("#third_viz").append("svg").attr("width", w3).attr("height", h3);
    var colors = ["#50A3A4", "#fcaf38", "#674a40", "#f95335"];
    //var colors = ["rgb(233, 235, 248)", "rgb(148, 159, 235)", "rgb(97, 114, 232)", "rgb(47, 67, 212)", "rgb(4, 21, 140)"];
    //Define area generator
    area = d3.area()
        .x(function(d) {
            console.log("SSSS");
            console.log(d.data.Period);
            return xScale(d.data.Period);
        })
        .y0(function(d) {
            return yScale(d[0]);
        })
        .y1(function(d) {

            return yScale(d[1]);
        });

    //Create areas
    svg3.selectAll("path")
        .data(series)
        .enter()
        .append("path")
        .attr("class", function(d) {
            return "area " + d.key
        })
        .attr("d", area)
        .attr("fill", function(dataa, i) {
            return colors[i];
        })
        .append("title") //Make tooltip
        .text(function(item) {
            return item.key;
        });


    //////////
    // HIGHLIGHT GROUP //
    //////////

    // What to do when one group is hovered
    const highlightHydro = function(data) {
        // reduce opacity of all groups
        d3.selectAll(".area").style("opacity", .3);
        // expect the one that is hovered
        d3.select(".Hydro").style("opacity", 1);
    };

    const highlightWind = function(data) {
        // reduce opacity of all groups
        d3.selectAll(".area").style("opacity", .3);
        // expect the one that is hovered
        d3.select(".Wind").style("opacity", 1);
    };


    const highlightSolar = function(data) {
        // reduce opacity of all groups
        d3.selectAll(".area").style("opacity", .3);
        // expect the one that is hovered
        d3.select(".Solar").style("opacity", 1);
    };

    const highlightBioenergy = function(data) {
        // reduce opacity of all groups
        d3.selectAll(".area").style("opacity", .3);
        // expect the one that is hovered
        d3.select(".Bioenergy").style("opacity", 1);
    }


    const tooltipPathArea = (width, height, offset, radius) => {
        const left = -width / 2;
        const right = width / 2;
        const top = -offset - height;
        const bottom = -offset;
        console.log("offset")
        console.log(offset);
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

        
        const hydro_tooltip = svg3.append('g')
        .classed('tooltip', true)
        .attr("id", "tooltip_area") 
        .style('visibility', 'hidden');
        hydro_tooltip.append('path')
        .attr('d', tooltipPathArea(160, 60, 5, 5));
        
    // And when it is not hovered anymore
    const noHighlight = function(event, d) {
        d3.selectAll(".area").style("opacity", 1);
        hydro_tooltip.style('visibility', 'hidden');
    }




    svg3.selectAll("path").on('mousemove', function(d) {

        const year = Math.floor(xScale.invert(d3.pointer(d, svg3.node())[0]));
       
        hydro_tooltip.selectAll("text").remove();
        hydro_tooltip.append('text')
        .text(`Year :`)
        .attr('x', -70)
        .attr('y', -20);
        hydro_tooltip.append('text')
        .text(year)
        .attr('x', 30)
       .attr('y', -20);
        console.log(d.path[0].__data__.key);
        
        switch (d.path[0].__data__.key) {
            case "Hydro":
                
                // reduce opacity of all groups
                d3.selectAll(".area").style("opacity", .3);
                // expect the one that is hovered
                d3.select(".Hydro").style("opacity", 1);
                hydro_tooltip.append('text')
                .text(`Hydro :`)
                .attr('x', -70)
                .attr('y', -40);
                hydro_tooltip.append('text')
                .text(d3.select(d.path[0])._groups[0][0].__data__[year - 1995].data.Hydro)
                .attr('x', 30)
               .attr('y', -40);
                
                
                break;
            case "Wind":
                d3.selectAll(".area").style("opacity", .3);
                // expect the one that is hovered
                d3.select(".Wind").style("opacity", 1);
                hydro_tooltip.append('text')
                .text(`Wind :`)
                .attr('x', -70)
                .attr('y', -40);
                hydro_tooltip.append('text')
                .text(d3.select(d.path[0])._groups[0][0].__data__[year - 1995].data.Wind)
                .attr('x', 30)
               .attr('y', -40);
                break;
            case "Solar":
                // reduce opacity of all groups
                d3.selectAll(".area").style("opacity", .3);
                // expect the one that is hovered
                d3.select(".Solar").style("opacity", 1);
                hydro_tooltip.append('text')
                .text(`Solar :`)
                .attr('x', -70)
                .attr('y', -40);
                hydro_tooltip.append('text')
                .text(d3.select(d.path[0])._groups[0][0].__data__[year - 1995].data.Solar)
                .attr('x', 30)
               .attr('y', -40);
                break;
            case "Bioenergy":
                // reduce opacity of all groups
                d3.selectAll(".area").style("opacity", .3);
                // expect the one that is hovered
                d3.select(".Bioenergy").style("opacity", 1);
                hydro_tooltip.append('text')
                .text(`Bioenergy :`)
                .attr('x', -70)
                .attr('y', -40);
                hydro_tooltip.append('text')
                .text(d3.select(d.path[0])._groups[0][0].__data__[year - 1995].data.Bioenergy)
                .attr('x', 30)
               .attr('y', -40);
                break;
        }
        //console.log(path.centroid(d.offsetX,d.offsetY));
        //hydro_tooltip.attr('transform', `translate(${d.offsetX},${d.offsetY})`);
        hydro_tooltip.attr('transform', `translate(${d.offsetX}, ${d.offsetY -30})`);

        hydro_tooltip.style('visibility', 'visible');
    }).on("mouseleave", noHighlight);



    // move it to the zero position of the plot of x - axis
    svg3.append("g").attr("class", "axis").attr("transform", "translate(0, " + (h3 - padding) + ")").call(xAxis);
    // move it to the zero position of the plot of y - axis
    svg3.append("g").attr("class", "axis").attr("transform", "translate(" + padding + ",0)").call(yAxis);
    
    svg3.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y",20)
    .attr("x",-220)
    .text("Gigawatt hours").style("font-size", "18px").attr("alignment-baseline", "middle").style("fill", "black"); 

    svg3.append("text")
    .attr("text-anchor", "end")
    .attr("y",h3 -30)
    .attr("x",w3/3 + 80)
    .text("Year").style("font-size", "18px").attr("alignment-baseline", "middle").style("fill", "black"); 

    svg3.append("circle").attr("cx", 100).attr("cy", 40).attr("r", 6).style("fill", "#50A3A4").
    on("mousemove", highlightHydro)
        .on("mouseleave", noHighlight);
    svg3.append("text").attr("x", 110).attr("y", 40).text("Hydro").style("font-size", "15px").attr("alignment-baseline", "middle").style("fill", "#50A3A4").
    on("mousemove", highlightHydro)
        .on("mouseleave", noHighlight);

    svg3.append("circle").attr("cx", 170).attr("cy", 40).attr("r", 6).style("fill","#fcaf38").
    on("mousemove", highlightWind)
        .on("mouseleave", noHighlight);
    svg3.append("text").attr("x", 180).attr("y", 40).text("Wind").style("font-size", "15px").attr("alignment-baseline", "middle").style("fill", "#fcaf38")
        .on("mousemove", highlightWind)
        .on("mouseleave", noHighlight);

    svg3.append("circle").attr("cx", 240).attr("cy", 40).attr("r", 6).style("fill", "#674a40" ).
    on("mousemove", highlightBioenergy)
        .on("mouseleave", noHighlight);
    svg3.append("text").attr("x", 250).attr("y", 40).text("Bioenergy").style("font-size", "15px").attr("alignment-baseline", "middle").style("fill", "#674a40").
    on("mousemove", highlightBioenergy)
        .on("mouseleave", noHighlight);


    svg3.append("circle").attr("cx", 340).attr("cy", 40).attr("r", 6).style("fill", "#f95335").
    on("mousemove", highlightSolar)
        .on("mouseleave", noHighlight);
    svg3.append("text").attr("x", 350).attr("y", 40).text("Solar").style("font-size", "15px").attr("alignment-baseline", "middle").style("fill", "#f95335")
        .on("mousemove", highlightSolar)
        .on("mouseleave", noHighlight);

});