// TODO add svgUpdate fields to keyframes
// TODO the first keyframe should update the svg and display a pie chart of either the roses or violets dataset
let keyframes = [
    {
        activeVerse: 1,
        activeLines: [1, 2, 3, 4],
        svgUpdate: drawRoseColours
    },
    {
        activeVerse: 2,
        activeLines: [1, 2, 3, 4],
        svgUpdate: drawVioletColours
    },
    {
        activeVerse: 3,
        activeLines: [1],
        svgUpdate: drawRoseColours
    },
    {
        activeVerse: 3,
        activeLines: [2],
        svgUpdate: () => highlightColour("Red", "red")
    },
    {
        activeVerse: 3,
        activeLines: [3],
        svgUpdate: () => highlightColour("White", "white")
    },
    {
        activeVerse: 3,
        activeLines: [4],
        // TODO update the keyframe displaying the 4th line of the 3rd verse so that every bar gets highlighted in its respective colour
        svgUpdate: () => highlightColours(["Red", "Pink", "White", "Yellow", "Orange"])
    },
    // TODO update keyframes for verse 4 to show each line one by one
    {
        activeVerse: 4,
        activeLines: [1],
        svgUpdate: () => highlightColour("", "")
    },
    {
        activeVerse: 4,
        activeLines: [2]
    },
    {
        activeVerse: 4,
        activeLines: [3],
        svgUpdate: drawSortedRoseColours
    },
    {
        activeVerse: 4,
        activeLines: [4]
    },
    {
        // TODO add keyframe(s) for your new fifth verse
        activeVerse: 5,
        activeLines: [1, 2, 3, 4],
        svgUpdate: () => drawVioletPieChart(violetChartData,"hahah")
    }
]


// TODO define global variables
let svg = d3.select("#svg");
let keyframeIndex = 0;
const width = 500;
const height = 400;
let roseChartData;
let violetChartData;

// TODO add event listeners to the buttons
document.getElementById("forward-button").addEventListener("click", forwardClicked);
document.getElementById("backward-button").addEventListener("click", backwardClicked);

// TODO write an asynchronous loadData function
// TODO call that in our initalise function
async function loadData() {
    // Because d3.json() uses promises we have to use the keyword await to make sure each line completes before moving on to the next line
    await d3.json("../data/rose_colours.json").then(data => {
        // Inside the promise we set the global variable equal to the data being loaded from the file
        roseChartData = data;
    });

    await d3.json("../data/violet_colours.json").then(data => {
        violetChartData = data;
    });
}


// TODO draw a bar chart from the rose dataset
function drawRoseColours() {
    updateBarChart(roseChartData, "Distribution of Rose Colours");
}

// TODO draw a bar chart from the violet dataset
function drawVioletColours() {
    updateBarChart(violetChartData, "Distribution of Violet Colours");
}

function drawVioletPieChart() {
    drawPieChart(violetChartData, "Pie Chart of Violet Colours");
}

// TODO write a function which will display the rose data sorted from highest to lowest
// HINT Be careful when sorting the data that you don't change the rosechartData variable itself, otherwise when you a user clicks back to the start it will always be sorted
// HINT If you have correctly implemented your updateBarchart function then you won't need to do anything extra to make sure it animates smoothly (just pass a sorted version of the data to updateBarchart) 
function drawSortedRoseColours() {
    // Create a copy of the roseChartData
    const sortedData = [...roseChartData];
    // Sort the data
    sortedData.sort((a, b) => b.count - a.count);
    // Insert sortedData into updateBarChart
    updateBarChart(sortedData, "Distribution of Rose Colours (Sorted)");
}


function highlightColour(colourName, highlightColour) {
    // TODO select bar that has the right value
    svg.selectAll(".bar")
    //TODO add a transition to make it smooth
        .transition()
        .duration(1000)
        // TODO update it's fill colour
        .attr("fill", function (d) {
            // We only want to update the colour field is equal to what we have passed
            // Otherwise we want to reset the colour value to the default (#999)
            if (d.colour === colourName) {
                return highlightColour;
            } else {
                return "#999"
            }
        });
}

// TODO write a function that highlights every bar in the colour it represents
function highlightColours(colorValues) {
    colorValues.forEach(value => {
        // Find the bar with the specified value
        let bar = svg.selectAll(".bar")
            .filter(d => d.colour === value);
        // Highlight the bar with the specified color
        bar.transition()
            .duration(500) // Adjust the duration for animation
            .attr("fill", value);
    });
}

let chart;
let chartWidth;
let chartHeight;
// Declare both scales too
let xScale;
let yScale;

/////////////////////////// PIE CHART ///////////////////////////
function drawVioletPieChart(data, title = "") {
    svg.attr("width", width);
    svg.attr("height", height);
    svg.selectAll("*").remove();

    chart = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");  

        let radius = 300 / 2;
        var color = d3.scaleOrdinal(['Purple','Blue','Lavender','White','Pink']);
            // Generate the pie
            var pie = d3.pie().value(function(d) { return d.count; });
            // Generate the arcs
            var arc = d3.arc()
                        .innerRadius(0)
                        .outerRadius(radius);
            //Generate groups
            var arcs = chart.selectAll("arc")
                        .data(pie(data))
                        .enter()
                        .append("g")
                        .attr("class", "arc")
    
            //Draw arc paths
            arcs.append("path")
                .attr("fill", function(d, i) {
                    return color(i);
                })
                .attr("d", arc);

                arcs.append("text")
                .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
                .attr("text-anchor", "middle")
                .text(function(d) { return d.data.colour; });

}


