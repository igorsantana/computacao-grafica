var drawButtons       = document.getElementsByClassName("draw")
var entrada           = document.getElementsByClassName("aplicar")
var canvas            = document.getElementById('canvas')
var ctx               = canvas.getContext('2d')
var clearBtn          = document.getElementById('clear-btn')
var translacaoBtn     = document.getElementById('translacao-btn')
var escalaBtn         = document.getElementById('escala-btn')
var rotacaoBtn        = document.getElementById('rotacao-btn')
var zoomExtendBtn     = document.getElementById('zoomextend-btn')
var botoes            = {}
canvas.width          = 640
canvas.height         = 480
ctx.lineWidth         = "2.5";
var numPontos         = 0
var objIncompleto     = []
var objCompletos      = []
var tipoObj           = ''

for(var i = 0; i < drawButtons.length; i++ ){
   botoes[drawButtons[i].id] = drawButtons[i];
}

canvas.addEventListener('click', getCursorPosition)
botoes['reta'].addEventListener('click', function(){ desenha('reta') })
botoes['retangulo'].addEventListener('click', function(){ desenha('retangulo') })
botoes['triangulo'].addEventListener('click', function(){ desenha('triangulo') })
translacaoBtn.addEventListener('click', function(){ mostraEntrada('translacao') })
escalaBtn.addEventListener('click', function(){ mostraEntrada('escala') })
rotacaoBtn.addEventListener('click', function(){ mostraEntrada('rotacao') })
clearBtn.addEventListener('click', entradaDados)
zoomExtendBtn.addEventListener('click', entradaDados)

toggleBtns(false)

for(var i = 0; i < entrada.length; i++){
  entrada[i].addEventListener('click', entradaDados )
}

function toggleBtns(bool){
  var btns = document.querySelectorAll('button[id$="-btn"]')
  btns.forEach(function(btn) { btn.disabled = !bool})
}


function mostraEntrada(entrada){
  escondeEntradas()
  document.getElementById(entrada + '-div').style = "display: block;"
}

function escondeEntradas(){
  ['rotacao', 'escala', 'translacao'].forEach(function(valor){
      document.getElementById(valor + '-div').style = "display: none;"
  })
}

function entradaDados(event){
  var acao = event.srcElement.id
  var acaoWithoutBtn = acao.split('-')[0]
  if(acao == 'clear-btn'){
    escondeEntradas()
    return action(acaoWithoutBtn, null)
  }
  if(acao == 'zoomextend-btn') {
    escondeEntradas()
    return action(acaoWithoutBtn, null)
  }
  if(acao == 'translacao'){
    var dx = document.getElementById('dx').value
    var dy = document.getElementById('dy').value
    document.getElementById('dx').value = '``'
    document.getElementById('dy').value = ''
    return action(acao, { dx: dx, dy: dy} )
  }
  if(acao == 'rotacao'){
    var angulo = document.getElementById('angulo').value
    document.getElementById('angulo').value = ''
    return action(acao, { angulo: angulo })
  }
  if(acao == 'escala'){
    var sx = document.getElementById('sx').value
    var sy = document.getElementById('sy').value
    document.getElementById('sx').value = ''
    document.getElementById('sy').value = ''
    return action(acao, { sx: sx, sy: sy })
  }
}

function action(acao, entrada){
  printaHelp('')
  if(acao == 'clear'){
    objCompletos.length = 0
    toggleBtns(false)
    return clearAction()
  }
  if(acao == 'translacao'){
    clearAction()
    objCompletos.forEach(obj => obj.setPoints(translacao(obj.getPoints(), parseInt(entrada.dx), parseInt(entrada.dy))))
  }
  if(acao == 'rotacao'){
    clearAction()
    var angulo = - parseInt(entrada.angulo)
    objCompletos.forEach(obj => obj.setPoints(rotacao(obj.getPoints(), angulo)))
  }
  if(acao == 'escala'){
    clearAction()
    objCompletos.forEach(obj => obj.setPoints(escala(obj.getPoints(), parseInt(entrada.sx), parseInt(entrada.sy))))
  }
  if(acao == 'zoomextend'){
    clearAction()
    var janela        = zoomExtend(objCompletos),
        dx            = - janela.menorx,
        dy            = - janela.menory,
        ratioJanela   = (janela.maiorx - janela.menorx) / (janela.maiory - janela.menory),
        ratioViewport = canvas.width / canvas.height,
        novoX         = canvas.width, 
        novoY         = canvas.height
    if(ratioViewport > ratioJanela){
      novoX = canvas.height * ratioJanela
    }
    if(ratioJanela > ratioViewport){
      novoY = canvas.width / ratioJanela
    }
    var sx  = novoX / (janela.maiorx - janela.menorx),
        sy  = novoY / (janela.maiory - janela.menory)
    
    objCompletos.forEach(obj => obj.setPoints(translacao(obj.getPoints(), dx, dy)))
    objCompletos.forEach(obj => obj.setPoints(escala(obj.getPoints(), sx, sy)))
    var novaJanela  = zoomExtend(objCompletos)
    objCompletos.forEach(obj => obj.setPoints(translacao(obj.getPoints(), 0, (canvas.height - Math.floor(novaJanela.maiory)) / 2)))  
    objCompletos.forEach(obj => obj.setPoints(translacao(obj.getPoints(),  (canvas.width - Math.floor(novaJanela.maiorx)) / 2, 0)))        
  }
  objCompletos.forEach(obj => desenhaObjeto(obj))
}


function clearAction(){
  canvas.width = canvas.width;
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
      toggleBtns(true)
      objCompletos.push(obj)
      objIncompleto.length = 0;
      printaHelp('\n')
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

 // var ratioJanela   = Math.abs(janela.maiorx - janela.menorx) / Math.abs(janela.maiory - janela.menory)
    // var ratioViewport = canvas.width / canvas.height
    // var sx            = canvas.width / (janela.maiorx - janela.menorx)
    // var sy            = canvas.height/ (janela.maiory - janela.menory)
    // var umaxnovo      = (ratioJanela * (janela.maiory - janela.menory)) + janela.menorx
    // objCompletos.forEach(obj => obj.setPoints(translacao(obj.getPoints(), - janela.menorx, - janela.menory)))
    // if(ratioViewport > ratioJanela){
    //   objCompletos.forEach(function(objeto){
    //     var pontos = objeto.getPoints()
    //     for(var i = 0; i < pontos[0].length; i++){
    //       var x = pontos[0][i]
    //       var y = pontos[1][i]
    //       var novoX = (x * sx) - (sx * janela.menorx) - ((canvas.width - umaxnovo ) / 2)
    //       var novoY = (y * sy) - (sy * janela.menory)
    //       objeto.changePoints(i,  novoX , novoY )
    //     }
    //   })

    // }
    

    // objCompletos.forEach(obj => obj.setPoints(translacao(obj.getPoints(), - (janela.menorx), - (janela.menory))))
    
    // objCompletos.forEach(obj => obj.setPoints(escala(obj.getPoints(), sx, sy)))
    // if(ratioJanela > ratioViewport){
    //   correcao = ((janela.maiorx - janela.menorx) / ratioJanela) + janela.menory
    //   objCompletos.forEach(obj => obj.setPoints(translacao(obj.getPoints(), 0 , (canvas.height - correcao) / 2)))
    // }
    // if(ratioJanela < ratioViewport){
    //   correcao = 
    //   objCompletos.forEach(obj => obj.setPoints(translacao(obj.getPoints(), (canvas.width - correcao) / 2 , 0)))
    // }