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

// TODO write a function that highlights every bar in the colour it represents

// TODO update the keyframe displaying the 4th line of the 3rd verse so that every bar gets highlighted in its respective colour

// TODO update keyframes for verse 4 to show each line one by one

// TODO write a function which will display the rose data sorted from highest to lowest
// HINT Be careful when sorting the data that you don't change the rosechartData variable itself, otherwise when you a user clicks back to the start it will always be sorted
// HINT If you have correctly implemented your updateBarchart function then you won't need to do anything extra to make sure it animates smoothly (just pass a sorted version of the data to updateBarchart) 


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

// TODO recreate the updateBarchart function from the tutorial
function updateBarChart() {
    // TODO Update the xScale domain to match new order
    // TODO Update the yScale domain for new values

    // TODO select all the existing bars
    // TODO remove any bars no longer in the dataset
    // TODO move any bars that already existed to their correct spot
    // TODO Add any new bars

    // TODO update the x and y axis

    // TODO update the title

    // TODO add animation to ALL aspects of updating the bar chart (removing bars, moving bars, adding bars, updating axes, updating the title)
    // HINTS for adding animation remember to call .transition().duration(num_of_ms) immediately before the fields you change
    // for removing bars - you want the height to go down to 0 and the y value to change too. Then you can call .remove()
    // for moving existing bars - you'll have to update their x, y, and height values
    // for adding new bars - see the tutorial
    // for the axes all you need to do is add a transition before the .call function we use in the tutorial
    // for the title .text is the function that actually changes the title

}



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
// TODO select the div displaying the left column content
// TODO select the verse we want to display
// TODO calculate the bounding rectangles of both of these elements
// TODO calculate the desired scroll position
// TODO scroll to the desired position
// TODO call this function when updating the active verse


// TODO write a function to initialise the svg properly

// TODO write a function to make every instance of "red" and "purple" in the poem hoverable. When you hover the corresponding bar in the chart (if it exists) should be highlighted in its colour
// HINT when you 'mouseout' of the word the bar should return to it's original colour
// HINT you will wamt to edit the html and css files to achieve this
// HINT this behaviour should be global at all times so make sure you call it when you intialise everything

// TODO write a function so that when you click on the red bar when verse 4 is displayed (and only when verse 4 is displayed) every instance of the word red in the poem are highlighted in red
// HINT you will need to update the keyframes to do this and ensure it isn't global behaviour
// HINT you will again have to edit the html and css

// TODO update the html to add a fifth verse
// TODO add keyframe(s) for your new fifth verse
// TODO the first keyframe should update the svg and display a pie chart of either the roses or violets dataset

function initialise() {
    // TODO draw the first keyframe

    // TODO load the data

    // TODO initalise the SVG


}


initialise();

