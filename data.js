class musicData{
    constructor(artist,duration,name,popularity,year,genre,artistPop) {
        this.artist = artist;
        this.duration = duration;
        this.name = name;
        this.popularity = popularity;
        this.year = year;
        this.genre = genre;
        this.artistPop = artistPop;
    }
}
artistDict = {};
music = [];
Plotly.d3.csv("artistGenre.csv",function (data) {
    for (let i = 0; i < data.length; i++) {
        //console.log(data[i].Artist);
        //console.log(data[i].Genre);
        artistDict[data[i].Artist] = [data[i].Genre,data[i].Popularity];
    }
    //console.log(data[0]);

    Plotly.d3.csv("allData.csv", function (data) {

        for (let i = 0; i < data.length; i++) {
            music[i] = new musicData(data[i].artists,data[i].duration_ms,data[i].name,data[i].popularity,data[i].year,-1,-1);
            //console.log(music[i].year);
        }

        myFunc(music)
        let gen = ["rap","pop"]
        trends(music,gen)
        gen = ["rap","pop","jazz","rock"]
        trends(music,gen)
        songs(music,"pop","#chart")
        songs(music,"rap","#chart1")
    })
})


function myFunc(music) {
for(let i=0;i<music.length;i++) {
    if (artistDict.hasOwnProperty(music[i].artist.slice(2,music[i].artist.length-2))) {
        music[i].genre = artistDict[music[i].artist.slice(2,music[i].artist.length-2)][0];
        music[i].artistPop = artistDict[music[i].artist.slice(2,music[i].artist.length-2)][1];
        //console.log(music[i].genre);
    }
    //console.log(artistDict.hasOwnProperty("music[i].artist"));
}
}

function trends(music,whichGenre){
    let frames = []
    let data = []
    let color = ["red","pink","cyan","yellow"]
    let size = 0;
    for(let k=0;k<whichGenre.length;k++) {
        let year = "1920";
        let y = 1920;
        let graphx = []
        let graphy = []
        size = 0
        while (y <= 2020) {
            let rate = 0;
            let count = 0;
            for (let i = 0; i < music.length; i++) {
                if (music[i].year === year && music[i].genre === whichGenre[k]) {
                    rate = rate + parseInt(music[i].popularity)
                    count++;
                }
            }
            if (count != 0) {
                rate = rate / count;
            }
            //console.log(rate)
            graphx[size] = year;
            graphy[size] = rate;
            size++;
            y = parseInt(year);
            y++;
            year = y.toString();
        }

        for (let i = 0; i < size; i++) {
            if(k==0) {
                frames[i] = {}
                frames[i].data = new Array();
            }
            frames[i].data.push({x: [], y: []});

            for (let j = 0; j <= i; j++) {
                frames[i].data[k].x[j] = graphx[j];
                frames[i].data[k].y[j] = graphy[j];
            }
        }
        data[k] = {
            x: frames[1].data[k].x,
            y: frames[1].data[k].y,
            fill: 'tozeroy',

            type: 'scatter',
            mode: 'lines',
            //fill : color[k],
            line: {color: color[k]},
            name: whichGenre[k]

        }
    }
    //console.log(data.length)

    Plotly.newPlot('myDiv', data, {
        paper_bgcolor : "black",
        plot_bgcolor : "black",
        //plot_color: 'white',
        title: "Trends",
        xaxis: {
            range: [
                frames[size-1].data[0].x[0],
                frames[size-1].data[0].x[size-1],
            ]

        },
        yaxis: {
            range: [
                0,
                100
            ]

        },
        updatemenus: [{
            x: 0.1,
            y: 0,
            yanchor: "top",
            xanchor: "right",
            showactive: false,
            direction: "left",
            type: "buttons",
            pad: {"t": 87, "r": 10},
            buttons: [{
                method: "animate",
                args: [null, {
                    fromcurrent: true,
                    transition: {
                        duration: 0,
                    },
                    frame: {
                        duration: 40,
                        redraw: false
                    }
                }],
                label: "Play"
            }, {
                method: "animate",
                args: [
                    [null],
                    {
                        mode: "immediate",
                        transition: {
                            duration: 0
                        },
                        frame: {
                            duration: 0,
                            redraw: false
                        }
                    }
                ],
                label: "Pause"
            }]
        }]

    }).then(function() {
        Plotly.addFrames('myDiv', frames);
    });


}