// TODO Write a new function updateBarchart so that it updates the existing svg rather than rewriting it
function updateBarChart(data, title = "") {
    // TODO Update the xScale domain to match new order
    // TODO Update the yScale domain for new values
    xScale.domain(data.map(d => d.colour));
    yScale.domain([0, d3.max(data, d => d.count)]).nice();
    // TODO select all the existing bars
    const bars = chart.selectAll(".bar")
        .data(data, d => d.colour);

    // TODO update the x and y axis
    // for the axes all you need to do is add a transition before the .call function we use in the tutorial
    chart.select(".x-axis")
        .transition()
        .duration(500)
        .call(d3.axisBottom(xScale));

    chart.select(".y-axis")
        .transition()
        .duration(500)
        .call(d3.axisLeft(yScale));

    // TODO remove any bars no longer in the dataset
    // for removing bars - you want the height to go down to 0 and the y value to change too. Then you can call .remove()
    bars.exit()
        .transition()
        .duration(1000)
        .attr("y", chartHeight)
        .attr("height", 0)
        .remove();
    // TODO move any bars that already existed to their correct spot
    // for moving existing bars - you'll have to update their x, y, and height values
    bars.attr("x", d => xScale(d.colour))
        .attr("y", d => yScale(d.count))
        .attr("height", d => chartHeight - yScale(d.count))
        .transition()
        .duration(1500);

    // TODO Add any new bars
    bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.colour))
            .attr("width", xScale.bandwidth())
            .transition()
            .duration(2000)
            .attr("fill", "#999")
            .attr("y", d => yScale(d.count))
            .attr("height", d => chartHeight - yScale(d.count));
         
    // TODO update the title
    // for the title .text is the function that actually changes the title
    if (title.length > 0) {
        svg.select("#chart-title")
        .transition()
        .duration(1000)
        .text(title);
    }
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

// TODO write a function to reset any active lines
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

// TODO write a function to scroll the left column to the right place
// TODO call this function when updating the active verse
function scrollLeftColumnToActiveVerse(id){
    // TODO select the div displaying the left column content
    var leftColumn = document.querySelector(".left-column-content");
    // TODO select the verse we want to display
    var activeVerse = document.getElementById("verse" + id);
    // TODO calculate the bounding rectangles of both of these elements
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

// TODO write a function to initialise the svg properly
function initialiseSVG() {
    svg.attr("width", width);
    svg.attr("height", height);

    svg.selectAll("*").remove();

    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    chartWidth = width - margin.left - margin.right;
    chartHeight = height - margin.top - margin.bottom;

    chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    xScale = d3.scaleBand()
        .domain([])
        .range([0, chartWidth])
        .padding(0.1);

    yScale = d3.scaleLinear()
        .domain([])
        .nice()
        .range([chartHeight, 0]);

    // Add x-axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text");

    // Add y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .selectAll("text");
    
    
    // Add title
    svg.append("text")
        .attr("id", "chart-title")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .text("");
}



// TODO write a function to make every instance of "red" and "purple" in the poem hoverable. When you hover the corresponding bar in the chart (if it exists) should be highlighted in its colour
// HINT when you 'mouseout' of the word the bar should return to it's original colour
// HINT you will wamt to edit the html and css files to achieve this
// HINT this behaviour should be global at all times so make sure you call it when you intialise everything
function makeTextHoverable() {
    d3.select(".red-span").on("mouseover", () => highlightColour("Red", "red"));
    d3.select(".red-span").on("mouseout", () => highlightColour("", ""));
    d3.select(".purple-span").on("mouseover", () => highlightColour("Purple", "purple"));
    d3.select(".purple-span").on("mouseout", () => highlightColour("", ""));
}

// TODO write a function so that when you click on the red bar when verse 4 is displayed (and only when verse 4 is displayed) every instance of the word red in the poem are highlighted in red
// HINT you will need to update the keyframes to do this and ensure it isn't global behaviour
// HINT you will again have to edit the html and css
let clicked = false;
function makeRedBarClickable() {
    const redBar = chart.selectAll(".bar").filter(d => d.colour === "Red");
    // Add a mouseover event listener
    redBar.on("click", () => {
        if (!clicked) {
            d3.selectAll(".red-span").classed("red-text", true);
            clicked = true;
        }
        else{
            d3.selectAll(".red-span").classed("red-text", false);
            clicked = false;
        }
    });
};

async function initialise() {
    // TODO load the data
    await loadData();
    // TODO initalise the SVG
    initialiseSVG();
    // TODO draw the first keyframe
    drawKeyframe(keyframeIndex);
    // TODO make the red bar hoverable
    makeRedBarClickable();
}


initialise();

