// JOHN MEMA  -   ECS 163 Homework 3

// PLOT 1 - BAR CHART
const data = [
  {service: "Spotify", hours: 3.84},
  {service: "Apple Music", hours: 3.66},
  {service: "YouTube Music", hours: 3.22},
  {service: "Other streaming service", hours: 3.09},
  {service: "No streaming service.", hours: 2.95},
  {service: "Pandora", hours: 3.14}
];

const margin = {top: 20, right: 20, bottom: 90, left: 70},
  width = 700 - margin.left - margin.right,
  height = 550 - margin.top - margin.bottom;

const svg = d3.select("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3.scaleBand()
  .domain(data.map(d => d.service))
  .range([0, width])
  .padding(0.1);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(data, d => d.hours+0.25)])
  .range([height, 0]);

  let clickedBar = null;
  const bars = svg.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("x", d => xScale(d.service))
    .attr("y", d => yScale(d.hours))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d.hours))
    .attr("fill", "blue")

bars.on("mouseover", function() {
    d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", "orange")  
        .attr("width", xScale.bandwidth() + 10)  
        .attr("x", d => xScale(d.service) - 5);  
})
.on("mouseout", function() {
    d3.select(this)
        .transition()
        .duration(200)
        .attr("fill", "blue")  // go back to og color
        .attr("width", xScale.bandwidth())  // revert width and position
        .attr("x", d => xScale(d.service)); 
});

const legendBar = svg.append("g")
  .attr("transform", `translate(${width - 120}, 0)`);

legendBar.append("rect")
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", "blue");

legendBar.append("rect")
  .attr("x", 0)
  .attr("y", 24)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", "orange");
  
legendBar.append("text")
  .attr("x", 24)
  .attr("y", 9)
  .attr("dy", "0.35em")
  .style("text-anchor", "start")
  .text("Hours Listened");

legendBar.append("text")
  .attr("x", 24)
  .attr("y", 9)
  .attr("dy", "2em")
  .style("text-anchor", "start")
  .text("Service Hovered");

svg.append("text")
  .attr("transform", `translate(${width / 16}, ${height + margin.bottom / 2})`)
  .style("text-anchor", "middle")
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .text("Streaming Service");

svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .style("font-size", "16px")
  .style("font-weight", "bold")
  .text("Hours Listened");

svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale))
  .selectAll("text")
  .attr("transform", "rotate(-45)")
  .style("text-anchor", "end");

svg.append("g")
  .call(d3.axisLeft(yScale));

svg.append("text")
  .attr("x", (width / 2))
  .attr("y", 0 - (margin.top / 10))
  .attr("text-anchor", "middle")
  .style("font-size", "24px")
  .style("font-weight", "bold")
  .text("Hours Listened for each Streaming Service");

// PLOT 2 - PIEEE

const uniquePieData = [
  {service: "Spotify", hours: 19.30},
  {service: "Apple Music", hours: 18.39},
  {service: "YouTube Music", hours: 16.18},
  {service: "Pandora", hours: 15.78},
  {service: "Other", hours: 15.53},
  {service: "No streaming service", hours: 14.82}
];

const totalUniqueHours = d3.sum(uniquePieData, d => d.hours);
const processedPieData = uniquePieData.map(d => ({ service: d.service, percentage: (d.hours / totalUniqueHours) * 100 }));

const uniquePieWidth = 500;
const uniquePieHeight = 500;
const uniquePieRadius = Math.min(uniquePieWidth, uniquePieHeight) / 2 - 10;

const uniquePieSvg = d3.select("body")
  .append("svg")
    .attr("width", uniquePieWidth)
    .attr("height", uniquePieHeight)
  .append("g")
    .attr("transform", `translate(${uniquePieWidth / 2},${uniquePieHeight / 2})`);

const uniquePie = d3.pie()
  .value(d => d.percentage);

const uniqueArc = d3.arc()
  .innerRadius(0)
  .outerRadius(uniquePieRadius);

