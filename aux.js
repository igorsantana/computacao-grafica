var help = document.getElementById('helper')

function printaHelp(str){
  help.innerHTML = str
}

function getTipo(tamanho){
  if(tamanho == 2) return 'reta'
  if(tamanho == 3) return 'triangulo'
  if(tamanho == 2) return 'retangulo'
}

function criaObjeto(arr, tipo){
  var obj = { 
    points: [[], []],
    getPoints: function(){ 
      return this.points 
    },
    tipo: tipo,
    addPoints: function(point) {
      this.points[0].push(point[0])
      this.points[1].push(point[1]) 
    },
    setPoints: function(newPoints){
      this.points.length = 0
      this.points = newPoints
    }
  }

  var objCreate = Object.create(obj)
  
  arr.forEach(function(c){ objCreate.addPoints([c.x, c.y]) })
  return objCreate
}

function desenhoCanvas(objeto, ctx){
  if(objeto.tipo == 'reta'){
    var matrix = objeto.getPoints()
    var p1 = { x: matrix[0][0], y: matrix[1][0] }
    var p2 = { x: matrix[0][1], y: matrix[1][1] }
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.fillStyle = "black"
    ctx.fill()
    ctx.stroke()
  }
  if(objeto.tipo == 'triangulo'){
    var matrix = objeto.getPoints()
    var p1 = { x: matrix[0][0], y: matrix[1][0] }
    var p2 = { x: matrix[0][1], y: matrix[1][1] }
    var p3 = { x: matrix[0][2], y: matrix[1][2] }
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.moveTo(p2.x, p2.y)
    ctx.lineTo(p3.x, p3.y)
    ctx.moveTo(p3.x, p3.y)
    ctx.lineTo(p1.x, p1.y)
    ctx.stroke()
  }
  if(objeto.tipo == 'retangulo'){
    var points = objeto.getPoints()
    var p1 = { x: points[0][0], y: points[1][0] }
    var p2 = { x: points[0][1], y: points[1][1] }
    objeto.addPoints([p1.x, p2.y])
    objeto.addPoints([p2.x, p1.y])
    points = objeto.getPoints()

    var p3 = { x: points[0][2], y: points[1][2] }
    var p4 = { x: points[0][3], y: points[1][3] }

    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p3.x, p3.y)
    ctx.moveTo(p3.x, p3.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.moveTo(p2.x, p2.y)
    ctx.lineTo(p4.x, p4.y)
    ctx.moveTo(p4.x, p4.y)
    ctx.lineTo(p1.x, p1.y)
    ctx.stroke()
  }
}