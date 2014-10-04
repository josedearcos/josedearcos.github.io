//Preload images first 
$.fn.preload = function() {
    this.each(function(){
        $('<img/>')[0].src = this;
    });
}
var images = Array("http://placekitten.com/500/200",
                   "http://placekitten.com/499/200",
                   "http://placekitten.com/501/200",
                   "http://placekitten.com/500/199");

$([images[0],images[1],images[2],images[3]]).preload();

// Usage:

var currimg = 0;

$(document).ready(function(){
   
    function loadimg(){
        
       $('.slideshow').animate({ opacity: 1 }, 500,function(){

            //finished animating, minifade out and fade new back in           
            $('.slideshow').animate({ opacity: 0.7 }, 100,function(){
                
                currimg++;
                
                if(currimg > images.length-1){
                    
                    currimg=0;
                    
                }
                
                var newimage = images[currimg];
            
                //swap out bg src                
                $('.slideshow').css("background-image", "url("+newimage+")"); 
            
                //animate fully back in
                $('.slideshow').animate({ opacity: 1 }, 400,function(){

                    //set timer for next
                    setTimeout(loadimg,5000);

                });

            });
        
        });

     }
     setTimeout(loadimg,5000);
  
});