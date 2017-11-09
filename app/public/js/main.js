$(document).ready(function(){
    $('.delete-user').on('click', function(e){
        $target = $(e.target);
        const id = $target.attr('data-id');
        $.ajax({
            type:'DELETE',
            url: '/account/'+id,
            success: function(response){
                alert('Deleting User');
                window.location.href='/account';
            },
            error: function(err){
                console.log(err);
            }
        });
    });
});