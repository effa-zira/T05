d3.csv("data/Ex5_TV_energy_55inchtv_byScreenType.csv").then(rawData => {
  console.log("Data loaded:", rawData); // This will prove it loaded

  const validRows = rawData.filter(d => d["Screen_Tech"] && d["Screen_Tech"].trim() !== "");

  const data = validRows.map(d => {
    const energyKey = Object.keys(d).find(key => key.includes("Mean"));
    return { 
      tech: d["Screen_Tech"].trim(), 
      energy: +d[energyKey] 
    };
  }).filter(d => d.tech && !isNaN(d.energy));

  const margin = {top: 30, right: 30, bottom: 50, left: 70};
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#bar-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleBand()
    .range([0, width])
    .domain(data.map(d => d.tech))
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.energy) + 50]) 
    .range([height, 0]);

  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.tech))
    .range(["#FF6B6B", "#4ECDC4", "#45B7D1"]);

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x));

  svg.append("g")
    .call(d3.axisLeft(y));

  svg.selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.tech))
      .attr("y", d => y(d.energy))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.energy))
      .attr("fill", d => color(d.tech));
});