let geoData;
let ruleoflawData;
let populationData;
let rejectData;
let asylumData;
let returneeData;
let birthsData;
let currentCountry;
const width = 700;
const height = 450;
let svg = d3.select("#svg");
let xScale;
let yScale;
let keyframeIndex = 0;

let keyframes = [
    {
        activeVerse: 1,
        activeLines: [1],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            drawInfant(500, -10, 100);
            insertWords(`It's year 2000`, "35px", 380, 400);
        }
    },
    {
        activeVerse: 1,
        activeLines: [2, 3],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            drawInfant(500, -10, 100);
            insertWords(`You were born in ${currentCountry}`, "35px", 380, 400);
        }
    },
    {
        activeVerse: 1,
        activeLines: [4, 5, 6],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            birthsData = (birthsData.filter(d => { return d.Country == currentCountry }))[0].Births;
            drawMap(geoData, currentCountry);
            drawInfant(200, 50, 50);
            insertWords(`Out of the`, "35px", 380, 200);
            insertWords(`${birthsData}`, "70px", 380, 260);
            insertWords(`newborns`, "35px", 380, 300);
        }
    },
    {
        activeVerse: 2,
        activeLines: [1],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            drawMap(geoData, currentCountry);
            insertWords(`However`, "35px", 350, 250);
        }
    },
    {
        activeVerse: 2,
        activeLines: [2],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            drawMap(geoData, currentCountry);
            drawCrack(700, 0, 0);
            insertWords(`The crisis there`, "35px", 350, 250);
        }
    },
    {
        activeVerse: 2,
        activeLines: [3],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            var columns1 = ['Country', 'Rule of Law Index', 'Ranking']
            drawTable(ruleoflawData, columns1, "table1", currentCountry, "Fragility Index");
            insertWords(`makes it not livable`, "35px", 330, 300);
        }
    },
    {
        activeVerse: 2,
        activeLines: [4],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            var columns2 = ['Constraints on Government Powers', 'Absence of Corruption', 'Open Government', 'Fundamental Rights', 'Order and Security', 'Regulatory Enforcement', 'Civil Justice', 'Criminal Justice']
            drawTable(ruleoflawData, columns2, "table2", currentCountry, "How is the score calculated (breakdown)?");
            insertWords(`anymore...`, "35px", 350, 300);
        }
    },
    {
        activeVerse: 2,
        activeLines: [5],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            var imagePath = '../asset/leave-home.png';
            drawImage(imagePath, 400, 140, 0);
            insertWords(`You fled the home you grew up in`, "30px", 350, 400);
        }
    },
    {
        activeVerse: 2,
        activeLines: [6],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            var imagePath = '../asset/refugee-camp.png';
            drawImage(imagePath,400, 150, 10);
            insertWords(`And ended up in a refugee camp`, "30px", 350, 400);
        }
    },
    {
        activeVerse: 3,
        activeLines: [1,2],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            var imagePath = '../asset/refugee-entry.png';
            drawImage(imagePath,500, 100, -100);
            insertWords(`Your asylum application was rejected`, "30px", 350, 350);
        }
    },
    {
        activeVerse: 3,
        activeLines: [3,4],
        svgUpdate: () => {
            insertWords(`Again`, "35px", 350, 400);
        }
    },
    {
        activeVerse: 3,
        activeLines: [5, 6],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            drawPieChart(rejectData, currentCountry, "% of rejected asylum applications");
        }
    },
    {
        activeVerse: 4,
        activeLines: [1],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            insertWords(`After 10 years in exile`, "40px", 350, 200);
            insertWords(`(the average is 10-26 years)`, "30px", 350, 250);
        }
    },
    {
        activeVerse: 4,
        activeLines: [2],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            var imagePath = '../asset/grown-man.png';
            drawImage(imagePath,300, 10, 100);
            insertWords(`You're in your mid-30's`, "25px", 350, 450);
        }
    },
    {
        activeVerse: 4,
        activeLines: [3],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            var imagePath1 = '../asset/grown-man.png';
            drawImage(imagePath1,200, 20, 200);
            var imagePath2 = '../asset/skyline.png';
            drawImage(imagePath2,600, 150, -150);
            insertWords(`finally received asylum in a new country`, "25px", 400, 450);
        }
    },
    {
        activeVerse: 4,
        activeLines: [4],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            insertWords(`You miss your family,`, "25px", 400,20);
        }
    },
    {
        activeVerse: 4,
        activeLines: [5, 6],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            drawBarChart(asylumData, currentCountry, `Top 5 asylum countries for ${currentCountry} people`);
            insertWords(`You miss your family,`, "25px", 400, 20);
            insertWords(`but they're separated in:`, "25px", 400, 50);
        }
    },
    {
        activeVerse: 5,
        activeLines: [3],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            createLineChart(populationData, currentCountry);
        }
    },
    {
        activeVerse: 5,
        activeLines: [4],
        svgUpdate: () => {
            svg.selectAll("*").remove();
            var imagePath2 = '../asset/tearseyes.png';
            drawImage(imagePath2,500, 120, -10);
        }
    }
]

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
    await d3.csv('../data/births.csv').then(function (data) {
        birthsData = data;
    });
}

