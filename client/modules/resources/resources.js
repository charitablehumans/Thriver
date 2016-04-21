function removeActiveClassResources(){
    $('.resourcesContent li').removeClass('active');
    $('.resourcesTabs li').removeClass('active');
}

// Events
Template.resources.events({
    // Switch tabs
    'click ul.resourcesTabs > li': function (event) {
        var index = $(event.target).index() + 1;
        // Set the active tab
        $('ul.resourcesTabs > li').removeClass('active');
        $(event.target).addClass('active');
        
        // Set the active content
        $('ul.resourcesContent > li').removeClass('active');
        $('ul.resourcesContent > li:nth-child(' + index + ')').addClass('active');
    },
    'click .loginToRequest > button': function (event) {
        if (window.innerWidth >= 768) {
            $('.overlay').click();
            $('li.login').click();
        } 
        /*else{
            removeOpenAccounts();
            $('.mobileOverlay').click();
            $('.menuToggle').click();
            $('.mobileMenu li.donate').click();
        }*/
    }
});
