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
    var yScale = d3.scaleLinear().domain([minValue, 5]).range([0, width]).range([height, 0]);

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
        console.log(xCoordinates[i]);
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

const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 550 - margin.left - margin.right,
    height = 230 - margin.top - margin.bottom;

//tooltip
let tooltip;

const nbins = 50;

function unitChart(data) {
    //console.log("width", width);

    //console.log("height", height);
    //console.log("data", data);

    tooltip = d3.select("body").append("div")
        .attr("class", "title")
        .style("opacity", 0);

    //set up svg
    var svg = d3.select("#unitchart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("id", "gUnitChart")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 15)
        .style("align", 'left')
        .text('Published books per year');

    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", -10)
        .attr("y", height + margin.top - 10)
        .style('font-family', 'Helvetica')
        .style('font-size', 12)
        .text("Years");

    const x = d3.scaleLinear()
        .rangeRound([0, width])
    x.domain(d3.extent(data, (d) => parseFloat(d.publishDate))).range([0, width]);

    svg.append("g")
        .attr("id", "gXAxis")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    //histogram binning
    const histogram = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(nbins))
        .value(function (d) { return parseInt(d.publishDate); })

    //binning data and filtering out empty bins
    const bins = histogram(data).filter(d => d.length > 0);
    //console.log("bin", bins);

    //g container for each bin
    let binContainer = svg.selectAll(".gBin")
        .data(bins);

    binContainer.exit().remove()

    let binContainerEnter = binContainer.enter()
        .append("g")
        .attr("class", "gBin")
        .attr("transform", d => `translate(${x(d.x0)}, ${height})`)

    //need to populate the bin containers with data the first time
    binContainerEnter.selectAll("circle.circleValue")
        .data(d => d.map((p, i) => {
            return {
                idx: i,
                title: p.title,
                value: parseInt(p.publishDate),
                author: p.Author,
                radius: (x(d.x1) - x(d.x0)) / 2
            }
        }))
        .enter()
        .append("circle")
        .attr("class", "circleValue itemValue")
        .attr("class", "enter")
        .attr("cx", 0) //g element already at correct x pos
        .attr("cy", function (d) {
            return - d.idx * 2 * d.radius - d.radius;
        })
        .attr("r", 0)
        .on("mouseover", function (d, i) {
            const [x, y] = d3.pointer(d);
            d3.select(this).transition()
                .duration('100')
                .attr("r", 7)
                .style("fill", "red");
            tooltip.transition()
                .duration(100)
                .style("opacity", 1);
            tooltip.html(i.title + "<br/> Author: " + i.author + "<br/>" + i.value)
                .style("left", (d.pageX) + "px")
                .style("top", (d.pageY) - 28 + "px");

            handleMouseOver(i);
        })
        .on('mouseleave', function (d, i) {
            d3.select(this).transition()
                .duration('200')
                .attr("r", 4)
                .style("fill", "#EDCA3A");
            tooltip.transition()
                .duration('200')
                .style("opacity", 0);
            handleMouseLeave();
        })
        .transition()
        .duration(500)
        .attr("r", function (d) {
            return (d.length == 0) ? 0 : d.radius;
        });

}

//#endregion

//#region Update charts
function updateUnitChar(data) { }
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
        .attr("r", 2)
        .style("fill", "#EDCA3A");
}
//#endregion