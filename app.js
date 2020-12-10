const body = document.querySelector('body');
const box = document.querySelector('.box');
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

const zposition = [0,1540,2030,2520];


document.addEventListener('touchstart', handleTouchStart, false);        
document.addEventListener('touchmove', handleTouchMove, false);

var xDown = null;                                                        
var yDown = null;

function getTouches(evt) {
  return evt.touches ||             // browser API
         evt.originalEvent.touches; // jQuery
}                                                     

function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;                                      
};                                                

function handleTouchMove(evt) {
    if ( ! xDown || ! yDown ) {
        return;
    }

    var xUp = evt.touches[0].clientX;                                    
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */ 
        } else {
            /* right swipe */
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */
            var evt = document.createEvent('MouseEvents');
            evt.initEvent('mousewheel', true, true);
            evt.wheelDelta = +100;
            document.dispatchEvent(evt); 
        } else { 
            /* down swipe */
            var evt = document.createEvent('MouseEvents');
            evt.initEvent('mousewheel', true, true);
            evt.wheelDelta = -100;
            document.dispatchEvent(evt); 
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                             
};

let converter = 1;

if(window.innerWidth < 800){
    converter = 10;
}
else{
    converter = 1;
}


window.addEventListener('resize', () => {
    if(window.innerWidth < 800){
        converter = 10;
    }
    else{
        converter = 1;
    }
})

//traversal of z-coordinate
i=0;
window.addEventListener('mousewheel', Scrolling);
function Scrolling(e) {
    
    /* if(i>2550){
        body.style.overflowY = 'scroll';
        body.style.overflowX = 'hidden'; 
        body.removeEventListener("mousewheel",Scrolling);
    } */
    if (e.wheelDelta<=0){   
        i += converter*40;  
        
        TweenLite.to(box,0.5, {
            transform: 'translateZ('+i+'px)'
        });
    }
    else{          
        i-= converter*40;
        TweenLite.to(box,0.5, {
            transform: 'translateZ('+i+'px)'
        });   
    }
    body.style.overflow = 'hidden';
    if(i <= zposition[0]){
        n = 0;
    }
    if(i >= zposition[0] && i < zposition[1]){
        n = 0;
    }
    if(i >= zposition[1] && i < zposition[2]){
        n = 1;
    }
    if(i >= zposition[2] && i < zposition[3]){
        n = 2;
    }
    /* box.style.transform ='translateZ('+i+'px)'; */
}

// E needs


//next button

next.addEventListener('click', ()=>{
    if (n == 3){
        n = -1;
    }
    TweenLite.to(box, 1, {
        transform : 'translateZ('+zposition[++n]+'px)'
    }); 
    i = zposition[n];
}) 

//prev button
prev.addEventListener('click', ()=>{
    if (n == 0){
        n = 4;
    }
    TweenLite.to(box, 1, {
        transform : 'translateZ('+zposition[--n]+'px)'
    }); 
    i = zposition[n];

}) 