function drawKeyframe(kfi) {
    // TODO get keyframe at index position
    let kf = keyframes[kfi];
    // TODO reset any active lines
    resetActiveLines();
    // TODO update the active verse
    updateActiveVerse(kf.activeVerse);
    // TODO update any active lines
    for (line of kf.activeLines) {
        updateActiveLine(kf.activeVerse, line);
    }
    // TODO update the svg
    // We need to check if their is an svg update function defined or not
    if(kf.svgUpdate){
        // If there is we call it like this
        kf.svgUpdate();
    }
}

function resetActiveLines() {
    d3.selectAll(".line").classed("active-line", false);
  }
// TODO write a function to update the active verse
function updateActiveVerse(id) {
    // Reset the current active verse - in some scenarios you may want to have more than one active verse, but I will leave that as an exercise for you to figure out
    d3.selectAll(".verse").classed("active-verse", false);
    // Update the class list of the desired verse so that it now includes the class "active-verse"
    d3.select("#verse" + id).classed("active-verse", true);
    scrollLeftColumnToActiveVerse(id);
  }

// TODO write a function to update the active line
function updateActiveLine(vid, lid) {
    // Select the correct verse
    let thisVerse = d3.select("#verse" + vid);
    // Update the class list of the relevant lines
    thisVerse.select("#line" + lid).classed("active-line", true);
  }

  function scrollLeftColumnToActiveVerse(id){
    var leftColumn = document.querySelector(".left-column-content");
    var activeVerse = document.getElementById("verse" + id);
    var verseRect = activeVerse.getBoundingClientRect();
    var leftColumnRect = leftColumn.getBoundingClientRect();

    // TODO calculate the desired scroll position
    var desiredScrollTop = verseRect.top + leftColumn.scrollTop - leftColumnRect.top - (leftColumnRect.height - verseRect.height) / 2;
    // TODO scroll to the desired position
    leftColumn.scrollTo({
        top: desiredScrollTop,
        behavior: 'smooth'
    })
}
function forwardClicked() {
    // Make sure we don't let the keyframeIndex go out of range
    if (keyframeIndex < keyframes.length - 1) {
      keyframeIndex++;
      drawKeyframe(keyframeIndex);
    }
}
  
function backwardClicked() {
    if (keyframeIndex > 0) {
      keyframeIndex--;
      drawKeyframe(keyframeIndex);
    }
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


function drawMap(geoData, countryName = "") {
    //get features of the country
    let feature = geoData.features.filter(d => { return d.properties.name == countryName });
    //get coordinates of the country
    let coordinates = feature[0].geometry.coordinates[0][0];
    // Map and projection
    const projection = d3.geoIdentity().fitSize([width, height], feature[0]);
    //path
    var path = d3.geoPath().projection(projection);
    // Draw the map
    var wrapper = svg.append("a")
                .attr("xlink:href", "https://www.unhcr.org/us/emergencies/venezuela-situation")
    var map = wrapper.append("g")
                     .style('fill', '#cb4335');
    map.selectAll("path")
        .data(feature)
        .join("path")
        .attr("d", path)
}

function drawInfant(length="",x="", y=""){
    const imagePath = '../asset/infant.png';
        svg.append('image')
            .attr('width', length)
            .attr('height', length)
            .attr('x', x)
            .attr('y', y)
            .attr('xlink:href', imagePath)
            .attr('transform', 'rotate(315, 100, 100)');
}


function drawImage(imagePath="",length="",x="", y=""){
        svg.append('image')
            .attr('width', length)
            .attr('height', length)
            .attr('x', x)
            .attr('y', y)
            .attr('xlink:href', imagePath);
}

function drawCrack(length="",x="", y=""){
    const imagePath = '../asset/crack.png';
        svg.append('image')
            .attr('width', length)
            .attr('height', length)
            .attr('x', x)
            .attr('y', y)
            .attr('xlink:href', imagePath);
}

function insertWords(text="", fontsize="", x="", y=""){
    svg.append("text")
        .attr("class", "inner-title")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("fill", " #b3fdd5 ")
        .attr("font-size", fontsize)
        .text(text);
}

function drawBarChart(data, countryName = "", title = "") {
    let feature = data.filter(d => { return d.Origin == countryName });
    let colourScale = d3.scaleLinear().domain([0, d3.max(feature, function(d){
        return parseInt(d.Applied);})]).range(["lightblue", "blue"]);
    var chart = svg.append('g')
    var w =  width/3/feature.length;
    var Hratio = w*4.5;
    console.log(Hratio)
    chart.selectAll("rect")
        .data(feature)
        .enter()
        .append("rect")
        .attr("width", w)
        .attr("height", function(d){
            return d.Applied/Hratio;
        })
        .attr("x", function(d, i){
            return (w+60) * i + 170;
        })
        .attr("y", function(d){
            return height/1.2 - d.Applied/Hratio;
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
            return (w+60) * i + 170 + w / 2; // Center the label below each bar
        })
        .attr("y", height / 1.2 + 20) // Position the labels below the bars
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
    const chartWidth = height / 1.5; 
    const chartHeight = height / 1.5; 
    const radius = Math.min(chartWidth, chartHeight) / 2;

    // Calculate the `y` coordinate for the pie chart
    const pieChartY = chartHeight/2 + 80;

    // Create a group (g) element for the pie chart within the global SVG
    const chart = svg.append("g")
        .attr("transform", `translate(${width / 2},${pieChartY})`);

    chart.append("text")
        .attr("class", "inner-title")
        .attr("dy", "-8.2em") // Adjust the vertical position as needed
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


function drawTable(data, columns, id, countryName = "") {
    let feature = data.filter(d => { return d.Country == countryName });
    
    // Assuming `svg` is defined as the selection of your SVG element
    var table = svg.append('foreignObject') // Use foreignObject to embed HTML content within an SVG
        .attr("width", 700) // Adjust width as needed
        .attr("height", 300) // Adjust height as needed
        .attr("id", id);
    
    var body = table.append('xhtml:body'); // Create an HTML body element within the foreignObject
    
    body.append("table");
    
    var thead = body.select('table').append('thead');
    var tbody = body.select('table').append('tbody');
    
    thead.append('tr')
        .selectAll('th')
        .data(columns)
        .enter()
        .append('th')
        .text(function (d) { return d });

    var rows = tbody.selectAll('tr')
        .data(feature)
        .enter()
        .append('tr');
    
    var cells = rows.selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
                return { column: column, value: row[column] };
            })
        })
        .enter()
        .append('td')
        .text(function (d) { return d.value });

    return table;
}

