// Scroll to top arrow 
$(window).scroll(function() {
    if ($(this).scrollTop() >= 50) {        
        $('#return-to-top').fadeIn(200);    
    } else {
        $('#return-to-top').fadeOut(200);   
    }
});
$('#return-to-top').click(function() {      
    $('body,html').animate({
        scrollTop : 0                       
    }, 500);
});

// Tooltips
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
  });

  function showContent() {
      document.querySelector(".mas-content").style.display = "inline";
  }