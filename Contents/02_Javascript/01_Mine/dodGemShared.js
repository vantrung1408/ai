var game;

function initGame() {
    game = new map($('div.container>div.row>div.grid'));
    game.installMember();
}

$(document).ready(function () {
    initGame();

    $(document).on('click', '.container>div:nth-child(1).row>div.grid>div.grid-child', function () {
        var index = $(this).parent().find('>div').index($(this));
        game.selectChild(index);
    })

    $(document).on('click', '.container>div:nth-child(1).row>div.grid>div.grid-child>div span.glyphicon', function () {
        var result;
        if ($(this).hasClass('glyphicon-chevron-up')) {
            result = game.movePoint('up');
        }
        else if ($(this).hasClass('glyphicon-chevron-down')) {
            result = game.movePoint('down');
        }
        else if ($(this).hasClass('glyphicon-chevron-left')) {
            result = game.movePoint('left');
        }
        else {
            result = game.movePoint('right');
        }

        if (result) {
            $('#message').text(result);
            $('.container + div').removeClass('hidden');
            setTimeout(function () {
                window.location.reload();
            }, 4000);

            var timeLeft = 4;
            var timeOut = setInterval(function () {
                timeLeft--;
                $('#timer').text(timeLeft + 's');
                if (timeLeft == 0) {
                    timeOut.clearInterval();
                }
            }, 1000);
        }
    })
})

