$(document).ready(function(){
    $(".dropdown-menu li a").click(function(){
        $(this).parents(".btn-group").find('.btn').text($(this).text());
        $(this).parents(".btn-group").find('.btn').val($(this).data('value'));
    });
});