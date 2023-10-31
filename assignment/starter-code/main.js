let geoData;
let ruleoflawData;
let populationData;
let rejectData;
let asylumData;
let returneeData;
const width = 700;
const height = 1200;
let svg = d3.select("#svg");
let xScale;
let yScale;

async function loadData() {
    await d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson").then(function (data) {
        geoData = data;
    });
    await d3.csv('../data/1-rule-of-law.csv').then(function (data) {
        ruleoflawData = data;
    });
    await d3.csv('../data/2-overall-population.csv').then(function (data) {
        populationData = data;
    });
    await d3.csv('../data/3-reject-total.csv').then(function (data) {
        rejectData = data;
    });
    await d3.csv('../data/4-asylum-country.csv').then(function (data) {
        asylumData = data;
    });
    await d3.csv('../data/5-returnee.csv').then(function (data) {
        returneeData = data;
    });
}


function initialiseSVG() {
    svg.attr("width", width);
    svg.attr("height", height);
    xScale = d3.scaleBand()
        .domain([])
        .range([0, width])
        .padding(0.1);

    yScale = d3.scaleLinear()
        .domain([])
        .nice()
        .range([height, 0]);
}


function drawMap(geoData, countryName = "", title = "") {
    //get features of the country
    let feature = geoData.features.filter(d => { return d.properties.name == countryName });
    //get coordinates of the country
    let coordinates = feature[0].geometry.coordinates[0][0];
    // Map and projection
    const projection = d3.geoIdentity().fitSize([width, height/3.5], feature[0]);
    //path
    var path = d3.geoPath().projection(projection);
    // Draw the map
    var wrapper = svg.append("a")
                .attr("xlink:href", "https://www.unhcr.org/us/emergencies/venezuela-situation")
    var map = wrapper.append("g");
    map.selectAll("path")
        .data(feature)
        .join("path")
        .attr("d", path)
    map.append("text")
        .attr("class", "inner-title")
        .attr("dy", "10em") // Adjust the vertical position as needed
        .attr("dx", "15em")
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "18px")
        .text(title);

}

function drawBarChart(data, countryName = "", title = "") {
    let feature = data.filter(d => { return d.Origin == countryName });
    let colourScale = d3.scaleLinear().domain([0, d3.max(feature, function(d){
        return parseInt(d.Applied);})]).range(["lightblue", "blue"]);
    var chart = svg.append('g')
    var w =  width/3/feature.length;
    var Hratio = w*4.5;
        
    chart.selectAll("rect")
        .data(feature)
        .enter()
        .append("rect")
        .attr("width", w)
        .attr("height", function(d){
            return d.Applied/Hratio;
        })
        .attr("x", function(d, i){
            return (w+30) * i + 170;
        })
        .attr("y", function(d){
            return height/1.6 - d.Applied/Hratio;
        })
        .attr("fill", function(d){
            var f = colourScale(d.Applied)
            return f;
        });
    
    var asylumLabels = feature.map(d => d.Asylum);
    chart.selectAll("text")
        .data(asylumLabels)
        .enter()
        .append("text")
        .attr("x", function(d, i) {
            return (w+30) * i + 170 + w / 2; // Center the label below each bar
        })
        .attr("y", height / 1.6 + 20) // Position the labels below the bars
        .text(function(d) {
            return d; // Display the x-axis label
        })
        .attr("text-anchor", "middle")
        .attr("fill", "white");

    chart.append("text")
        .attr("class", "inner-title")
        .attr("dy", "17em") // Adjust the vertical position as needed
        .attr("dx", "15em")
        .attr("text-anchor", "middle")
        .attr("fill", "blue")
        .attr("font-size", "25px")
        .text(title);

}


function drawPieChart(data, countryName, title = "") {
    // Filter the data based on the selected country
    const feature = data.find(d => d.Country === countryName);

    const percentage = feature.percentage;
    const chartWidth = height / 4; 
    const chartHeight = height / 4; 
    const radius = Math.min(chartWidth, chartHeight) / 2;

    // Calculate the `y` coordinate for the pie chart
    const pieChartY = height - chartHeight/2 ;

    // Create a group (g) element for the pie chart within the global SVG
    const chart = svg.append("g")
        .attr("transform", `translate(${width / 2},${pieChartY})`);

    chart.append("text")
        .attr("class", "inner-title")
        .attr("dy", "-7.5em") // Adjust the vertical position as needed
        .attr("text-anchor", "middle")
        .attr("font-size", "25px")
        .text(title)

    const pieData = [
        { label: "Approved", value: 100%-percentage },
        { label: "Rejected", value: percentage },
    ];
    
    const pie = d3.pie()
        .value(d => d.value);

    //var thisdata = pie(d3.entries({Approved: 100%-percentage, Rejected: percentage}))

    const arc = d3.arc()
        .innerRadius(radius/2)
        .outerRadius(radius);

   
    const slices = chart.selectAll("path")
        .data(pie(pieData))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("stroke", "black")
        .style("stroke-width", "2.5px")
        .attr("fill", (d, i) => (i === 0) ? "lightblue" : "lightorange")
        .attr("class", "pie-slice");
    
        slices.each(function (d) {
            const centroid = arc.centroid(d);
            chart.append("text")
                .attr("class", "pie-label")
                .attr("dy", "0.8em")
                .attr("transform", `translate(${centroid})`)
                .text(" "+d.data.value+"%");
        });
        
        chart.append("text")
        .attr("dy", "-0.6em")
        .attr("dx", "-2.1em")
        .attr("text-anchor", "middle")
        .text("Accepted")
        .attr("fill", "lightblue")

        chart.append("text")
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .style("font-size", "50px")
        .text("/")
        .attr("fill", "lightyellow")

        chart.append("text")
        .attr("dy", "1.2em")
        .attr("dx", "2.1em")
        .attr("text-anchor", "middle")
        .text("Rejected")
        .attr("fill", "lightorange")
}

function drawTable(data, columns, id, countryName = "", title = "") {
    let feature = data.filter(d => { return d.Country == countryName });
    var table = d3.select('main').append('table');
    table.append("caption").text(title);
    table.attr("id", id)
    var thead = table.append('thead')
    var tbody = table.append('tbody')
    thead.append('tr')
        .selectAll('th')
        .data(columns)
        .enter()
        .append('th')
        .text(function (d) { return d })

    var rows = tbody.selectAll('tr')
        .data(feature)
        .enter()
        .append('tr')

    var cells = rows.selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
                return { column: column, value: row[column] }
            })
        })
        .enter()
        .append('td')
        .text(function (d) { return d.value })

    return table;
}

async function initialise() {
    // load the data
    await loadData();
    // initalise the SVG
    initialiseSVG();
    drawMap(geoData, "Venezuela", "The Ongoging Crisis: click on map");
    var columns1 = ['Country', 'Overall Score', 'Ranking']
    var columns2 = ['Constraints on Government Powers', 'Absence of Corruption', 'Open Government', 'Fundamental Rights', 'Order and Security', 'Regulatory Enforcement', 'Civil Justice', 'Criminal Justice']
    drawBarChart(asylumData, "Venezuela", "Top 5 asylum countries by # of applications");
    drawPieChart(rejectData, "Venezuela", "% of rejected asylum applications");
    drawTable(ruleoflawData, columns1, "table1", "Venezuela", "Fragility Index of Venezuela");
    drawTable(ruleoflawData, columns2, "table2", "Venezuela", "How is the score calculated (breakdown)?");
}

initialise();