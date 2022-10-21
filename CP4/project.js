let csvdata;
var allGenres = [];
var allPublishers = [];

function init() {
    d3.csv("resultshandmade2.csv").then(function (data) {
        filldropDown_genre(data);
        filldropDown_publisher(data);
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

    var div = d3.select("body").append("div")
        .attr("class", "title")
        .style("opacity", 0);

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 460 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#my_dataviz")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Scales
    var xScale = d3.scaleLinear().domain(d3.extent(data, (d) => parseFloat(d.awards))).range([0, width])
    var yScale = d3.scaleLinear().domain([0, 5]).range([0, width]).range([height, 0]);

    // Title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', 10)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text('Scatter Plot');

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
        .attr('transform', 'translate(0,45)rotate(-90)')
        .style('font-family', 'Helvetica')
        .style('font-size', 12)
        .text('Liked Percentage');

    // Create X axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    // Create Y axis
    svg.append("g")
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(yScale));

    // Create dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(parseFloat(d.awards)))
        .attr("cy", (d) => yScale(parseFloat(d.rating)))
        .attr("r", 2)
        .style("fill", "blue")
        .on("mouseover", function (d, i) {
            const [x, y] = d3.pointer(d);
            d3.select(this).transition()
                .duration('100')
                .attr("r", 7)
                .style("fill", "red");
            div.transition()
                .duration(100)
                .style("opacity", 1);
            div.html(i.title)
                .style("left", (x + 50) + "px")
                .style("top", (y + 100) + "px");
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('200')
                .attr("r", 2)
                .style("fill", "blue");
            div.transition()
                .duration('200')
                .style("opacity", 0);
        });

    /*************************************** End --> Scatter plot ***************************************/
}
//#endregion

//#region unit Chart with dropdown
const margin = { top: 10, right: 30, bottom: 30, left: 30 },
    width = 800 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

//x scales
const x = d3.scaleLinear()
    .rangeRound([0, width]);

//tooltip
const tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//#region Dropdown Publisher
//fill out dropdown list information
function filldropDown_publisher(data) {

    const genreDropDown = document.getElementById("publishers");

    //Fill out information inside dropdown list
    for (var i = 0; i < data.length; i++) {
        let option = document.createElement("option");
        option.setAttribute("value", data[i].publisher);
        let optionText = document.createTextNode(data[i].publisher);
        option.appendChild(optionText);

        genreDropDown.appendChild(option);
    }
    removeduplicate_publisher();
}

//remove duplicate data for dropdown list
function removeduplicate_publisher() {
    var mycode = {};
    $("select[id='publishers'] > option").each(function () {
        if (mycode[this.text]) {
            $(this).remove();
        } else {
            mycode[this.text] = this.value;
        }
    });
}

function selectDropDownPublishers(value) {

    //Remove missing values
    var dataFilter = data.filter(function (d) { return d.publishDate !== "Missing" });

    var isFinished = false;
    var startYear = parseInt(dataFilter[0].publishDate.slice(0, -1) + '0');

    var lastYearPosition = dataFilter.length - 1;
    var lastYear = dataFilter[lastYearPosition].publishDate;

    for (var i = startYear; i <= lastYear; i = i + 10) {

        var endYear = parseInt(startYear + 10);
        //console.log("startYear", startYear, "endYear", endYear, "lastYear", lastYear, "i ", i);

        //GroupByYear 
        pieChartData = dataFilter.filter(function (d) { return d.publishDate >= startYear && d.publishDate < endYear });
        pieChart(getAuthorByBook(pieChartData), startYear, endYear);

        startYear = endYear;

    }
}
//#endregion

function unitChart(data) {
    console.log("data", data);

    var div = d3.select("body").append("div")
        .attr("class", "title")
        .style("opacity", 0);

    //set up svg
    const svg = d3.select("#unitchart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            `translate(${margin.left}, ${margin.top})`);

    x.domain(d3.extent(data, (d) => parseFloat(d.publishDate))).range([0, width]);

    svg.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    const nbins = 50;

    //histogram binning
    const histogram = d3.histogram()
        .domain(x.domain())
        .thresholds(x.ticks(nbins))
        .value(function (d) { return parseInt(d.publishDate); })

    //binning data and filtering out empty bins
    const bins = histogram(data).filter(d => d.length > 0);
    console.log("bin", bins);

    //g container for each bin
    let binContainer = svg.selectAll(".gBin")
        .data(bins);

    binContainer.exit().remove()

    let binContainerEnter = binContainer.enter()
        .append("g")
        .attr("class", "gBin")
        .attr("transform", d => `translate(${x(d.x0)}, ${height})`)

    //need to populate the bin containers with data the first time
    binContainerEnter.selectAll("circle")
        .data(d => d.map((p, i) => {
            return {
                idx: i,
                name: p.title,
                value: parseInt(p.publishDate),
                radius: (x(d.x1) - x(d.x0)) / 2
            }
        }))
        .enter()
        .append("circle")
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
            div.transition()
                .duration(100)
                .style("opacity", 1);
            div.html(i.title)
                .style("left", (x + 50) + "px")
                .style("top", (y + 100) + "px");
        })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('200')
                .attr("r", 7)
                .style("fill", "#EDCA3A");
            div.transition()
                .duration('200')
                .style("opacity", 0);
        })
        .transition()
        .duration(500)
        .attr("r", function (d) {
            return (d.length == 0) ? 0 : d.radius;
        })
}

//#endregion

//#region  Communication between charts
function handleMouseOver(item) {
    d3.selectAll(".itemValue")
        .filter(function (d, i) {
            return d.title == item.title;
        })
        .attr("r", 10)
        .style("fill", "red");
}
//#endregion