const csvdata = "";
var allGenres = [];




function init(){
    d3.csv("resultshandmade2.csv").then(function (data) {
        filldropDown_genre(data);
        scatterPlot(data);
        sankeyChart(data);        
        pieChart(data);
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

/*************************************** End --> Sankey chart ***************************************/


/*************************************** Start --> Scatter plot ***************************************/

function scatterPlot(data) {

    //create arrays from the dataset
    nawards = data.map(d => +d.awards);
    nliked = data.map(d => +d.likedPercent);


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
    var xScale = d3.scaleLinear().domain(d3.extent(nawards)).range([0, width])
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
        .data(d3.zip(nawards, nliked))
        .enter()
        .append("circle")
            .attr("cx", function(d){
                return xScale(d[0]);})
            .attr("cy",  function(d){
                return yScale(d[1]);})
            .attr("r", 2)
            .style("fill", "#CC0000");

    /*************************************** End --> Scatter plot ***************************************/
}

/*************************************** End --> Scatter plot ***************************************/



/*************************************** Start --> Pie chart ***************************************/

function pieChart(data){
    //Sort data by publishedData
    data.sort(function(x, y){
        return d3.ascending(x.publishDate, y.publishDate);
     });    
    
    //GroupByYear
    var dataByYear = d3.group(data, d => d.publishDate);
       
    console.log(dataByYear);

    /*var iDiv = document.createElement('div');
    iDiv.id = 'block';
    iDiv.className = 'block';
    document.getElementsByTagName('pieChart')[0].appendChild(iDiv);*/


}


/*************************************** End --> Pie plot ***************************************/