function createLineChart(data, countryName) {
    // Filter the data based on the country name
    let feature = data.filter(d => d.Country === countryName);
  
    // Create an array of objects with year and the corresponding number of refugees
    const refugeesData = feature.map(d => ({
      year: +d.Year,
      refugees: +d["Number of Refugees"]
    }));
  
    const margin = { top: 20, right: 20, bottom: 90, left: 120 };
  
    // Define the scales for x and y
    const xScale = d3.scaleLinear()
      .domain(d3.extent(refugeesData, d => d.year))
      .range([margin.left, width - margin.right]);
  
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(refugeesData, d => d.refugees)])
      .range([height - margin.bottom, margin.top]);
  

    const availableYears = Array.from(new Set(refugeesData.map(d => d.year)));

    console.log(refugeesData)
    // Add x-axis with filtered tick values
    svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale)
        .tickValues(availableYears) // Set the tick values to available years
        .tickFormat(d3.format('d'))) // Use 'd' format to display as integers
        .style('fill', 'none')
    .selectAll('.domain, .tick line')
    .style('stroke', 'white');
  
    // Add y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale))
      .selectAll('.domain, .tick line')
      .style('fill', 'none')
    .style('stroke', 'white') // Set the axis color to white
    .style('stroke-width', '1px');
  
    // Add x-axis label
    svg.append('text')
      .attr('x', width / 2 + 30)
      .attr('dy', height-40)
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .text('Year')
      .style('font-size', '25px');
    
      svg.selectAll('.tick text')
      .style('fill', 'white');

    // Add y-axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2 + 20)
      .attr('dy', margin.left - 80)
      .style('text-anchor', 'middle')
      .style('fill', 'white')
      .text(`Number of refugees from ${countryName}`)
      .style('font-size', '25px');
  
    // Create the line generator
    const line = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.refugees));
  
    // Append the line to the SVG
    svg.append('path')
      .datum(refugeesData)
      .attr('fill', 'none')
      .attr('stroke', '#880808')
      .style('shadow', '5px 5px 5px #EE4B2B')
      .attr('stroke-width', 5)
      .attr('d', line);
  }
  

async function initialise() {
    // load the data
    await loadData();
    // initalise the SVG
    initialiseSVG();
    currentCountry = "Venezuela";
    drawKeyframe(keyframeIndex);
    }

document.getElementById("forward-button").addEventListener("click", forwardClicked);
document.getElementById("backward-button").addEventListener("click", backwardClicked);

initialise();


function toggleDropdown() {
    var dropdown = document.getElementById("myDropdown");
    if (dropdown.style.display === "block") {
      dropdown.style.display = "none";
    } else {
      dropdown.style.display = "block";
    }
  }
  
  // Close the dropdown if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.btn')) {
      var dropdown = document.getElementById("myDropdown");
      if (dropdown.style.display === "block") {
        dropdown.style.display = "none";
      }
    }
  }


function setCountry(name) {
    currentCountry = name; // Set the countryName based on the selected option
    toggleDropdown(); // Close the dropdown
    // You can perform any actions with the selected country here
    console.log('Selected country: ' + countryName);
  }
  