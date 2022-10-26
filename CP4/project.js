let csvdata;
var allGenres = [];
var allPublishers = [];

function init() {
    d3.csv("resultshandmade2.csv").then(function (data) {
        filldropDown_genre(data);
        filldropDown_Author(data);
        scatterPlot(data);
        sankeyChart(data);
        unitChart(data);
        csvdata = data;
    });
}

//#region  Rating 

function ratingclick(value) {

    /*removePieChart();

    console.log("value", value);
    console.log(csvdata);

    const filteredResult = csvdata.filter((item) => {
        console.log(parseFloat(item.rating))
        return (parseFloat(item.rating) >= value && parseFloat(item.rating) < value);
    });

    console.log("filteredResult", filteredResult);

    if (filteredResult.length > 0) {
        dataPieChart(filteredResult);
    }*/
}
//#endregion

//#region Dropdown list for Genre

//fill out dropdown list information
function filldropDown_genre(data) {

    for (var i = 0; i < data.length; i++) {
        var genres = data[i].genres;
        //Remove all special characteres    
        genres = genres.replaceAll("[", "").replaceAll("]", "").replaceAll("'", "");
        //set in an array allgenres by item      
        var arrayGenre = genres.split(", ");

        for (var j = 0; j < arrayGenre.length; j++) {
            allGenres.push(arrayGenre[j]);
        }
    }
    //Sort all genre
    allGenres.sort();
    allGenres.unshift("All genre");
    const genreDropDown = document.getElementById("genres");

    //Fill out information inside dropdown list
    for (var i = 0; i < allGenres.length; i++) {
        let option = document.createElement("option");
        option.setAttribute("value", allGenres[i]);

        var genreName = allGenres[i];
        let optionText = document.createTextNode(genreName);
        option.appendChild(optionText);

        genreDropDown.appendChild(option);
    }

    removeduplicate();
}

//remove duplicate data for dropdown list
function removeduplicate() {
    var mycode = {};
    $("select[id='genres'] > option").each(function () {
        if (mycode[this.text]) {
            $(this).remove();
        } else {
            mycode[this.text] = this.value;
        }
    });
}

function selectDropDown(value) {
    /*if (value == "All genre") {
        removePieChart();
        dataPieChart(csvdata);
    }
    else {
        const filteredResult = csvdata.filter((item) => {
            return (item.genres.indexOf(value) >= 0);
        });

        if (filteredResult.length > 0) {
            removePieChart();
            dataPieChart(filteredResult);
        }
    }*/
}

function removePieChart() {
    var div = document.getElementById('unitchart');
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}


//#endregion

//#region Slider by year 

$(function () {
    $("#slider-range").slider({
        range: true,
        min: 0,
        max: 500,
        values: [75, 300],
        slide: function (event, ui) {
            $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
        }
    });
    $("#amount").val("$" + $("#slider-range").slider("values", 0) +
        " - $" + $("#slider-range").slider("values", 1));
});
//#endregion

//#region sankeyChart 
function sankeyChart(data) {
}
//#endregion

//#region  Scatter plot 

function scatterPlot(data) {

    var regressionPoints = getSpearmanLinearRegression(data);

    var div = d3.select("body").append("div")
        .attr("id", "popupdiv")
        .attr("class", "title")
        .style("opacity", 0);

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 520 - margin.left - margin.right,
        height = 280 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("id", "gScatterPlot")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var minValue = d3.min(data, (d) => Math.round(parseFloat(d.rating), -2));

    // Scales
    var xScale = d3.scaleLinear().domain(d3.extent(data, (d) => parseFloat(d.awards))).range([1, width])
    var yScale = d3.scaleLinear().domain([0, 5]).range([0, width]).range([height, 0]);

    // Title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 15)
        .text('Rating vs. Number of Awards');

    // X label
    svg.append('text')
        .attr('x', width / 2 + 150)
        .attr('y', height + 30)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 12)
        .text('Awards Number');

    // Y label
    svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(-35,45)rotate(-90)')
        .style('font-family', 'Helvetica')
        .style('font-size', 12)
        .text('Rating');

    // Create X axis
    svg.append("g")
        .attr("id", "gScatterPlot")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    // Create Y axis
    svg.append("g")
        .attr("id", "gYAxis")
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(yScale));

    //Line Spearman
    line = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))

    // Create dots
    svg.append('g')
        .selectAll("dots")
        .data(data, (d) => d.title)
        .join("circle")
        .attr("class", "dots itemValue")
        .attr("cx", (d) => xScale(parseFloat(d.awards)))
        .attr("cy", (d) => yScale(parseFloat(d.rating)))
        .attr("r", 2)
        .style("fill", "#EDCA3A")
        .on("mouseover", (event, d) => handleMouseOver(d))
        .on("mouseleave", (event, d) => handleMouseLeave())
        .append("title")
        .html((d) => d.title + ", Author: " + d.Author);

    svg.append('path')
        .classed('regressionLine', true)
        .datum(regressionPoints)
        .attr('d', line)
        .style("stroke", "#43A047")
        .style("fill", "none")
        .style("stroke-width", 2)
        .style("stroke-dasharray", 2);
}

