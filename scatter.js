d3.csv("data/Ex5_TV_energy.csv").then(data => {
  data.forEach(d => {
    d.Star = +d.star2; 
    d.Energy = +d.energy_consumpt; 
  });

  const margin = {top: 20, right: 30, bottom: 50, left: 60};
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#scatter-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Star) + 1])
    .range([0, width]);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.Energy) + 50])
    .range([height, 0]);

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));

  svg.append('g')
    .selectAll("circle")
    .data(data)
    .join("circle")
      .attr("cx", d => x(d.Star))
      .attr("cy", d => y(d.Energy))
      .attr("r", 4)
      .attr("fill", "#4CAF50")
      .attr("opacity", 0.6);
});