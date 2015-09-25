// Close Map Search
// TODO: This is currently GLOBAL!
closeMapSearch = function (event) {
    var search = document.querySelector('.providers .provider-search');
    if (search instanceof Element && search.classList.contains('active'))
        search.classList.remove('active');
};

// Escape feature
document.addEventListener('keydown', function (event) {
    if (event && event.keyCode && event.keyCode === 27)
        location.replace('https://en.wikipedia.org/wiki/Special:Random');
});

/* -All jQuery & JS usage for UI enhancements has been moved from templates
    to this document for review, improvements and to be moved as seen fit. */


Template.body.onRendered(function () {
    // Header State Change (window.scroll)
    var timeout = null;
    window.addEventListener('scroll', function (event) {
        // Why we're using timers here:
        // The scroll event will fire for every pixel (or browser/OS-specific unit)
        // scrolled, causing major performance issues, especially when interacting
        // with the DOM as we do here by adding and removing classes.
        // 
        // Instead, we use timeouts to wait for a scroll to complete before executing
        // CPU-intensive code.  For each time the event fires, the timeout is cleared,
        // essentially causing the code to wait until the event is fired for its
        // last time.
        
        // Clear the timeout
        clearTimeout(timeout);
        
        // Set a timeout to add the class after one tenth of a second
        timeout = setTimeout(function () {
            var nav;
            
            if (window.scrollY > 160)
                document.body.classList.add('scrolled');
            else {
                document.body.classList.remove('scrolled');
                nav = document.querySelector('header nav');
                if (nav instanceof Element)
                    nav.classList.remove('active');
            }
        }, 100);
    },false);

    // Menu Toggle Click
    document.querySelector('.menu-toggle').addEventListener('mouseup', function () {
        if (document.body.classList.contains('open-nav'))
            document.body.classList.remove('open-nav');
        else
            document.body.classList.add('open-nav');
    });

    // Carousel Function
    $('.carousel nav li').click(function(){
        var left = parseInt($('.carousel main').css('left'));
        var carouselWidth = $('.carousel main').outerWidth();
        if($(this).hasClass('prev')){
            if(left == 0 ){
                // do nothing
            }
            else { 
                var prevLeft = left + carouselWidth;
                $('section.carousel main').css({left: prevLeft});
            }
        }
        if($(this).hasClass('next')){
            var end = $('section.carousel main article').length * $('.carousel main').outerWidth();
            var endSplit = end / 2 - $('.carousel main').outerWidth();
            if(left == - endSplit){
                // do nothing
            }
            else { 
                var nextLeft = left - carouselWidth;
                $('section.carousel main').css({left: nextLeft});
            }
        }
    });
    $('.details-ref').click(function(){
        $('section.carousel').addClass('active');
     });
    $('.close-carousel').click(function(){
        $('section.carousel').removeClass('active');
     });


    //Toggle visibility of the List View in Events
    $('h4.list-view').click(function(){
        $('body').addClass('calendar-list-hide');
    });
    $('span.show-list').click(function(){
        $('body').removeClass('calendar-list-hide');
    });

    $('nav').click(function(){
        if ($(window).width() < 768) {
           $('body').removeClass('open-nav');
        }
     });
	
    //Illuminate Current Nav Item (Unable to target)
    /*$(document).ready(function(){
        var section1Height = $('#work').height();
        var section2Height = $('#community').height();
        var section3Height = $('#who-we-are').height();
        var section4Height = $('#providers').height();
        var section5Height = $('#contact').height();
    
        $(window).scroll(function() {
            var winTop = $(window).scrollTop();
            if(winTop >= section1Height && winTop <= section2Height){
                $('a[href="#work"]').addClass("current").not().removeClass("current");
            } 
            else if(winTop >= section2Height && winTop <= section3Height){
                $('a[href="#community"]').addClass("current").not().removeClass("current");
            } 
            else if(winTop >= section3Height && winTop <= section4Height){
                $('a[href="#who-we-are"]').addClass("current").not().removeClass("current");
            } 
            else if(winTop >= section4Height && winTop <= section5Height){
                $('a[href="#providers"]').addClass("current").not().removeClass("current");
            } 
            else if(winTop >= section5Height){
                $('a[href="#contact"]').addClass("current").not().removeClass("current");
            }
        });
    });*/
    
});