function getSpearmanLinearRegression(data) {
    var ratingVsAward = [];

    data.sort(function (x, y) {
        return x.awards - y.awards;
    });


    data.forEach(function (d) {
        ratingVsAward.push({
            x: +d.awards,
            y: +d.rating
        });
    });

    var linearRegression1 = linearRegressionfunction(ratingVsAward);

    linearRegressionLine = ss.linearRegressionLine(linearRegression1);

    var regressionPoints = [];

    const firstX = ratingVsAward[0].x;
    const lastX = ratingVsAward.slice(-1)[0].x;
    const xCoordinates = [firstX, lastX];

    for (var i = 0; i < xCoordinates.length; i++) {        
        regressionPoints.push({
            x: xCoordinates[i],
            y: linearRegressionLine(xCoordinates[i])
        })
    }
    return regressionPoints;
}

function linearRegressionfunction(initialData) {
    return ss.linearRegression(initialData.map(d => [d.x, d.y]));

}
//#endregion

//#region unit Chart with dropdown

//#region Dropdown Author
//fill out dropdown list information
function filldropDown_Author(data) {

    data.sort((a, b) => a.Author.localeCompare(b.Author));

    const authorDropDown = document.getElementById("authors");

    //Fill out information inside dropdown list
    for (var i = 0; i < data.length; i++) {
        let option;
        let optionText;
        if (i == 0) {
            option = document.createElement("option");
            option.setAttribute("value", "All Authors");
            optionText = document.createTextNode("All Authors");
            option.appendChild(optionText);
            authorDropDown.appendChild(option);
        }
        option = document.createElement("option");
        option.setAttribute("value", data[i].Author);
        optionText = document.createTextNode(data[i].Author);
        option.appendChild(optionText);
        authorDropDown.appendChild(option);

    }
    removeduplicate_author();
}

//remove duplicate data for dropdown list
function removeduplicate_author() {
    var mycode = {};
    $("select[id='authors'] > option").each(function () {
        if (mycode[this.text]) {
            $(this).remove();
        } else {
            mycode[this.text] = this.value;
        }
    });
}

function selectDropDownAuthor(value) {

    //Remove missing values
    var dataFilter = csvdata.filter(function (d) { return d.Author == value });
    //console.log(dataFilter);

    updateUnitChar(dataFilter);
}
//#endregion
//tooltip
let tooltip;

function unitChart(data) {

    tooltip = d3.select("body").append("div")
        .attr("class", "title")
        .style("opacity", 0);

    //set up svg
    var grouped_data = d3.group(data, d => d.publishDate);

    var newData = [];

    grouped_data.forEach(element => {

        for (var i = 0; i < element.length; i++) {
            if (element[i].publishDate !== "Missing") {
                newData.push({
                    title: element[i].title,
                    publishDate: element[i].publishDate,
                    author: element[i].Author,
                    position: i
                });
            }
        }
    });    

    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 520 - margin.left - margin.right,
        height = 280 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#unitchart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("id", "gScatterPlot")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var minValue = d3.min(newData, (d) => Math.round(parseInt(d.position), -2));
    var maxValue = d3.max(newData, (d) => Math.round(parseInt(d.position), -2));

    // Scales
    var xScale = d3.scaleLinear().domain(d3.extent(newData, (d) => parseFloat(d.publishDate))).range([1, width])
    var yScale = d3.scaleLinear().domain([minValue, maxValue]).range([0, width]).range([height, 0]);

    // Title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 15)
        .text('Published books per Year');

    // X label
    svg.append('text')
        .attr('x', width / 2 + 220)
        .attr('y', height + 30)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 12)
        .text('Years');

    // Create X axis
    svg.append("g")
        .attr("id", "gScatterPlot")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    // Create Y axis
    svg.append("g")
        .attr("id", "gYAxis")
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(yScale))
        .attr("opacity", "0");

    // Create dots
    svg.append('g')
        .selectAll("dots")
        .data(newData, (d) => d.title)
        .join("circle")
        .attr("class", "dots itemValue")
        .attr("cx", (d) => xScale(parseFloat(d.publishDate)))
        .attr("cy", (d) => yScale(parseFloat(d.position)) - 5)
        .attr("r", 4)
        .style("fill", "#EDCA3A")
        .on("mouseover", (event, d) => handleMouseOver(d))
        .on("mouseleave", (event, d) => handleMouseLeave())
        .append("title")
        .html((d) => d.title + ", Author: " + d.author + ", " + d.publishDate);
}


//#endregion

//#region Update charts
function updateUnitChar(data) {

}
//#endregion

//#region  Communication between charts
function handleMouseOver(item) {

    d3.selectAll(".itemValue")
        .filter(function (d, i) {
            return d.title == item.title;
        })
        .attr("r", 10)
        .style("fill", "red")
}

function handleMouseLeave() {
    d3.selectAll(".itemValue").transition()
        .attr("r", 4)
        .style("fill", "#EDCA3A");
}
//#endregion