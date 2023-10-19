let keyframeIndex = 0;
const width = 500;
const height = 400;

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
        svgUpdate: () => highlightColour("", "")
    },
    {
        activeVerse: 4,
        activeLines: [1, 2, 3, 4]
    }
]
// TODO add svgUpdate fields to keyframes

// TODO define global variables
let svg = d3.select("#svg");

// TODO add event listeners to the buttons
document.getElementById("forward-button").addEventListener("click", forwardClicked);
document.getElementById("backward-button").addEventListener("click", backwardClicked);
// TODO write an asynchronous loadData function
let roseChartData;
let violetChartData;

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

// TODO call that in our initalise function

// TODO draw a bar chart from the rose dataset
async function drawRoseColours() {
    updateBarChart(roseChartData, "Distribution of Rose Colours");
}

async function drawVioletColours() {
    updateBarChart(violetChartData, "Distribution of Violet Colours");
}

function highlightColour(colourName, highlightColour) {
    // TODO select bar that has the right value
    svg.selectAll(".bar")
    // TODO update it's fill colour
        .attr("fill", function (d) {
            // We only want to update the colour field is equal to what we have passed
            // Otherwise we want to reset the colour value to the default (#999)
            if (d.colour === colourName) {
                return highlightColour;
            } else {
                return "#999"
            }
        })
    //TODO add a transition to make it smooth
}

// Declare global variables for the chart

// This will hold where the actual section of the graph where visual marks, in our case the bars, are being displayed
// Additionally we'll store the dimensions of this space too
let chart;
let chartWidth;
let chartHeight;
// Declare both scales too
let xScale;
let yScale;

// TODO Write a new function updateBarchart so that it updates the existing svg rather than rewriting it
function updateBarChart(data, title = "") {
    // TODO Update the xScale domain to match new order
    // TODO Update the yScale domain for new values
    xScale.domain(data.map(d => d.colour));
    yScale.domain([0, d3.max(data, d => d.count)]).nice();
    // TODO select all the existing bars
    const bars = chart.selectAll(".bar")
            .data(data, d => d.colour);
    // TODO remove any bars no longer in the dataset
    bars.exit().remove();
    // TODO move any bars that already existed to their correct spot
    bars.attr("x", d => xScale(d.colour))
            .attr("y", d => yScale(d.count))
            .attr("height", d => chartHeight - yScale(d.count));
    // TODO Add any new bars
    bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => xScale(d.colour))
            .attr("width", xScale.bandwidth())
            .attr("fill", "#999")
            .attr("y", d => yScale(d.count))
            .attr("height", d => chartHeight - yScale(d.count));
    // TODO update the x and y axis
    chart.select(".x-axis")
            .call(d3.axisBottom(xScale));

        chart.select(".y-axis")
            .call(d3.axisLeft(yScale));
    // TODO update the title
    if (title.length > 0) {
        svg.select("#chart-title")
            .text(title);
    }
    // TODO add some animation to this
}

function forwardClicked() {
    // TODO define behaviour when the forwards button is clicked
    if (keyframeIndex < keyframes.length - 1) {
        keyframeIndex++;
        drawKeyframe(keyframeIndex);
    }
}

function backwardClicked() {
    // TODO define behaviour when the backwards button is clicked
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
    if (kf.svgUpdate) {
        kf.svgUpdate();
    }
}

// TODO write a function to reset any active lines
function resetActiveLines() {
    d3.selectAll(".line").classed("active-line", false);
}

// TODO write a function to update the active verse
function updateActiveVerse(id) {
    d3.selectAll(".verse").classed("active-verse", false);
    d3.select("#verse" + id).classed("active-verse", true);
    scrollLeftColumnToActiveVerse(id);
}

// TODO write a function to update the active line
function updateActiveLine(vid, lid) {
    let thisVerse = d3.select("#verse" + vid);
    thisVerse.select("#line" + lid).classed("active-line", true);
}


// TODO write a function to scroll the left column to the right place
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
        .style("fill", "white")
        .text("");
}

function makeRedClickable() {
    d3.select(".red-span").on("click", () => highlightColour("Red", "red"));
}

function makeRedBarHoverable() {
    const redBar = chart.selectAll(".bar").filter(d => d.colour === "Red");

    // Add a mouseover event listener
    redBar.on("mouseover", () => {
        console.log("Red bar hovered");
        d3.selectAll(".red-span").classed("red-text", true); //This will select all elements with the class name "red-span" not just one.
    });

};

async function initialise() {
    // TODO load the data
    await loadData();
    // TODO initalise the SVG
    initialiseSVG();
    // TODO draw the first keyframe
    drawKeyframe(keyframeIndex);
    // TODO make the word red clickable
    makeRedBarHoverable();
}


initialise();