function drawPieChart() {
  uniquePieSvg.selectAll("*").remove();

  const uniqueArcs = uniquePieSvg.selectAll("arc")
    .data(uniquePie(processedPieData))
    .enter()
    .append("g")
      .attr("class", "arc");

  uniqueArcs.append("path")
    .attr("fill", (d, i) => d3.schemeCategory10[i])
    .transition()
    .delay((d, i) => i * 1100)
    .duration(1200)
    .attrTween("d", function(d) {
      var i = d3.interpolate(d.startAngle + 0.001, d.endAngle);
      return function(t) {
        d.endAngle = i(t);
        return uniqueArc(d);
      };
    });
    
  const pieTitle = uniquePieSvg.append("text")
    .attr("y", -uniquePieHeight / 2 + 30)
    .attr("text-anchor", "middle")
    .attr("font-size", "24px")
    .attr("font-weight", "bold");

  pieTitle.append("tspan")
    .attr("dy", "0")
    .text("Streaming Service");

  pieTitle.append("tspan")
    .attr("x", 0)
    .attr("dy", "1.2em")
    .text("Market Share");

    
  uniqueArcs.append("text")
      .attr("transform", d => `translate(${uniqueArc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .attr("font-size", "18px") 
      .attr("font-weight", "bold") 
      .text(d => `${d.data.percentage.toFixed(1)}%`);
  
  const legend = uniquePieSvg.append("g")
    .attr("transform", `translate(${uniquePieWidth / 2 - 130}, ${-uniquePieHeight / 2 + 0})`);


  legend.append("rect")
    .attr("width", 240)
    .attr("height", processedPieData.length * 30 + 10)
    .attr("fill", "white")
    .attr("stroke", "black");

    processedPieData.forEach((d, i) => {
      const legendItem = legend.append("g")
        .attr("transform", `translate(10, ${i * 25 + 10})`);
    
      legendItem.append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", d3.schemeCategory10[i]);
    
      const serviceName = d.service.split(" ");
      serviceName.forEach((part, index) => {
        legendItem.append("text")
          .attr("x", 30)
          .attr("y", 15 + index * 15)
          .text(part)
          .attr("font-size", "14px");
      });
    });
    
}



drawPieChart();

d3.select("body").append("button")
  .text("Rerun Animation")
  .on("click", function() {
    drawPieChart();
  });

var parPlotData = [
{ age: 27, platform: "Other", rock: 3.2, hiphop: 1.4, metal: 0.7, classical: 0.9, jazz: 0.8, pop: 1.3, rap: 1.5 },
{ age: 26, platform: "Spotify", rock: 8.3, hiphop: 0.5, metal: 0.9, classical: 0.6, jazz: 1.7, pop: 0.4, rap: 1.8 },
{ age: 30, platform: "Spotify", rock: 1.1, hiphop: 1.2, metal: 0.8, classical: 0.7, jazz: 1.6, pop: 1.1, rap: 0.9 },
{ age: 30, platform: "Pandora", rock: 13.3, hiphop: 1.1, metal: 0.6, classical: 0.8, jazz: 1.2, pop: 1.2, rap: 0.7 },
{ age: 18, platform: "Apple Music", rock: 5.5, hiphop: 0.8, metal: 1.1, classical: 0.3, jazz: 0.6, pop: 1.7, rap: 1.4 },
{ age: 23, platform: "Pandora", rock: 6.6, hiphop: 2.4, metal: 1.2, classical: 1.3, jazz: 3.2, pop: 2.5, rap: 2.9 },
{ age: 23, platform: "Pandora", rock: 6.8, hiphop: 2.3, metal: 1.1, classical: 1.4, jazz: 3.1, pop: 2.2, rap: 2.8 },
{ age: 23, platform: "I do not use a streaming service", rock: 6.3, hiphop: 11.2, metal: 1.5, classical: 1.2, jazz: 1.7, pop: 0.8, rap: 1.6 },
{ age: 23, platform: "I do not use a streaming service", rock: 6.1, hiphop: 11.3, metal: 1.7, classical: 1.1, jazz: 1.8, pop: 0.9, rap: 1.2 },
{ age: 23, platform: "YouTube Music", rock: 6.4, hiphop: 11.1, metal: 1.3, classical: 1.6, jazz: 1.5, pop: 0.6, rap: 1.3 },
{ age: 23, platform: "I do not use a streaming service", rock: 6.5, hiphop: 11.5, metal: 1.9, classical: 1.8, jazz: 1.9, pop: 0.7, rap: 1.8 },
{ age: 23, platform: "YouTube Music", rock: 6.7, hiphop: 11.7, metal: 1.6, classical: 1.7, jazz: 1.6, pop: 0.8, rap: 1.7 },
{ age: 23, platform: "I do not use a streaming service", rock: 6.9, hiphop: 11.9, metal: 1.3, classical: 1.2, jazz: 1.5, pop: 0.9, rap: 1.1 },
{ age: 23, platform: "I do not use a streaming service", rock: 6.2, hiphop: 11.6, metal: 1.4, classical: 1.3, jazz: 1.6, pop: 0.6, rap: 1.5 },
{ age: 23, platform: "YouTube Music", rock: 6.5, hiphop: 11.4, metal: 1.7, classical: 1.5, jazz: 1.3, pop: 0.9, rap: 1.4 },
{ age: 23, platform: "I do not use a streaming service", rock: 6.3, hiphop: 11.7, metal: 1.8, classical: 1.6, jazz: 1.7, pop: 0.8, rap: 1.6 },
{ age: 23, platform: "YouTube Music", rock: 5.9, hiphop: 10.8, metal: 2.1, classical: 11.2, jazz: 1.8, pop: 0.6, rap: 1.1 },
{ age: 28, platform: "Spotify", rock: 4.6, hiphop: 2.5, metal: 0.9, classical: 0.7, jazz: 1.4, pop: 3.2, rap: 2.3 },
{ age: 22, platform: "Apple Music", rock: 3.8, hiphop: 5.7, metal: 1.3, classical: 0.5, jazz: 0.9, pop: 4.1, rap: 3.5 },
{ age: 25, platform: "Pandora", rock: 2.9, hiphop: 3.3, metal: 0.8, classical: 1.2, jazz: 2.1, pop: 2.4, rap: 1.7 },
{ age: 27, platform: "YouTube Music", rock: 5.6, hiphop: 1.9, metal: 0.7, classical: 0.6, jazz: 0.9, pop: 2.1, rap: 2.2 },
{ age: 29, platform: "Other", rock: 3.2, hiphop: 4.1, metal: 1.4, classical: 1.5, jazz: 1.7, pop: 3.9, rap: 2.6 },
{ age: 24, platform: "YouTube Music", rock: 1.8, hiphop: 2.4, metal: 0.9, classical: 0.8, jazz: 2.2, pop: 1.3, rap: 1.6 },
{ age: 26, platform: "Spotify", rock: 4.5, hiphop: 3.3, metal: 1.1, classical: 0.7, jazz: 1.3, pop: 3.6, rap: 3.2 },
{ age: 21, platform: "Apple Music", rock: 2.7, hiphop: 5.3, metal: 0.8, classical: 1.2, jazz: 0.9, pop: 4.4, rap: 4.3 },
{ age: 28, platform: "Pandora", rock: 3.5, hiphop: 1.8, metal: 0.7, classical: 1.1, jazz: 2.3, pop: 2.5, rap: 1.7 },
{ age: 27, platform: "Spotify", rock: 5.3, hiphop: 2.6, metal: 1.2, classical: 0.9, jazz: 1.1, pop: 3.4, rap: 2.9 },
{ age: 23, platform: "Apple Music", rock: 4.2, hiphop: 3.6, metal: 1.4, classical: 1.3, jazz: 1.6, pop: 2.8, rap: 3.1 },
{ age: 22, platform: "Pandora", rock: 2.8, hiphop: 4.5, metal: 0.7, classical: 0.9, jazz: 1.2, pop: 3.3, rap: 2.5 },
{ age: 25, platform: "Spotify", rock: 3.7, hiphop: 5.2, metal: 0.9, classical: 1.5, jazz: 0.8, pop: 4.2, rap: 4.1 },
{ age: 24, platform: "Apple Music", rock: 1.9, hiphop: 3.1, metal: 1.2, classical: 0.8, jazz: 2.3, pop: 2.6, rap: 1.7 },
{ age: 26, platform: "Pandora", rock: 4.3, hiphop: 2.8, metal: 0.6, classical: 1.3, jazz: 1.4, pop: 3.7, rap: 2.8 },
{ age: 28, platform: "Spotify", rock: 3.6, hiphop: 4.2, metal: 1.1, classical: 0.7, jazz: 1.2, pop: 4.1, rap: 3.6 },
{ age: 22, platform: "Apple Music", rock: 2.1, hiphop: 5.8, metal: 0.8, classical: 1.1, jazz: 0.8, pop: 3.7, rap: 4.4 },
{ age: 27, platform: "Pandora", rock: 4.1, hiphop: 1.7, metal: 0.5, classical: 1.2, jazz: 2.4, pop: 2.9, rap: 1.5 },
{ age: 29, platform: "Spotify", rock: 5.7, hiphop: 3.5, metal: 1.4, classical: 1.3, jazz: 0.6, pop: 4.2, rap: 3.4 },
{ age: 23, platform: "Apple Music", rock: 3.4, hiphop: 4.7, metal: 0.9, classical: 0.7, jazz: 1.3, pop: 3.6, rap: 2.8 }
];


var parPlotMargin = {top: 30, right: 10, bottom: 10, left: 0},
    parPlotWidth = 950 - parPlotMargin.left - parPlotMargin.right,
    parPlotHeight = 480 - parPlotMargin.top - parPlotMargin.bottom;

var parPlotSvg = d3.select("body").append("svg")
    .attr("width", parPlotWidth + parPlotMargin.left + parPlotMargin.right)
    .attr("height", parPlotHeight + parPlotMargin.top + parPlotMargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + parPlotMargin.left + "," + parPlotMargin.top + ")");
 
var parPlotDimensions = d3.keys(parPlotData[0]).filter(function(d) {
  return d != "platform" && d != "age";
});

var parPlotY = {};
for (i in parPlotDimensions) {
  name = parPlotDimensions[i]
  parPlotY[name] = d3.scaleLinear()
    .domain( d3.extent(parPlotData, function(d) { return +d[name]; }) )
    .range([parPlotHeight, 0])
}

var parPlotX = d3.scalePoint()
  .range([0, parPlotWidth])
  .padding(1)
  .domain(parPlotDimensions);

var parPlotPath = function (d) {
  return d3.line()(parPlotDimensions.map(function(p) { return [parPlotX(p), parPlotY[p](d[p])]; }));
}

parPlotSvg.selectAll("myPath")
  .data(parPlotData)
  .enter().append("path")
  .attr("d",  parPlotPath)
  .style("fill", "none")
  .style("stroke", "#69b3a2")
  .style("opacity", 0.5)

  var parPlotColor = d3.scaleOrdinal()
  .domain(parPlotData.map(function(d) { return d.platform; }))
  .range(d3.schemeCategory10);

var parPlotHighlight = function(d) {
  d3.selectAll(".parPlotLine")
    .transition() 
    .duration(260)
    .style("opacity", 0.1)
    .style("stroke", "lightgrey");

  d3.selectAll(".parPlotLine." + d.platform.replace(/\s/g, ''))
    .transition() 
    .duration(240)
    .style("opacity", 1)
    .style("stroke-width", "4px")
    .style("stroke", function(d) { return d3.rgb(parPlotColor(d.platform)).brighter(0.6); });
};

var parPlotUnhighlight = function(d) {
  d3.selectAll(".parPlotLine")
    .transition() 
    .duration(150)
    .style("opacity", 0.5)
    .style("stroke-width", "1.5px")
    .style("stroke", function(d) { return parPlotColor(d.platform); });
};

parPlotSvg.selectAll("myPath")
  .data(parPlotData)
  .enter().append("path")
  .attr("class", function (d) { return "parPlotLine " + d.platform.replace(/\s/g, '') }) // Replace spaces for class name
  .attr("d", parPlotPath)
  .style("fill", "none")
  .style("stroke", function(d) { return parPlotColor(d.platform); })
  .style("opacity", 0.5)
  .on("mouseover", parPlotHighlight)
  .on("mouseleave", parPlotUnhighlight);

parPlotSvg.selectAll("myAxis")
  .data(parPlotDimensions).enter()
  .append("g")
  .attr("class", "axis")
  .attr("transform", function(d) { return "translate(" + parPlotX(d) + ")"; })
  .each(function(d) { d3.select(this).call(d3.axisLeft().scale(parPlotY[d])); })
  .append("text")
  .style("text-anchor", "middle")
  .attr("y", -9)
  .text(function(d) { return d; })
  .style("fill", "black")

  var parPlotLegendSvg = d3.select("body").append("svg")
  .attr("width", 200)
  .attr("height", 200);

var platformColors = {
  "Pandora": "green",
  "Apple Music": "red",
  "Spotify": "orange",
  "Other": "blue",
  "No streaming service": "purple",
  "YouTube Music": "brown"
};

var legendWidth = 100,
    legendHeight = 100,
    legendPadding = 10,
    legendX = parPlotWidth - legendWidth - legendPadding,
    legendY = legendPadding;

var legend = parPlotSvg.append("g")
    .attr("class", "legend")
    .attr("transform", "translate(" + legendX + "," + legendY + ")");

var legendRects = legend.selectAll("rect")
    .data(Object.keys(platformColors))
    .enter()
    .append("rect")
    .attr("x", 0)
    .attr("y", function(d, i) { return i * 20; })
    .attr("width", 10)
    .attr("height", 10)
    .style("fill", function(d) { return platformColors[d]; });

var legendText = legend.selectAll("text")
    .data(Object.keys(platformColors))
    .enter()
    .append("text")
    .attr("x", 15)
    .attr("y", function(d, i) { return i * 20 + 9; })
    .text(function(d) { return d; })
    .style("font-size", "12px");

d3.selection.prototype.raise = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};

var parPlotTitle = parPlotSvg.append("text")
    .attr("x", parPlotWidth / 2)
    .attr("y", -18)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Favorite Genres by Service");

legend.raise();
