'use strict';

function init(){
    
}

try {
    module.exports = init();
} catch(err){
    // using like a library
    window.maskForm = init();
}