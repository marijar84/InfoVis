let csvdata;
var allGenres = [];
var allPublishers = [];

function init() {
    d3.csv("resultshandmade2.csv").then(function (data) {
        filldropDown_genre(data);
        filldropDown_Author(data);
        scatterPlot(data);
        unitChart(data);
        sankeyChart(data);
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
    //dataSankey(data);
    // set the dimensions and margins of the graph
    var margin = { top: 20, right: 5, bottom: 10, left: 25 },
        width = 700 - margin.left - margin.right,
        height = 580 - margin.top - margin.bottom;

    // format variables
    var formatNumber = d3.format(",.0f"), // zero decimal places
        format = function (d) { return formatNumber(d); },
        color = d3.scaleOrdinal(d3.schemeCategory10);

    // append the svg object to the body of the page
    var svg = d3.select("#sankey").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(8)
        .nodePadding(8)
        .size([width, height]);

    var path = sankey.links();

    // load the data
    //d3.json("sankey.json").then(function (sankeydata) {
    graph = sankey(dataSankey(data));

    // add in the links
    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", d3.sankeyLinkHorizontal())
        .attr("stroke-width", 1)
        .on("mouseover", (event, d) => handleMouseOver(d))
        .on("mouseleave", (event, d) => handleMouseLeave());

    // add the link titles
    link.append("title")
        .text(function (d) {
            return d.source.name + " → " + d.target.name + "\n" +
                "Title: " + d.title + "\n" +
                "Author: " + d.author;
        });

    // add in the nodes
    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .style("font", "11px times")
        .style('font-family', 'Helvetica')
        .on("mouseover", (event, d) => handleMouseOverRect(d));


    // add the rectangles for the nodes
    node.append("rect")
        .attr("x", function (d) {
            return d.x0;
        })
        .attr("y", function (d) { return d.y0; })
        .attr("height", function (d) { return d.y1 - d.y0; })
        .attr("width", sankey.nodeWidth())
        .style("fill", "green")
        /*function (d) {
            return d.color = color(d.name.replace(/ .*//*, ""));
})*/
        .style("stroke", function (d) {
            return d3.rgb(d.color).darker(0.1);
        })
        .append("title")
        .text(function (d) {
            return d.name;
        });

    // add in the title for the nodes
    node.append("text")
        .attr("x", function (d) { return d.x0 - 6; })
        .attr("y", function (d) { return (d.y1 + d.y0) / 2; })
        .attr("dy", "0.5em")
        .attr("text-anchor", "end")
        .text(function (d) { return d.name; })
        .filter(function (d) { return d.x0 < width / 2; })
        .attr("x", function (d) { return d.x1 + 6; })
        .attr("text-anchor", "start");


    //});
}

// the function for moving the nodes
function dragmove(d) {
    d3.select(this).attr("transform",
        "translate(" + (
            d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
        ) + "," + (
            d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
        ) + ")");
    sankey.relayout();
    link.attr("d", path);
}

function dataSankey(data) {
    var graph = {};
    var nodes = [];
    var links = [];

    graph.nodes = nodes;
    graph.links = links;

    var item = 0;

    data.forEach(element => {
        var genres = element.genres;
        //Remove all special characteres    
        genres = genres.replaceAll("[", "").replaceAll("]", "").replaceAll("'", "");
        //set in an array allgenres by item      
        var arrayGenre = genres.split(", ");

        var foundYear = nodes.find(({ name }) => name === arrayGenre[0]);

        if (foundYear === undefined) {
            graph.nodes.push({
                node: item,
                name: arrayGenre[0]
            });
            item = item + 1;
        }

    });

    var lastItem = nodes.slice(-1).pop();
    item = lastItem.node + 1;

    var bookFormat_grouped_data = d3.group(data, d => d.bookFormat);

    bookFormat_grouped_data.forEach(element => {
        if (element[0].bookFormat !== "Missing") {
            graph.nodes.push({
                node: item,
                name: element[0].bookFormat
            });
            item = item + 1;
        }
    });

    var lastItem = nodes.slice(-1).pop();
    item = lastItem.node + 1;

    graph.nodes.push({
        node: item,
        name: "No Series"
    });

    item = item + 1;

    graph.nodes.push({
        node: item,
        name: "Series"
    });

    console.log("nodes", graph.nodes);


    data.forEach(element => {
        //console.log("element", element.publishDate);
        if (element.genres.length > 0) {
            var genres = element.genres;
            //Remove all special characteres    
            genres = genres.replaceAll("[", "").replaceAll("]", "").replaceAll("'", "");
            //set in an array allgenres by item      
            var arrayGenre = genres.split(", ");

            var foundYear = nodes.find(({ name }) => name === arrayGenre[0]);
            var source = foundYear.node;
        }

        if (element.bookFormat !== "Missing") {
            var foundPublisher = nodes.find(({ name }) => name === element.bookFormat);
            var target = foundPublisher.node;
        }

        if (element.bookFormat !== "Missing" || element.publishDate !== "Missing") {
            graph.links.push({
                source: target,
                target: source,
                value: 1,
                title: element.title,
                author: element.Author
            });
        }
    });

    data.forEach(element => {
        //console.log("element", element.publishDate);
        if (element.genres.length > 0) {
            var genres = element.genres;
            //Remove all special characteres    
            genres = genres.replaceAll("[", "").replaceAll("]", "").replaceAll("'", "");
            //set in an array allgenres by item      
            var arrayGenre = genres.split(", ");

            var foundYear = nodes.find(({ name }) => name === arrayGenre[0]);
            var source = foundYear.node;
        }

        var target = "";
        if (element.series !== "Missing") {
            var series = nodes.find(({ name }) => name === "Series");
            target = series.node;
        }
        else {
            var series = nodes.find(({ name }) => name === "No Series");
            target = series.node;
        }

        graph.links.push({
            source: source,
            target: target,
            value: 1,
            title: element.title,
            author: element.Author});
    });


    return graph;

}
//#endregion

//#region  Scatter plot 

function scatterPlot(data) {

    var regressionPoints = getSpearmanLinearRegression(data);
    var fisheye = d3.fisheye.circular().radius(50).distortion(3);

    var div = d3.select("body").append("div")
        .attr("id", "popupdiv")
        .attr("class", "title")
        .style("opacity", 0);

    // set the dimensions and margins of the graph
    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 520 - margin.left - margin.right,
        height = 290 - margin.top - margin.bottom;

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
    //svg.append('g')
     var dots = svg.selectAll("dots")
        .data(data, (d) => d.title)
        .join("circle")
        .attr("class", "dots itemValue")
        .datum( function(d) {
            return {x: xScale(parseFloat(d.awards)), y: yScale(parseFloat(d.rating))} // change data, to feed to the fisheye plugin
        })
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 2)
        .style("fill", "#EDCA3A")
        //.on("mouseover", (event, d) => handleMouseOver(d))
        //.on("mouseleave", (event, d) => handleMouseLeave());
        //.append("title");
        // .html((d) => d.title + ", Author: " + d.Author);

    svg.on("mousemove", function(event) {
        fisheye.focus(d3.pointer(event));

        dots.each(function(d) { d.fisheye = fisheye(d); })
            .attr("cx", function(d) { return d.fisheye.x; })
            .attr("cy", function(d) { return d.fisheye.y; })
            .attr("r", function(d) { return d.fisheye.z * 1; });
    });

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

function groupDataByPublishedDate(data) {
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
    return newData;
}

function selectDropDownAuthor(value) {

    if (value == "All Authors") {
        updateUnitChar(groupDataByPublishedDate(csvdata));
    }
    else {
        //Remove missing values
        var dataFilter = csvdata.filter(function (d) { return d.Author == value });

        var newValues = groupDataByPublishedDate(dataFilter);

        updateUnitChar(newValues);
    }
}
//#endregion
//tooltip
let tooltip;



function unitChart(data) {

    tooltip = d3.select("body").append("div")
        .attr("class", "title")
        .style("opacity", 0);

    //set up svg
    var newData = groupDataByPublishedDate(data);

    var margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 520 - margin.left - margin.right,
        height = 305 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3.select("#unitchart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("id", "gUnitChart")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var minValue = d3.min(newData, (d) => Math.round(parseInt(d.position), -2));
    var maxValue = d3.max(newData, (d) => Math.round(parseInt(d.position), -2));

    // Scales
    var xScale = d3.scaleLinear().domain(d3.extent(newData, (d) => parseFloat(d.publishDate))).range([1, width])
    var yScale = d3.scaleLinear().domain([minValue, maxValue]).range([height, 0]);

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
        .attr("id", "gXAxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale).tickFormat((x) => x));


    // Create Y axis
    svg.append("g")
        .attr("id", "gYAxis")
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(yScale))
        .attr("opacity", "0");

    // Create dots
    svg
        .selectAll("circle")
        .data(newData, (d) => d.title)
        .join("circle")
        .attr("class", "dots itemValue")
        .attr("class", "dots itemValueUnitChart")
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

    var newData = data;

    const svg = d3.select("#gUnitChart");

    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
        width = 520 - margin.left - margin.right,
        height = 280 - margin.top - margin.bottom;

    const minValue = d3.min(newData, (d) => Math.round(parseInt(d.position), -2));
    var maxValue = d3.max(newData, (d) => Math.round(parseInt(d.position), -2));

    // Scales
    const xScale = d3.scaleLinear().domain(d3.extent(newData, (d) => parseFloat(d.publishDate))).range([1, width])
    const yScale = d3.scaleLinear().domain([minValue, 26]).range([height, 0]);

    var formatxAxis = d3.format('.0f');

    // Create X axis
    svg.select("#gXAxis")
        .call(d3.axisBottom(xScale)
            .tickFormat((x) => x));




    // Create Y axis
    svg.append("g")
        .attr("id", "gYAxis")
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(yScale))
        .attr("opacity", "0");

    svg
        .selectAll("circle")
        .data(newData, (d) => d.title)
        .join(
            (enter) => {
                circles = enter
                    .append("circle")
                    .attr("class", "dots itemValue")
                    .attr("class", "dots itemValueUnitChart")
                    .attr("cx", (d) => xScale(parseFloat(d.publishDate)))
                    .attr("cy", (d) => yScale(0))
                    .attr("r", 4)
                    .style("fill", "#EDCA3A")
                    .on("mouseover", (event, d) => handleMouseOver(d))
                    .on("mouseleave", (event, d) => handleMouseLeave())
                circles
                    .transition()
                    .duration(1000)
                    .attr("cy", (d) => yScale(parseFloat(d.position)) - 5);
                circles.append("title").text((d) => d.title);
                circles.html((d) => d.title + ", Author: " + d.author + ", " + d.publishDate)
            },
            (update) => {
                update
                    .transition()
                    .duration(1000)
                    .attr("cx", (d) => xScale(parseFloat(d.publishDate)))
                    .attr("cy", (d) => yScale(parseFloat(d.position)) - 5)
                    .attr("r", 4);
            },
            (exit) => {
                exit.remove();
            }
        );
}
//#endregion

//#region  Communication between charts
function handleMouseOver(item) {
    //console.log(item);

    d3.selectAll(".itemValue")
        .filter(function (d, i) {
            return d.title == item.title;
        })
        .attr("r", 10)
        .style("fill", "red")

    d3.selectAll(".itemValueUnitChart").filter(function (d, i) {
        return d.title == item.title;
    })
        .attr("r", 10)
        .style("fill", "red")

    d3.selectAll(".link").filter(function (d, i) {
        return d.title == item.title;
    })
        .style("stroke-opacity", "1")
        .style("stroke-width", "3");
}

function handleMouseLeave() {
    d3.selectAll(".itemValue").transition()
        .attr("r", 2)
        .style("fill", "#EDCA3A");

    d3.selectAll(".itemValueUnitChart").transition()
        .attr("r", 4)
        .style("fill", "#EDCA3A");

    d3.selectAll(".link").transition()
        .style("fill", "none")
        .style("stroke-opacity", "0.2");

}

function handleMouseOverRect(item) {
    //for(var i =0; i < item.sourceLinks.length; i++){
    d3.selectAll(".link").filter(function (d, i) {
        console.log("d", d);
        return d.title == item.title;
    })
        .style("stroke-opacity", "1")
        .style("stroke-width", "1.5");
    //}


}
//#endregion