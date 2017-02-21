$(document).ready(function(){
	// 2016.09.09	Trung.DV	Bootstrap tool tip setup
	$('[data-toggle="tooltip"]').tooltip(); 
	
	$('a.company-detail').popover({
        html: true,
        trigger: 'hover',
        content: function(){
        	return $(this).parent().find('div[itemid="company-detail-content"]').html();
        },
        title: 'Thông tin Công ty',
    });
})