function songs(music,genre,id) {
    let genreSongs = []
    let count = 0;
    console.log(genre);
    for (let i = 0; i < music.length; i++) {
        if (music[i].year == 2020 && music[i].genre == genre && parseInt(music[i].popularity) > 50 ) {
            genreSongs[count] = music[i]
            count++;
        }
    }
    //console.log(music[0].genre);

    var width = window.innerWidth, height = window.innerHeight, sizeDivisor = 100, nodePadding = 2.5;

    let svg = d3.select(id)
        .append("svg")
        .attr("width", width)
        .attr("height", height);



    var Tooltip = d3.select("#tooltip")
        .append("div")
        .attr("width", 10)
        .attr("height", 20)
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "5px")


    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function (d) {
        Tooltip
            .style("opacity", 1)
            .style("left", d + "px")
            .style("top", d + "px");
    }

    var mouseleave = function (d) {
        Tooltip
            .style("opacity", 0)
            .style("left", d + "px")
            .style("top", d + "px");
    }


    var node = svg.append("g")
        .selectAll("circle")
        .data(genreSongs)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", function (d) {
            if (parseInt(d.popularity) < 60) {
                return 5
            } else if (parseInt(d.popularity) < 70) {
                return 7
            } else if (parseInt(d.popularity) < 80) {
                return 11
            } else if (parseInt(d.popularity) < 90) {
                return 15
            } else if (parseInt(d.popularity) > 90) {
                return 22
            }
        })
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", function (d) {
            if (parseInt(d.popularity) < 60) {
                return "#e78ac3"
            } else if (parseInt(d.popularity) < 70) {
                return "#CB4335"
            } else if (parseInt(d.popularity) < 80) {
                return "#ffd92f"
            } else if (parseInt(d.popularity) < 90) {
                return "#fc8d62"
            } else if (parseInt(d.popularity) > 90) {
                return "#0E6655"
            }
        })
        .style("fill-opacity", 0.8)
        .attr("stroke", "black")
        .style("stroke-width", 1)

        .on("mouseover", mouseover) // What to do when hovered
        .on("mousemove", (event, d) => {
            Tooltip
                .html('<u>' + d.name + '</u>' + "<br>" + d.artist.slice(2, d.artist.length - 2) + "<br>" + d.popularity)
                .style("left", ((event.pageX) + "px"))
                .style("top", ((event.pageY - 28) + "px"))
                .on("click", () => playPause(genreSongs))
        })
        .on("mouseleave", mouseleave)

        //.on("click", () => playPause(genreSongs))

        /*.onclick( function() {
            if(parseInt(d.popularity) > 90)
            playPause();
        })*/

        .call(d3.drag() // call specific function when circle is dragged
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));








    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("forceX", d3.forceX().strength(.1).x(width * .5))
        .force("forceY", d3.forceY().strength(.1).y(height * .5))
        .force("center", d3.forceCenter().x(width * .5).y(height * .5))
        .force("charge", d3.forceManyBody().strength(-15));

    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(genreSongs)
        .force("collide", d3.forceCollide().strength(1).radius(20).iterations(1))
        .on("tick", function (d) {
            node
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
        });


    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(.03).restart();
        d.fx = d.x;
        d.fy = d.y;
    }
    let playing = true;
    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
        if(parseInt(d.popularity) > 90) {
            const song = document.querySelector('#song')
            song.play();
        }
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(.03);
        d.fx = null;
        d.fy = null;
    }

    function playPause(d) {
        if(playing) {
            if (parseInt(d.popularity) > 90) {
                const song = document.querySelector('#song')
                song.play();
                playing = false;
            }
        }

    }
}



