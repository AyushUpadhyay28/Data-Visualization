var dataset;
var oilLine, flaringLine, cementLine, coalLine, gasLine, otherLine;
var w = 820;
var h = 600;
var padding = 90;
var svg = d3.select("#first_viz").append("svg").attr("width", w).attr("height", h);
// import csv file and pass it to the barchart
// since we have three columns, we need to initilise the variables
d3.csv("./final_data/co2_emissions.csv", function(d) {
    return {
        year: d.Year,
        oil_co2_emissions: d.oil_co2_emissions,
        flaring_co2_emissions: d.flaring_co2_emissions,
        cement_co2_emissions: d.cement_co2_emissions,
        coal_co2_emissions: d.coal_co2_emissions,
        gas_co2_emissions: d.gas_co2_emissions,
        other_co2_emissions: d.other_co2_emissions
    };
}).then(function(data) {
    dataset = data;
    lineChart(dataset);

});

function lineChart(dataset) {
    var bisectDate = d3.bisector(function(d) {
            return d.year;
        }).left,
        // xScale = d3.scaleTime().domain([
        //     d3.min(dataset, function(d) {
        //         return d.year;
        //     }),
        //     d3.max(dataset, function(d) {
        //         return d.year;
        //     })
        // ]).range([padding, w - padding]);

        
    xScale = d3.scaleLinear().domain([1990, 2020]).range([padding, w - padding]);


    //yScale = d3.scaleLinear().domain([0, d3.max(dataset, function (d){return (d.coal_co2_emissions)/10000000; })]).range([h -padding, padding]);
    yScale = d3.scaleLinear().domain([0, d3.max([
        d3.max(dataset, function(d) {
            return (d.oil_co2_emissions) / 1000000;
        }),
        d3.max(dataset, function(d) {
            return (d.flaring_co2_emissions) / 1000000;
        }),
        d3.max(dataset, function(d) {
            return (d.coal_co2_emissions) / 1000000;
        }),
        d3.max(dataset, function(d) {
            return (d.cement_co2_emissions) / 1000000;
        }),
        d3.max(dataset, function(d) {
            return (d.gas_co2_emissions) / 1000000;
        }),
        d3.max(dataset, function(d) {
            return (d.other_co2_emissions) / 1000000;
        }),

    ])]).range([h - padding, padding]);


    // controlling of the ticks 
    var xAxis = d3.axisBottom().scale(xScale).ticks(5).tickFormat(d3.format("d")); // add the x-axis

    var yAxis = d3.axisLeft().scale(yScale); // add the y-axis
    oilLine = d3.line()
        .x(function(d) {
            return xScale(d.year);
        })
        .y(function(d) {
            return yScale(d.oil_co2_emissions / 1000000);
        });
    flaringLine = d3.line()
        .x(function(d) {
            return xScale(d.year);
        })
        .y(function(d) {
            return yScale(d.flaring_co2_emissions / 1000000);
        });
    cementLine = d3.line()
        .x(function(d) {
            return xScale(d.year);
        })
        .y(function(d) {
            return yScale(d.cement_co2_emissions / 1000000);
        });
    coalLine = d3.line()
        .x(function(d) {
            return xScale(d.year);
        })
        .y(function(d) {
            return yScale(d.coal_co2_emissions / 1000000);
        });
    gasLine = d3.line()
        .x(function(d) {
            return xScale(d.year);
        })
        .y(function(d) {
            return yScale(d.gas_co2_emissions / 1000000);
        });
    otherLine = d3.line()
        .x(function(d) {
            return xScale(d.year);
        })
        .y(function(d) {
            return yScale(d.other_co2_emissions / 10000000);
        });






    svg.append("path").datum(dataset).attr("class", "line").attr("d", oilLine).style("stroke", 'slategrey');
    svg.append("path").datum(dataset).attr("class", "line").attr("d", flaringLine).style("stroke", 'purple');
    svg.append("path").datum(dataset).attr("class", "line").attr("d", cementLine).style("stroke", 'blue');
    svg.append("path").datum(dataset).attr("class", "line").attr("d", coalLine).style("stroke", 'brown');
    svg.append("path").datum(dataset).attr("class", "line").attr("d", gasLine).style("stroke", 'darkgreen');
    svg.append("path").datum(dataset).attr("class", "line").attr("d", otherLine).style("stroke", 'darkorange');

    // create the text
    svg.append("text").attr("class", "textLabel").attr("x", w - 60).attr("y", yScale(dataset[dataset.length - 1].coal_co2_emissions / 1000000) - 7).text("Coal").attr("dy", ".35em").style("fill", "brown");




    svg.append("text").attr("class", "textLabel").attr("x", w - 60).attr("y", yScale(dataset[dataset.length - 1].oil_co2_emissions / 1000000) - 7).text("Oil").attr("dy", ".35em").style("fill", "slategrey");
    svg.append("text").attr("class", "textLabel").attr("x", w - 80).attr("y", yScale(dataset[dataset.length - 1].flaring_co2_emissions / 1000000) - 7).text("Flaring").attr("dy", ".35em").style("fill", "purple");
    svg.append("text").attr("class", "textLabel").attr("x", w - 60).attr("y", yScale(dataset[dataset.length - 1].cement_co2_emissions / 1000000) + 5).text("Cement").attr("dy", ".35em").style("fill", "blue");
    svg.append("text").attr("class", "textLabel").attr("x", w - 60).attr("y", yScale(dataset[dataset.length - 1].gas_co2_emissions / 1000000) - 7).text("Gas").attr("dy", ".35em").style("fill", "darkgreen");
    svg.append("text").attr("class", "textLabel").attr("x", w - 60).attr("y", yScale(dataset[dataset.length - 1].other_co2_emissions / 1000000) - 12).text("Others").attr("dy", ".35em").style("fill", "darkorange");


    console.log("hello");
    var example =d3.selectAll(".textLabel");
    console.log(example);
    svg.append("text")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-90)")
    .attr("y",20)
    .attr("x",-200)
    .text("Measured in million tonnes").style("font-size", "18px").attr("alignment-baseline", "middle").style("fill", "black"); 

    svg.append("text")
    .attr("text-anchor", "end")
    .attr("y",h -50)
    .attr("x",w/2 + 20)
    .text("Year").style("font-size", "18px").attr("alignment-baseline", "middle").style("fill", "black"); 

    // .style('font-size', 10).text("Oiasdasdasdl");
    // move it to the zero position of the plot of x - axis
    svg.append("g").attr("class", "axis").attr("transform", "translate(0, " + (h - padding) + ")").call(xAxis);
    // move it to the zero position of the plot of y - axis
    svg.append("g").attr("class", "axis").attr("transform", "translate(" + padding + ",0)").call(yAxis);

    const tooltip = d3.select('#tooltip');
    const tooltipLine = svg.append('line');
    var tipBox = svg.append('rect')
    .attr('width', w)
    .attr('height', h)
    .attr('opacity', 0).on('mousemove', (event) => {
        //const year = Math.floor((xScale.invert(d3.pointer(event, tipBox.node())[0]) + 5) / 5) * ;
        const year = Math.floor(xScale.invert(d3.pointer(event, tipBox.node())[0]));
    
        console.log( "hehehe" );
        console.log( event.pageX );
        const dataYear = dataset.find(data => data.year == year);
        tooltipLine.attr('stroke', 'black')
        .attr('x1', xScale(year))
        .attr('x2', xScale(year))
        .attr('y1', padding)
        .attr('y2', h - padding);
        tooltip.html(
            function(){
                return "<b>Year: "+dataYear.year+"</b><br> "+
        "Cement: "+ dataYear.cement_co2_emissions+"<br> "+
        "Coal: "+ dataYear.coal_co2_emissions+"<br> "+
        "Oil: " + dataYear.oil_co2_emissions+"<br> "+
        "Flaring: "+ dataYear.flaring_co2_emissions+"<br> "+
        "Others: " + dataYear.other_co2_emissions+"<br> "+
        "Gas: " + dataYear.gas_co2_emissions;
            }
        )
        .style('display', 'block')
        .style('left', event.pageX + 20)
        .style('top', event.pageY - 20).append('div');



    })
    .on('mouseout', (event) => {
        if (tooltip) tooltip.style('display', 'none');
        if (tooltipLine) tooltipLine.attr('stroke', 'none');
    });
};

