var board = new Array();
var score = 0;


var startx = 0;
var starty = 0;
var endx = 0;
var endy = 0;


$(document).ready(function() {
  prepareForMobile();
  newgame();
  
});

function prepareForMobile() {
  if(documentWidth>500) {
    gridContainerWidth = 500;
    cellSpace = 20;
    cellSideLength = 100;
  }
  $("#grid-container").css({
    'width': gridContainerWidth-2*cellSpace+'px',
    'height': gridContainerWidth-2*cellSpace+'px',
    'padding': cellSpace+'px',
    'borderRadius': 0.02*gridContainerWidth+'px'
  });

  $(".grid-cell").css({
    'width': cellSideLength+'px',
    'height': cellSideLength+'px',
    'borderRadius': 0.02*gridContainerWidth+'px'
  });
}


function newgame() {

  init();
  generateOneNumber();
  generateOneNumber();
}

function init() {
  for(var i=0;i<4;i++) {
    for(var j=0;j<4;j++) {
      var gridCell = $("#grid-cell-"+i+"-"+j);
      gridCell.css('top', getPosTop(i,j));
      gridCell.css('left', getPosLeft(i,j));
    }
  }


  for(var i=0;i<4;i++) {
    board[i] = new Array();
    for(var j=0;j<4;j++) {
      board[i][j]=0;
    }
  }

  //数组同步到视图中
  updateBoardView();
  score = 0;
}


function updateBoardView() {
  $(".number-cell").remove();
  for(var i=0;i<4;i++) {
    for(var j=0;j<4;j++) {
      $("#grid-container").append('<div class="number-cell" id="number-cell-'+i+"-"+j+'"></div>');
      var theNumberCell = $("#number-cell-"+i+"-"+j);

      if(board[i][j]==0) {
        theNumberCell.css('width', '0px');
        theNumberCell.css('height', '0px');

        theNumberCell.css('top', getPosTop(i,j)+cellSideLength/2+'px');
        theNumberCell.css('left', getPosLeft(i,j)+cellSideLength/2+'px');
      }else {
        theNumberCell.css('width', cellSideLength);
        theNumberCell.css('height', cellSideLength);

        theNumberCell.css('top', getPosTop(i,j)+'px');
        theNumberCell.css('left', getPosLeft(i,j)+'px');

        theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
        theNumberCell.css('color', getNumberColor(board[i][j]));

        theNumberCell.text(board[i][j]);
      }

    }
  }
  $('.number-cell').css({
    'lineHeight': cellSideLength+'px',
    'fontSize': 0.6*cellSideLength+'px'
  });
}


function generateOneNumber() {

  if(nospace(board)){
    return false;
  }else {
    var randx,randy;
    do{
      randx = parseInt(Math.floor(Math.random()*4));
      randy = parseInt(Math.floor(Math.random()*4));
    }while(board[randx][randy]!=0)
    

    var randNumber = Math.random()<0.5?2:4;

    board[randx][randy] = randNumber;
    showNumberWithAnimation(randx,randy,randNumber);

    return true;
  } 
}



