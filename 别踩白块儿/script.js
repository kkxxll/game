var gameOver = false; //游戏是否结束
var block_h = $('.inner').eq(0).height(); //块的长度

init();
//初始化
function init() {
    for(var i=0;i<5;i++) {
        $('.container').append($('.outer').eq(0).clone());
    }
    display();
}

//点击块
$('.container').click(function(e) {
    // console.log(e.target);
    $target = $(e.target)
    var cur_bottom = parseInt($target.parents(".outer").css("bottom"));
    if(!gameOver&&cur_bottom==0) {
        //是否点到黑块
        if($target.hasClass('black')) {
            //移动
            for(var i=0;i<$('.outer').length;i++) {
                var cur = parseInt($('.outer').eq(i).css("top"));
                $('.outer').eq(i).animate({top: cur+block_h+"px"}, 200)
            }
            $('.outer').eq(-1).remove();
            newBlock();
        }else {
            alert('game over');
            gameOver = true;
        }
    }
})

//在顶部新建一个快
function newBlock() {
    var random = Math.floor(Math.random()*4);
    $('.outer').eq(0).clone().insertBefore($('.outer').eq(0))
    $('.outer').eq(0).children('.inner').removeClass('black').eq(random).addClass('black').css({
        "top": -block_h
    });
}

//重置黑块位置
function display() {
    for(var i=0;i<6;i++) {
        var random = Math.floor(Math.random()*4);
        $('.outer').eq(i).css({"left": 0, "top": i*block_h-block_h}).children('.inner').removeClass('black').eq(random).addClass('black')
    }
}

//点击按钮重新开始游戏
$('.button').click(function() {
    gameOver = false;
    display();
})