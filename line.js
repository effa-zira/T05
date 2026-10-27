d3.csv("data/Ex5_ARE_Spot_Prices.csv").then(rawData => {
  const data = rawData.map(d => {
    const yearKey = Object.keys(d).find(key => key.toLowerCase().includes("year"));
    const row = { year: +d[yearKey] };
    
    Object.keys(d).forEach(key => {
      if (key !== yearKey) {
        const cleanKey = key.split(" (")[0]; 
        if (d[key] && d[key].trim() !== "") {
          row[cleanKey] = +d[key];
        }
      }
    });
    return row;
  }).sort((a, b) => a.year - b.year);

  const states = Object.keys(data[0]).filter(key => key !== "year" && key !== "undefined" && data[0][key] !== undefined);

  const margin = {top: 30, right: 150, bottom: 50, left: 70}; 
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const svg = d3.select("#line-chart")
    .append("svg")
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, width]);

  const maxPrice = d3.max(data, d => d3.max(states, state => d[state])); 
  
  const y = d3.scaleLinear()
    .domain([0, maxPrice + 20])
    .range([height, 0]);

  const color = d3.scaleOrdinal().domain(states).range(d3.schemeSet1);

  svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d")));

  svg.append("g")
    .call(d3.axisLeft(y));

  states.forEach(state => {
    const lineGenerator = d3.line()
      .defined(d => d[state] != null) 
      .x(d => x(d.year))
      .y(d => y(d[state]));

    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", color(state))
      .attr("stroke-width", 2)
      .attr("d", lineGenerator);
  });

  const legend = svg.append("g").attr("transform", `translate(${width + 20}, 20)`);
  states.forEach((state, i) => {
    const legendRow = legend.append("g").attr("transform", `translate(0, ${i * 20})`);
    legendRow.append("rect").attr("width", 15).attr("height", 15).attr("fill", color(state));
    legendRow.append("text").attr("x", 20).attr("y", 12).attr("font-size", "12px").attr("fill", "#333").text(state);
  });
});