$(document).keydown(function(event) {

  switch(event.keyCode) {
    case 37:
      event.preventDefault();
      if(moveLeft()) {
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
      break;
    case 38:
      event.preventDefault();
      if(moveUp()) {
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
      break;
    case 39:
      event.preventDefault();
      if(moveRight()) {
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
      break;
    case 40:
      event.preventDefault();
      if(moveDown()) {
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
      break;
    default:
      break;
  }
});
document.addEventListener('touchstart', function(event) {
  event.preventDefault();
  startx = event.touches[0].pageX;
  starty = event.touches[0].pageY;
});
document.addEventListener('touchend', function(event) {
  event.preventDefault();
  endx = event.changedTouches[0].pageX;
  endy = event.changedTouches[0].pageY;
  var deltax = endx-startx;
  var deltay = endy-starty;
  var flag;

  if((Math.abs(deltax)<0.3*documentWidth)&&(Math.abs(deltay)<0.3*documentWidth)) {
    return ;
  }

  if(Math.abs(deltax)>=Math.abs(deltay)){ //x轴上运动
    if(deltax>0) { //right
      if(moveRight()) {
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
    }else { //left
      if(moveLeft()) {
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
    }
  }else {// y轴上运动
    if(deltay>0) { //down
      if(moveDown()) {
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
    }else { //up
      if(moveUp()) {
        setTimeout("generateOneNumber()",210);
        setTimeout("isgameover()",300);
      }
    }
  }
});
document.addEventListener('touchmove', function(event) {
  event.preventDefault();
})

function moveLeft() {
  if(!canMoveLeft(board)) {
    return false;
  }else {
    for(var i=0;i<4;i++) {
      var idx = 0;
      for(var j=1;j<4;j++) {
        if(board[i][j]!=0) {
          
          //便利其所有左侧位置
          for(var k=idx;k<j;k++) {
            if(board[i][k]==0&&noHorizontal(i,k,j,board)) {
              //move
              showMoveAnimation(i,j,i,k);
              //reset
              board[i][k] = board[i][j];
              board[i][j] = 0;
              continue;
            }else if(board[i][k]==board[i][j]&&noHorizontal(i,k,j,board)) {
              //move
              showMoveAnimation(i,j,i,k);
              //add reset
              board[i][k] += board[i][j];
              board[i][j] = 0;
              idx++;

              score += board[i][k];
              updateScore(score);
              continue;
            }
          }
        }
      }
    }
  }

  //更新  还没有完成移动动画就会更新
  //200为showMoveAnimation 中的动画时间
  setTimeout("updateBoardView()",200);
  return true;
}


function moveRight() {
  if(!canMoveRight(board)) {

    return false;
  }else{

    for(var i=0;i<4;i++) {

      var idx = 3;
      for(var j=2;j>-1;j--) {
        if(board[i][j]!=0) {
          for(var k=idx;k>j;k--) {
            if(board[i][k]==0&&noHorizontal(i,j,k,board)) {
              showMoveAnimation(i,j,i,k);
              board[i][k] = board[i][j];
              board[i][j] = 0;
              continue;
            }else if(board[i][k]==board[i][j]&&noHorizontal(i,j,k,board)) {
              showMoveAnimation(i,j,i,k);
              //add reset
              board[i][k] += board[i][j];
              board[i][j] = 0;
              idx--;
              score += board[i][k];
              updateScore(score);
              continue;
            }
          }
        }
        
      }
    }
    
  }
  setTimeout("updateBoardView()",200);
  return true;
}


function moveUp() {
  if(!canMoveUp(board)) {
    return false;
  }else {
    for(var j=0;j<4;j++) {
      var idx = 0;
      for(var i=1;i<4;i++) {
        if(board[i][j]!=0) {
          
          for(var k=idx;k<i;k++) {
            if(board[k][j]==0&&noVertical(j,k,i,board)) {
              //move
              showMoveAnimation(i,j,k,j);
              //reset
              board[k][j] = board[i][j];
              board[i][j] = 0;
              continue;
            }else if(board[k][j]==board[i][j]&&noVertical(j,k,i,board)) {
              //move
              showMoveAnimation(i,j,k,j);
              //add reset
              board[k][j] += board[i][j];
              board[i][j] = 0;
              idx++;
              score += board[k][j];
              updateScore(score);
              continue;
            }
          }
        }
      }
    }
  }
  setTimeout("updateBoardView()",200);
  return true;
}

function moveDown() {
  if(!canMoveDown(board)) {
    return false;
  }else {
    for(var j=0;j<4;j++) {
      var idx = 3;
      for(var i=2;i>-1;i--) {
        if(board[i][j]!=0) {
          
          for(var k=idx;k>i;k--) {
            if(board[k][j]==0&&noVertical(j,i,k,board)) {
              //move
              showMoveAnimation(i,j,k,j);
              //reset
              board[k][j] = board[i][j];
              board[i][j] = 0;
              continue;
            }else if(board[k][j]==board[i][j]&&noVertical(j,i,k,board)) {
              //move
              showMoveAnimation(i,j,k,j);
              //add reset
              board[k][j] += board[i][j];
              board[i][j] = 0;
              idx--;
              score += board[k][j];
              updateScore(score);
              continue;
            }
          }
        }
      }
    }
  }

  setTimeout("updateBoardView()",200);
  return true;
}


function isgameover() {
  if(nomove(board)){
    gameover();
  }
}


function gameover() {
  alert('gameover');
}



