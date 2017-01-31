function matrixMulti(m1, m2){
  var result = [];
  for (var i = 0; i < m1.length; i++) {
      result[i] = [];
      for (var j = 0; j < m2[0].length; j++) {
          var sum = 0;
          for (var k = 0; k < m1[0].length; k++) {
              sum += m1[i][k] * m2[k][j];
          }
          result[i][j] = sum;
      }
  }
  return result
}

function encontraMenores(matrix){
    var menorX  = matrix[0].reduce(function(p, n ){  return n < p ? n : p }, 1000)
    var menorY  = matrix[1].reduce(function(p, n ){  return n < p ? n : p }, 1000)
    return { x: menorX, y: menorY }
}

function translacao(matrix, dx, dy){
    var newX = matrix[0].map(function(x){ return x + dx })
    var newY = matrix[1].map(function(y){ return y + dy })
    return [newX, newY]
}

function escala(matrix, sx, sy){
    var escala  = [ [ sx, 0], [ 0, sy] ]
    var menores = encontraMenores(matrix)
    matrix      = translacao(matrix, - menores.x, - menores.y)
    matrix      = matrixMulti(escala, matrix)
    matrix      = translacao(matrix, menores.x,  menores.y)
    return matrix
}

function rotacao(matrix, angulo){
    angulo      = angulo * (Math.PI / 180)
    var cos     = Math.cos(angulo), sen = Math.sin(angulo)
    var rotacao = [ [cos ,-sen], [ sen, cos ] ]
    var menores = encontraMenores(matrix)
    matrix      = translacao(matrix, - (menores.x), - (menores.y))
    matrix      = matrixMulti(rotacao, matrix)
    matrix      = translacao(matrix, menores.x,  menores.y)
    return matrix
}

function zoomExtend(objects){
    return objects.reduce(function(prev, next){
        var matrix = next.getPoints()
        var menorX  = (matrix[0].reduce(function(p, n ){  return n < p ? n : p }, 1000))  - 20
        var maiorX  = (matrix[0].reduce(function(p, n ){  return n > p ? n : p }, 0)) + 20 
        var menorY  = (matrix[1].reduce(function(p, n ){  return n < p ? n : p }, 1000))  - 20
        var maiorY  = (matrix[1].reduce(function(p, n ){  return n > p ? n : p }, 0)) + 20
       
        return { menorx : (menorX < prev.menorx ? menorX : prev.menorx ), 
                 menory : (menorY < prev.menory ? menorY : prev.menory ),
                 maiorx : (maiorX > prev.maiorx ? maiorX : prev.maiorx ),
                 maiory : (maiorY > prev.maiory ? maiorY : prev.maiory ) }
    }, { menorx: 1500, menory: 1500, maiorx: 0, maiory: 0 })
}