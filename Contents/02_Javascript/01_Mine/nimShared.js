var tree;

$(document).ready(function(){
	$(document).on('click', '[data-type="playGame"]', function(){
		if(!tree)
		{
			var n = parseInt($('#n').val());
			// clear html
			$('.container.nim .row>div').html('');
		   	var div = document.createElement('div');
	        div = $(div);
	        var label = document.createElement('label');
	        label = $(label);
	        label.addClass('label label-default');
	        label.text(n);
	        div.append(label);
	        
	        $('.container.nim').addClass('playing');
	        $('.container.nim .row>div').append(div);

			tree = new treeObj(n, $('.container.nim .row>div'), $('#popover-data'));
			tree.installMember();

			if($(this).attr('data-item') != 'com'){
				$('#popover-data').html('');
                for(var i = 0; i< tree.getRoot().getChilds().length; i++)
                {
                    var nextRowData = tree.getRoot().getChilds()[i].getData().join(' - ');
                    var btn = document.createElement('button');
                    btn = $(btn);
                    btn.addClass('btn btn-default');
                    btn.text(nextRowData);
                    btn.attr('data-item', i);
                    btn.attr('data-type', 'playGame');

                    $('#popover-data').append(btn);
                }

                label.popover({
                    html: true,
                    content: function(){
                        return $('#popover-data').html();
                    },
                    title: 'Chọn nước đi của bạn',
                    placement: 'bottom'
                });

                label.popover('show');

                return;
			}
		}

		if($(this).attr('data-item') == 'com')
		{
			tree.move(TYPE.COM, null);	
		}
		else
		{
			var selectedData = $(this).attr('data-item');
			$(this).parent().parent().remove();

			if(tree.getRoot().getChilds().length > 0)
			{
				tree.move(TYPE.PLAYER, selectedData);

				setTimeout(function(){
					if(tree.getRoot().getChilds().length > 0)
					{
						tree.move(TYPE.COM, null);	
						if(tree.getRoot().getChilds().length == 0)
						{
							showMessage('COM WIN');
						}
					}
					else	// Nếu không còn con thì COM thua
					{
						showMessage('YOU WIN');
					}
				}, 700);
			}
			else
			{
				showMessage('COM WIN');
			}
		}
	})
})

function showMessage(content){
	$('#message').text(content);
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