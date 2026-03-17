let chart;

function createChart(){

const ctx = document.getElementById("healthChart")

chart = new Chart(ctx,{

type:"line",

data:{

labels:[],

datasets:[

{
label:"Hydration",
data:[],
borderColor:"#22c55e",
fill:false
},

{
label:"Glucose",
data:[],
borderColor:"#38bdf8",
fill:false
}

]

},

options:{

responsive:true,

scales:{

y:{
beginAtZero:true
}

}

}

})

}

createChart()

function testData(){

let glucose = Math.floor(Math.random()*40)+80
let lactate = (Math.random()*3).toFixed(2)
let sodium = Math.floor(Math.random()*40)+100
let ph = (Math.random()*1+6).toFixed(2)
let hydration = Math.floor(Math.random()*30)+60

document.getElementById("glucose").innerText = glucose
document.getElementById("lactate").innerText = lactate
document.getElementById("sodium").innerText = sodium
document.getElementById("ph").innerText = ph
document.getElementById("hydration").innerText = hydration

let time = new Date().toLocaleTimeString()

chart.data.labels.push(time)

chart.data.datasets[0].data.push(hydration)
chart.data.datasets[1].data.push(glucose)

chart.update()

}

