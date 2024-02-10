// JOHN MEMA  -   ECS 163 Homework 2

const data = [
    {service: "Spotify", hours: 3.84},
    {service: "Apple Music", hours: 3.66},
    {service: "YouTube Music", hours: 3.22},
    {service: "Other streaming service", hours: 3.09},
    {service: "Don't use a streaming service.", hours: 2.95},
    {service: "Pandora", hours: 3.14}
]

// margins
const margin = {top: 20, right: 20, bottom: 90, left: 70},
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const svg = d3.select("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// scales
const xScale = d3.scaleBand()
    .domain(data.map(d => d.service))
    .range([0, width])
    .padding(0.1);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.hours+0.25)])
    .range([height, 0]);

// create the bars
svg.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("x", d => xScale(d.service))
    .attr("y", d => yScale(d.hours))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(d.hours))
    .attr("fill", "steelblue");

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


    /// 2nd plot -- PIE CHART
    
const totalHours = d3.sum(data, d => d.hours);
const pieData = data.map(d => ({ service: d.service, percentage: (d.hours / totalHours) * 100 }));
const pieWidth = 500;
const pieHeight = 500;
const pieMargin = { top: 20, right: 20, bottom: 20, left: 20 };
const pieRadius = Math.min(pieWidth, pieHeight) / 2 - 10;

const pieSvg = d3.select("body")
  .append("svg")
    .attr("width", pieWidth)
    .attr("height", pieHeight)
  .append("g")
    .attr("transform", `translate(${pieWidth / 2},${pieHeight / 2})`);

const pie = d3.pie()
  .value(d => d.percentage);

// arc function
const arc = d3.arc()
  .innerRadius(0)
  .outerRadius(pieRadius);

// pie chart
const arcs = pieSvg.selectAll("arc")
  .data(pie(pieData))
  .enter()
  .append("g")
    .attr("class", "arc");

pieSvg.append("text")
    .attr("x", 0)
    .attr("y", -pieHeight / 2.6 + pieMargin.top) 
    .attr("text-anchor", "middle") 
    .style("font-size", "24px") 
    .style("font-weight", "bold") 
    .text("Streaming Service Usage"); 

arcs.append("path")
  .attr("d", arc)
  .attr("fill", (d, i) => d3.schemeCategory10[i]);

arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px") 
    .attr("font-weight", "bold") 
    .html(function(d) {
        const lines = d.data.service.split(/\s+/);
        return lines.map((line, index) => `<tspan x="0" dy="${index ? "1.2em" : "0"}">${line}${index ? "  " : ""}</tspan>`).join("") + 
               `\n${d.data.percentage.toFixed(2)}%`; 
      })
    .raise();


// plot 3 

const streamData = [
    {'Fav genre': 'Classical', '18-24': 16, '25-34': 9, '35-44': 2, '45-54': 3, '55-64': 2, '65+': 2, 'Unknown': 19},
    {'Fav genre': 'Country', '18-24': 14, '25-34': 3, '35-44': 4, '45-54': 0, '55-64': 0, '65+': 1, 'Unknown': 3},
    {'Fav genre': 'EDM', '18-24': 19, '25-34': 10, '35-44': 0, '45-54': 1, '55-64': 0, '65+': 0, 'Unknown': 7},
    {'Fav genre': 'Folk', '18-24': 12, '25-34': 8, '35-44': 4, '45-54': 1, '55-64': 0, '65+': 0, 'Unknown': 5},
    {'Fav genre': 'Gospel', '18-24': 1, '25-34': 4, '35-44': 1, '45-54': 2, '55-64': 3, '65+': 2, 'Unknown': 2},
];

const streamMargin = { top: 20, right: 80, bottom: 60, left: 50 },
    streamWidth = 960 - streamMargin.left - streamMargin.right,
    streamHeight = 500 - streamMargin.top - streamMargin.bottom;

const streamSvg = d3.select("body").append("svg")
    .attr("width", streamWidth + streamMargin.left + streamMargin.right)
    .attr("height", streamHeight + streamMargin.top + streamMargin.bottom)
  .append("g")
    .attr("transform", `translate(${streamMargin.left},${streamMargin.top})`);

const keys = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+", "Unknown"]; 
const genres = streamData.map(d => d['Fav genre']);
const color = d3.scaleOrdinal(d3.schemeCategory10);
const stackedData = d3.stack().keys(keys)(streamData.map(d => {
    let { 'Fav genre': _, ...rest } = d;
    return rest;
}));

// scales
const x = d3.scaleBand()
    .domain(genres)
    .range([0, streamWidth])
    .padding(0.);

const y = d3.scaleLinear()
    .domain([0, d3.max(stackedData, layer => d3.max(layer, d => d[1]))]) 
    .range([streamHeight, 0]);

const area = d3.area()
    .x((d, i) => x(genres[i % genres.length])) 
    .y0(d => y(d[0])) 
    .y1(d => y(d[1]));

// data to paths
streamSvg.selectAll(".layer")
    .data(stackedData)
    .join("path")
      .attr("class", "layer")
      .style("fill", (d, i) => color(i))
      .attr("d", area);

streamSvg.append("text")
    .attr("transform", `translate(${streamWidth / 2}, ${streamHeight + streamMargin.top + 50})`) 
    .attr("class", "axis-title")
    .attr("dy", "-2em")
    .style("text-anchor", "middle")
    .style("font-size", "20px")
    .style("font-weight", "bold")
    .text("Favorite Genre");

streamSvg.append("text")
    .attr("transform", "rotate(-90)") 
    .attr("y", 0 - streamMargin.left + 20) 
    .attr("x", 0 - (streamHeight / 2))
    .attr("dy", "0em")
    .attr("class", "axis-title") 
    .style("text-anchor", "middle")
    .style("font-size", "20px") 
    .style("font-weight", "bold") 
    .text("Number of Respondents");
    const legend = streamSvg.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse()) 
    .enter().append("g")
      .attr("transform", (d, i) => `translate(-50,${i * 20})`); 
  
  legend.append("rect")
    .attr("x", streamWidth - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", d => color(d));
  
  legend.append("text")
    .attr("x", streamWidth - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(d => d);
  
  legend.selectAll("text")
    .style("font-size", "12px") 
    .style("font-weight", "bold"); 
    
streamSvg.append("g")
    .attr("transform", `translate(0,${streamHeight})`)
    .call(d3.axisBottom(x).tickSizeOuter(0));

streamSvg.append("g")
    .call(d3.axisLeft(y));