function hideChart(data){
    console.log(coalLine);
    console.log(d3.select(coalLine));
    if(data == "all"){
        d3.selectAll(".line").style("opacity", 1).style("stroke-width", 1);
        d3.selectAll(".textLabel").style("opacity", 1);
    } else {
        var example =d3.selectAll(".line");
        var textExample = d3.selectAll(".textLabel");
        d3.selectAll(".line").style("opacity", .3).style("stroke-width", 1);
        d3.selectAll(".textLabel").style("opacity", .3);
        
        switch(data){
            case "oil":
                d3.select(example._groups[0][0]).style("opacity", 1).style("stroke-width", 3);
                d3.select(textExample._groups[0][1]).style("opacity", 1);
                break;
            case "gas":
                d3.select(example._groups[0][4]).style("opacity", 1).style("stroke-width", 3);
                d3.select(textExample._groups[0][4]).style("opacity", 1);
                break;
            case "coal":
                d3.select(example._groups[0][3]).style("opacity", 1).style("stroke-width", 3);
                d3.select(textExample._groups[0][0]).style("opacity", 1);
                break;
            case "flaring":
                d3.select(example._groups[0][1]).style("opacity", 1).style("stroke-width", 3);
                d3.select(textExample._groups[0][2]).style("opacity", 1);
                break;
            case "others":
                d3.select(example._groups[0][5]).style("opacity", 1).style("stroke-width", 3);
                d3.select(textExample._groups[0][5]).style("opacity", 1);
                break;
            case "cement":
                d3.select(example._groups[0][2]).style("opacity", 1).style("stroke-width", 3);
                d3.select(textExample._groups[0][3]).style("opacity", 1);
                break;
        }
    }
    
}