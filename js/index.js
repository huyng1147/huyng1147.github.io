// Shorthand for $( document ).ready()
$(function() {
    console.log("ready");
    currentZipcodeLocation = 42101;
    // getLocationByZipCode(currentZipcodeLocation);
});

// Wrap IIFE around your code
(function($, viewport){
    $(document).ready(function() {

        // Executes only in XS breakpoint
        if(viewport.is('xs')) {
            // ...
        }

        // Executes in SM, MD and LG breakpoints
        if(viewport.is('>=sm')) {
            // ...
        }

        // Executes in XS and SM breakpoints
        if(viewport.is('<md')) {
            // ...
        }

        // Execute code each time window size changes
        $(window).resize(
            viewport.changed(function() {
                if(viewport.is('xs')) {
                    console.log('xs');
                    // $(".media-object-image").css('width', '20');
                }
            })
        );
    });
})(jQuery, ResponsiveBootstrapToolkit);