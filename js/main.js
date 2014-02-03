/*
InfoVis - Spring 2014
Completed by: Vikram Somu
*/

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

function convertData(d){
    d.compactness = +d.compactness;
    d.kernelLength = +d.kernelLength;
    d.kernelWidth = +d.kernelWidth;
    d.asymmetryCoefficient = +d.asymmetryCoefficient;
    d.grooveLength = +d.grooveLength;
    return d;
}

function getLabelText(attr){
    if(attr == "compactness"){
        return "Compactness";
    }else if(attr == "kernelLength"){
        return "Kernel Length (cm)";
    }else if(attr == "kernelWidth"){
        return "Kernel Width (cm)";
    }else if(attr == "asymmetryCoefficient"){
        return "Asymmetry Coefficient";
    }else if(attr == "grooveLength"){
        return "Groove Length (cm)";
    }
}

var dataSet;
var xLabel;
var yLabel;

function draw(data){

    var xScale = d3.scale.linear()
        .domain(d3.extent(data, function(d) { return d[xLabel]; })).nice()
        .range([0, width]);

    var yScale = d3.scale.linear()
        .domain(d3.extent(data, function(d) { return d[yLabel]; })).nice()
        .range([height, 0]);

    var color = d3.scale.category10();

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");
    
    var svg = d3.select("#vis").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
      .append("text")
        .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(getLabelText(xLabel));

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(getLabelText(yLabel));

    svg.selectAll(".dot")
        .data(data)
      .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function(d) { return xScale(d[xLabel]); })
        .attr("cy", function(d) { return yScale(d[yLabel]); })
        .style("fill", function(d) { return color(d.variety); })
        .on("mouseover", function(d) { 
            var details = "Compactness: " + d.compactness + "<br>" +
            "Kernel Length: " + d.kernelLength + "<br>" +
            "Kernel Width: " + d.kernelWidth + "<br>" +
            "Asymmetry Coefficient: " + d.asymmetryCoefficient + "<br>" +
            "Groove Length: " + d.grooveLength + "<br>" +
            "Variety: " + d.variety;

            showDetails(details);
        });


    var legend = svg.selectAll(".legend")
        .data(color.domain())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
}

/**
THIS FUNCTION IS CALLED WHEN THE WEB PAGE LOADS. PLACE YOUR CODE TO LOAD THE 
DATA AND DRAW YOUR VISUALIZATION HERE. THE VIS SHOULD BE DRAWN INTO THE "VIS" 
DIV ON THE PAGE.

This function is passed the variables to initially draw on the x and y axes.
**/

function init(xAxis, yAxis){
    xLabel = xAxis;
    yLabel = yAxis;
    
    d3.csv("data/data.csv", convertData, function(error, data) {
        dataSet = data;
        draw(dataSet);
    });
}

/**
## onXAxisChange(value)
This function is called whenever the menu for the variable to display on the
x axis changes. It is passed the variable name that has been selected, such as
"compactness". Populate this function to update the scatterplot accordingly.
**/
function onXAxisChange(value){
    d3.select('svg').remove();
    xLabel = value;  
    draw(dataSet);     
}


/**
## onYAxisChange(value)
This function is called whenever the menu for the variable to display on the
y axis changes. It is passed the variable name that has been selected, such as
"Asymmetry Coefficient". Populate this function to update the scatterplot 
accordingly.
**/
function onYAxisChange(value){
    d3.select('svg').remove();
    yLabel = value;  
    draw(dataSet);
}

/**
## showDetails(string)
This function will display details in the "details" box on the page. Pass in 
a string and it will be displayed. For example, 
    showDetails("Variety: " + item.variety);
**/
function showDetails(string){
    d3.select('#details').html(string);
}
