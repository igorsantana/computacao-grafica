var drawButtons       = document.getElementsByClassName("draw")
var canvas            = document.getElementById('canvas')
var ctx               = canvas.getContext('2d')
var clear             = document.getElementById('clear')
var translacao        = document.getElementById('translacao')
var escala            = document.getElementById('escala')
var rotacao           = document.getElementById('rotacao')
var botoes            = {}
canvas.width          = 640
canvas.height         = 480
ctx.lineWidth         = "2.5";
var numPontos         = 0
var objIncompleto     = []
var objCompletos      = []
var tipoObj           = ''

for(var i = 0; i < drawButtons.length; i++ ) botoes[drawButtons[i].id] = drawButtons[i];

canvas.addEventListener('click', getCursorPosition)
botoes['reta'].addEventListener('click', function(){ desenha('reta') })
botoes['retangulo'].addEventListener('click', function(){ desenha('retangulo') })
botoes['triangulo'].addEventListener('click', function(){ desenha('triangulo') })
clear.addEventListener('click', clearAction)
translacao.addEventListener('click', translateAction)
escala.addEventListener('click', escalaAction)
rotacao.addEventListener('click', rotacaoAction)

function rotacaoAction(){
  var angulo = 90
  var cos = Math.cos(angulo), sen = Math.sin(angulo)
  var rotacao = [ [cos ,sen], [ -sen, cos ] ]
  var novosObjetos = objCompletos.map(obj => {
      var points = obj.getPoints()
      console.table(matrixMulti(rotacao, points))
      obj.setPoints(matrixMulti(rotacao, points))
      return obj
    })
  clearAction()
  objCompletos = novosObjetos
  objCompletos.forEach(obj => desenhaObjeto(obj))
}

function escalaAction(){
    var sx = sy = 2
    var translation = [ [ sx, 0], [ 0, sy] ]
    var novosObjetos = objCompletos.map(obj => {
      var points = obj.getPoints()
      obj.setPoints(matrixMulti(translation, points))
      return obj
    })
    clearAction()
    objCompletos = novosObjetos
    objCompletos.forEach(obj => desenhaObjeto(obj))
}


function translateAction(){
    var dx = dy = 5
    var novosObjetos = objCompletos.map(obj => {
      var points = obj.getPoints()
      var newX = points[0].map(function(x){ return x + dx })
      var newY = points[1].map(function(y){ return y + dy })
      obj.setPoints([newX, newY])
      return obj
    })
    clearAction()
    objCompletos = novosObjetos
    objCompletos.forEach(obj => desenhaObjeto(obj))
    
}

function clearAction(){
  canvas.width = canvas.width;
  objCompletos.length = 0
  ctx.lineWidth         = "2.5";
}

function desenha(objeto){
  if(objeto == 'reta'){
    printaHelp("Clique em dois pontos no canvas para definir a reta")
    numPontos = 2
    tipoObj = 'reta'
    return
  }
  if(objeto == 'triangulo'){
    printaHelp("Clique em três pontos no canvas para definir o retangulo")
    numPontos = 3
    tipoObj = 'triangulo'
    return
  }
  if(objeto == 'retangulo'){
    printaHelp("Selecione dois pontos que formam a diagonal do retângulo.")
    numPontos = 2
    tipoObj = 'retangulo'
    return
  }
}



function mouseInteraction(coord){
    if(numPontos > 0){
      numPontos--;
      objIncompleto.push(coord)
    }
    if(numPontos == 0){
      obj = criaObjeto(objIncompleto, tipoObj)
      
      desenhaObjeto(obj)
      
      objCompletos.push(obj)
      objIncompleto.length = 0;
      
    }
}

function getCursorPosition(event) {
  if(numPontos != 0 ){
    var totalOffsetX = 0;
    var totalOffsetY = 0;
    var canvasX = 0;
    var canvasY = 0;
    var currentElement = this;
    do {
      totalOffsetX += currentElement.offsetLeft;
      totalOffsetY += currentElement.offsetTop;
    }
    while (currentElement = currentElement.offsetParent)

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    canvasX = Math.round( canvasX * (this.width / this.offsetWidth) );
    canvasY = Math.round( canvasY * (this.height / this.offsetHeight) );
    
    mouseInteraction({ x: canvasX, y: canvasY })
    
  }
}


function desenhaObjeto(objeto){
  desenhoCanvas(objeto, ctx)
}