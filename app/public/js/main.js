$(document).ready(function(){
    $('.delete-invoice').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url: '/invoices/'+id,
            success: function(response){
                alert('Deleting Invoice');
                window.location.href='/invoices';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});

$(document).ready(function(){
    $('input[type="radio"]').click(function(){
        var inputValue = $(this).attr("value");
        var targetBox = $("." + inputValue);
        $(".box").not(targetBox).hide();
        $(targetBox).show();
    });
});