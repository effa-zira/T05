d3.csv("data/Ex5_TV_energy_Allsizes_byScreenType.csv").then(rawData => {
  const data = rawData.map(d => {
    const energyKey = Object.keys(d).find(key => key.includes("Mean"));
    return { tech: d["Screen_Tech"], energy: +d[energyKey] };
  }).filter(d => d.tech && !isNaN(d.energy));

  const width = 450;
  const height = 450;
  const margin = 40;
  const radius = Math.min(width, height) / 2 - margin;

  const svg = d3.select("#donut-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.tech))
    .range(d3.schemeSet3);

  const pie = d3.pie().value(d => d.energy);
  const arc = d3.arc().innerRadius(radius * 0.5).outerRadius(radius);
  const arcs = pie(data);

  svg.selectAll("path")
    .data(arcs)
    .join("path")
      .attr("d", arc)
      .attr("fill", d => color(d.data.tech))
      .attr("stroke", "white")
      .style("stroke-width", "2px");

  svg.selectAll("text")
    .data(arcs)
    .join("text")
      .text(d => d.data.tech)
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .style("text-anchor", "middle")
      .style("font-size", "14px")
      .style("fill", "#333")
      .style("font-weight", "bold");
});