var smoothScroll = function (event) {
    if (!event || !event.target || !event.target.hash)
        return;
    
    event.stopPropagation();
    event.preventDefault();
    
    // Get target element (that the anchor links to)
    var target = $('[id="' + event.target.hash.slice(1) +'"]'),
    
    // Where are we presently?
    posY = event.pageY, offset, speed;
    
    // If no target, don't bother
    if (!target.length) return;
    
    // Calculate target Y offset
    offset = target.offset().top - 95;
    
    // We want to scroll at 750 pixels per second
    speed = Math.abs(posY - offset);
    
    // Smooth scroll to target
    $('body').animate({ scrollTop: offset }, speed > 3000? 3000 : speed);
};

// Smooth scrolling
// We only care about same page links (that start with a hash)
Template.body.events({ 'mousedown a[href*=#]': smoothScroll });

// Utility Nav
Template.utilityNav.onRendered(function () {
    // Toggle visibility of the Alerts
    var alerts = document.querySelectorAll('.alerts'),
        i, j, blockClose, modules,
    
    // Class swap method
    classSwap = function (event) {
        event.preventDefault();
        event.stopPropagation();
        
        var active = document.querySelectorAll('.utility-nav .active'),
            i, j;
        
        for (i = 0, j = active.length; i < j; ++i)
            active[i].classList.remove('active');
        
        this.classList.add('active');
    };
    
    console.debug(alerts);
    
    for (i = 0, j = alerts.length; i < j; ++i)
        alerts[i].addEventListener('mousedown', classSwap);
    
    // Close modules by default
    document.body.addEventListener('mousedown', function () {
        var active = document.querySelectorAll('.utility-nav .active'),
            i, j;
        
        for (i = 0, j = active.length; i < j; ++i)
            active[i].classList.remove('active');
    });
    // But not if you click in the modules
    modules = document.querySelectorAll('.notification-menu');
    blockClose = function (event) {
        event.stopPropagation();
    };
    for (i = 0, j = modules.length; i < j; ++i)
        modules[i].addEventListener('mousedown', blockClose);
    
    //Toggle visibility of Donate Tab
    $('.donate .toggle').click(function(){
        if($('body').hasClass('donation-active')){
            $('body').removeClass('donation-active');
        } else{
            $('body').addClass('donation-active');
        }
    });

    $('.donate .close-donate').click(function(){
        if($('body').hasClass('donation-active')){
            $('body').removeClass('donation-active');
        } else{
            //Do Nothing
        }
    });
});

Template.work.onRendered(function () {
    //Toggle work filter
    $('button.work-filter').click(function(){
        if($('body').hasClass('work-menu-active')){
            $('body').removeClass('work-menu-active');
        } else{
            $('body').addClass('work-menu-active');
        }
    });

    $('.work menu.tabs').click(function(){
        if($('body').hasClass('work-menu-active')){
            $('body').removeClass('work-menu-active');
        } else{
            //Do nothing. This is used to close the menu on mobile after a selection is made.
        }
    });

    // Fix-position the Work Section Sidebar
    $(window).scroll(function () {
        var position = $('.work').offset();
        
        // Sometimes position is undefined?!
        if (!position) return;
        
        var threshold = position.top -93;
        var positionBtm = $('#community').offset();
        var btmThreshold = positionBtm.top;
        if ($(window).scrollTop() >= threshold && $(window).scrollTop() < btmThreshold){
            $('.work .tabs').addClass('fixed');
        } else{
            $('.work .tabs').removeClass('fixed bottom');
        }
    });
});


Template.who.onRendered(function () {
    //Slide Who We Are Section
    // TODO: This really doesn't work... - Micah
    $(".slider-nav.prev").click(function(){
        $('main.slider-content').animate({scrollLeft: -500}, 800);
    }); 
    $(".slider-nav.next").click(function(){
        $('main.slider-content').animate({scrollLeft: 500}, 800);
    }); 
}); 


Template.providers.onRendered(function () {
    //Toggle provider search
    $('.provider-search').click(function(event){
        event.stopPropagation();
        if($('.providers .provider-search').hasClass('active')){
            $('.providers .provider-search').removeClass('active');
        } else{
            $('.providers .provider-search').addClass('active');
        }
    });

    $(function() { //shorthand document.ready function
        /*$('#search').on('submit', function(e) { //use on if jQuery 1.7+
            $('.providers .provider-search').removeClass('active');
        });*/
        document.addEventListener('mouseup', closeMapSearch);
    });
});