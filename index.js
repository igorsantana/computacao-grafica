var drawButtons       = document.getElementsByClassName("draw")
var canvas            = document.getElementById('canvas')
var ctx               = canvas.getContext('2d')
var help              = document.getElementById('helper')
var botoes            = {}
canvas.width          = 640
canvas.height         = 480
var numPontos         = 0
var objIncompleto     = []
var objCompletos      = []
var tipoObj           = ''
for(var i = 0; i < drawButtons.length; i++ ) botoes[drawButtons[i].id] = drawButtons[i];

canvas.addEventListener('click', getCursorPosition)
botoes['reta'].addEventListener('click', function(){ desenha('reta') })
botoes['retangulo'].addEventListener('click', function(){ desenha('retangulo') })
botoes['triangulo'].addEventListener('click', function(){ desenha('triangulo') })

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


function printaHelp(str){
  help.innerHTML = str
}

function mouseInteraction(coord){
    if(numPontos > 0){
      numPontos--;
      objIncompleto.push(coord)
    }
    if(numPontos == 0){
      printaHelp("Desenho feito com sucesso")
      desenhaObjeto(criaObjeto(objIncompleto))
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

function getTipo(tamanho){
  if(tamanho == 2) return 'reta'
  if(tamanho == 3) return 'triangulo'
  if(tamanho == 2) return 'retangulo'
}

function criaObjeto(arr){
  var obj = { points: [], getPoints(){ return this.points }, tipo: tipoObj }
  arr.forEach(function(coord){ obj.points.push([coord.x, coord.y]) })
  return Object.create(obj)
}

function desenhaObjeto(objeto){
  ctx.lineWidth="2.5";
  var matrix = objeto.getPoints()
  if(objeto.tipo == 'reta'){
    ctx.moveTo(matrix[0][0], matrix[0][1])
    ctx.arc(matrix[0][0], matrix[0][1], 2, 0, 2 * Math.PI, true)
    ctx.lineTo(matrix[1][0], matrix[1][1])
    ctx.arc(matrix[1][0], matrix[1][1], 2, 0, 2 * Math.PI, true)
    ctx.fillStyle = "black";

    ctx.fill()
    ctx.stroke()
    
    return
  }
  if(objeto.tipo == 'triangulo'){
    ctx.moveTo(matrix[0][0], matrix[0][1])
    ctx.arc(matrix[0][0], matrix[0][1], 2, 0, 2 * Math.PI, true)
    ctx.lineTo(matrix[1][0], matrix[1][1])
    ctx.moveTo(matrix[1][0], matrix[1][1])
    ctx.arc(matrix[1][0], matrix[1][1], 2, 0, 2 * Math.PI, true)
    ctx.lineTo(matrix[2][0], matrix[2][1])
    ctx.moveTo(matrix[2][0], matrix[2][1])
    ctx.arc(matrix[2][0], matrix[2][1], 2, 0, 2 * Math.PI, true)
    ctx.lineTo(matrix[0][0], matrix[0][1])
    ctx.stroke()
  }
  if(objeto.tipo == 'retangulo'){
    
    var yAbs = Math.abs(matrix[0][1] - matrix[1][1])
    var xAbs = Math.abs(matrix[0][0] - matrix[1][0])
    if((matrix[0][1] - matrix[1][1]) <  0){
      ctx.fillRect(matrix[0][0], (matrix[1][0] - matrix[0][1]),
                   Math.abs((matrix[1][0] - matrix[0][1])), Math.abs(matrix[1][0] - matrix[0][1]))
    }
  }
}