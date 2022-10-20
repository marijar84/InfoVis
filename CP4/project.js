let csvdata;
var allGenres = [];




function init() {
    d3.csv("resultshandmade2.csv").then(function (data) {
        filldropDown_genre(data);
        scatterPlot(data);
        sankeyChart(data);
        dataPieChart(data);
        csvdata = data;
    });
}

/*************************************** Start --> Dropdown list ***************************************/
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
    if (value == "All genre") {
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
    }
}

function removePieChart() {
    var div = document.getElementById('pieChart');
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
}

/*************************************** End --> Dropdown list ***************************************/


/*************************************** Start --> Slider by year ***************************************/
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

/*************************************** End --> Slider by year ***************************************/


/*************************************** Start --> Sankey chart ***************************************/

function sankeyChart(data) {
    var dataByYear = d3.group(data, d => d.publishDate);

    //console.log(dataByYear);

}

function dataSankey(data) {

    var data;


    return data;
}

/*************************************** End --> Sankey chart ***************************************/


/*************************************** Start --> Scatter plot ***************************************/

function scatterPlot(data) {

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
    var yScale = d3.scaleLinear().domain([75, 100]).range([height, 0]);

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
        .attr("cy",  (d) => yScale(parseFloat(d.likedPercent)))
        .attr("r", 2)
        .style("fill", "#CC0000")
        .on("mouseover", function (d, i) {
            d3.select(this).transition()
                .duration('100')
                .attr("r", 7);
       })
        .on('mouseout', function (d, i) {
            d3.select(this).transition()
                .duration('200')
                .attr("r", 2);
        });
        // .on("mouseleave", (event, d) => handleMouseLeave())
        // .append("title")
        // .text((d) => d.title);

    /*************************************** End --> Scatter plot ***************************************/
}

/*************************************** End --> Scatter plot ***************************************/



/*************************************** Start --> Pie chart ***************************************/

function pieChart(data, startYear, endYear) {

    if (data.length > 0) {

        var iDiv = document.createElement('div');
        var nameDiv = startYear;
        iDiv.innerHTML = nameDiv + "s";
        iDiv.className = startYear

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 30, left: 60 },
            width = 460 + margin.left + margin.right,
            height = 400 + margin.top + margin.bottom;

        // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
        var radius = 200;//Math.min(width, height) / 2 - margin

        // append the svg object to the div called 'my_dataviz'
        var svg = d3.select(iDiv)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .style("background", "white")
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        // set the color scale
        var color = d3.scaleOrdinal()
            .domain(data)
            .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56"]);

        // Compute the position of each group on the pie:
        var pie = d3.pie()
            .value(function (d) { return d.Amount; })(data);

        var arcGenerator = d3.arc()
            .innerRadius(0)
            .outerRadius(radius)

        svg
            .selectAll('whatever')
            .data(pie)
            .enter()
            .append('path')
            .attr('d', arcGenerator)
            .attr('fill', function (d) { return (color(d.data.Author)) })
            .attr("stroke", "black")
            .style("stroke-width", "2px")
            .style("opacity", 0.7);

        //Add Annotation
        svg
            .selectAll('mySlices')
            .data(pie)
            .enter()
            .append('text')
            .text(function (d) { return d.data.Author })
            .attr("transform", function (d) { return "translate(" + arcGenerator.centroid(d) + ")"; })
            .style("text-anchor", "middle")
            .style("font-size", 17)

        document.getElementById('pieChart').appendChild(iDiv);
    }
}

function dataPieChart(data) {

    var pieChartData;

    //Sort data by publishedData
    data.sort(function (x, y) {
        return d3.ascending(x.publishDate, y.publishDate);
    });

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
    return pieChartData;
}

function getAuthorByBook(data) {
    //Remove missing values
    var dataFilter = data.filter(function (d) { return d.Author !== "Missing" });

    var authors = d3.group(dataFilter, d => d.Author);
    //var dataFilterAuthorOneBook = authors.filter((item) => {
    //  return (item.value.indexOf(value) > 1)});
    var pieData = [];
    var authorByBook = [];

    authors.forEach((valueAuthor, keyAuthor) => {

        var amount = 1;
        var books = new Array();
        var authorName = "";

        //console.log("authors", authors.size);
        if (authors.size > 30) {
            if (valueAuthor.length == 1) {
                authorName = "Authors";
                var index = pieData.filter(function (x) { return x.Author == authorName });

                if (index.length == 0) {
                    authorByBook.push({
                        Author: valueAuthor[0].Author,
                        Book: valueAuthor[0].title
                    });

                    pieData.push({
                        Author: authorName,
                        Amount: amount,
                        Books: books,
                        AuthorByBook: authorByBook,
                    });
                }
                else {
                    index[0].Amount = index[0].Amount + 1;

                    authorByBook = index[0].AuthorByBook;
                    authorByBook.push({
                        Author: valueAuthor[0].Author,
                        Book: valueAuthor[0].title
                    });
                }
            }
            else {

                valueAuthor.forEach((valueAuthor1, keyAuthor1) => {

                    authorName = valueAuthor1.Author;

                    //if (amount <= valueAuthor.length) {
                    books.push(valueAuthor1.title);
                    //}
                    amount = valueAuthor.length;
                });
                pieData.push({
                    Author: authorName,
                    Amount: amount,
                    Books: books,
                    AuthorByBook: authorByBook,
                });
            }
        }
        else {
            valueAuthor.forEach((valueAuthor1, keyAuthor1) => {

                authorName = valueAuthor1.Author;

                //if (amount <= valueAuthor.length) {
                books.push(valueAuthor1.title);
                //}
                amount = valueAuthor.length;
            });
            pieData.push({
                Author: authorName,
                Amount: amount,
                Books: books,
                AuthorByBook: authorByBook,
            });
        }
    });
    //console.log("pieData", pieData);
    return pieData;
}


/*************************************** End --> Pie plot ***************************************/
function handleMouseOver(item) {
    d3.selectAll(".itemValue")
      .filter(function (d, i) {
        return d.title == item.title;
      })
      .attr("r", 10)
      .style("fill", "red");
  }
  
  function handleMouseLeave() {
    d3.selectAll(".itemValue").style("fill", "steelblue").attr("r", 4);
  }