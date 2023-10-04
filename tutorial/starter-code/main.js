let keyframeIndex = 0;

let keyframes = [
    {
        activeVerse: 1,
        activeLines: [1, 2, 3, 4]
    },
    {
        activeVerse: 2,
        activeLines: [1, 2, 3, 4]
    },
    {
        activeVerse: 3,
        activeLines: [1]
    },
    {
        activeVerse: 3,
        activeLines: [2]
    },
    {
        activeVerse: 3,
        activeLines: [3]
    },
    {
        activeVerse: 3,
        activeLines: [4]
    },
    {
        activeVerse: 4,
        activeLines: [1, 2, 3, 4]
    }
]
// TODO add svgUpdate fields to keyframes

// TODO define global variables
let svg = d3.select("#svg");
let keyframeIndex = 0;

// TODO add event listeners to the buttons

// TODO write an asynchronous loadData function
// TODO call that in our initalise function

// TODO draw a bar chart from the rose dataset
function drawRoseColours() {
    return
}

// TODO draw a bar chart from the violet dataset
function drawVioletColours() {
    return
}

function highlightColour(colourName, highlightColour) {
    // TODO select bar that has the right value
    // TODO update it's fill colour

    //TODO add a transition to make it smooth
    return
}

function drawBarChart(data, title) {
    svg.selectAll("*").remove();

    // Define the margin so that there is space around the vis for axes and labels
    const margin = { top: 30, right: 30, bottom: 50, left: 50 };
    let chartWidth = width - margin.left - margin.right;
    let chartHeight = height - margin.top - margin.bottom;

    // Create a 'group' variable to hold the chart, these are used to keep similar items together in d3/with svgs
    let chart = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define an x scale which will assign a spot on the x axis to each of the unique values of colour in the dataset
    let xScale = d3.scaleBand()
        .domain(data.map(d => d.colour))
        .range([0, chartWidth])
        .padding(0.1);

    let yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.count)])
        .nice()
        .range([chartHeight, 0]);

    // Create bars
    chart.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.colour)) // This arrow function notation is a more concise way of calling a function on each bar
        .attr("y", d => yScale(d.count))
        .attr("width", xScale.bandwidth())
        .attr("height", d => chartHeight - yScale(d.count))
        .attr("fill", "#999"); // Set the bars to be a light grey colour


    // Add x-axis
    chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text");

    // Add y-axis
    chart.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(yScale))
        .selectAll("text");

    // Add title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("fill", "white")
        .text(title);
}

// TODO Write a new function updateBarchart so that it updates the existing svg rather than rewriting it
// TODO Update the xScale domain to match new order
// TODO Update the yScale domain for new values

// TODO select all the existing bars
// TODO remove any bars no longer in the dataset
// TODO move any bars that already existed to their correct spot
// TODO Add any new bars

// TODO update the x and y axis

// TODO update the title

// TODO add some animation to this

function forwardClicked() {
    // TODO define behaviour when the forwards button is clicked
}

function backwardClicked() {
    // TODO define behaviour when the backwards button is clicked
}

function drawKeyframe(kfi) {
    // TODO get keyframe at index position

    // TODO reset any active lines

    // TODO update the active verse

    // TODO update any active lines

    // TODO update the svg
}

// TODO write a function to reset any active lines
function resetActiveLines() {
    return
}

// TODO write a function to update the active verse
function updateActiveVerse(id) {
    return
}

// TODO write a function to update the active line
function updateActiveLine(vid, lid) {
    return
}


// TODO write a function to scroll the left column to the right place
// TODO write a function to scroll the left column to the right place
// TODO select the div displaying the left column content
// TODO select the verse we want to display
// TODO calculate the bounding rectangles of both of these elements
// TODO calculate the desired scroll position
// TODO scroll to the desired position
// TODO call this function when updating the active verse

// TODO write a function to initialise the svg properly

function initialise() {
    // TODO draw the first keyframe

    // TODO load the data

    // TODO initalise the SVG

    // TODO make the word red clickable
}


initialise();
