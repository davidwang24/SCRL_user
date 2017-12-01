$(document).ready(function() {
    $('.reject-invoice').on('click', function(e) {
     $target = $(e.target);
     const id = $target.attr('data-id');
     $.ajax({
      type: 'DELETE',
      url: '/invoices/' + id,
      success: function(response) {
       alert('Reject Invoice');
       window.location.href = '/invoices/confirm';
      },
      error: function(err) {
       console.log(err);
      }
     });
    });
   });
   
   $(document).ready(function() {
    $('.confirm-invoice').on('click', function(e) {
     $target = $(e.target);
     const id = $target.attr('data-id');
     $.ajax({
      type: 'GET',
      url: '/invoices/confirm/' + id,
      success: function(response) {
       alert('Confirm Invoice');
       window.location.href = '/invoices/confirm';
      },
      error: function(err) {
       console.log(err);
      }
     });
    });
   });
   
   $(document).ready(function() {
    $('input[type="radio"]').click(function() {
     var inputValue = $(this).attr("value");
     var targetBox = $("." + inputValue);
     $(".box").not(targetBox).hide();
     $(targetBox).show();
    });
   });