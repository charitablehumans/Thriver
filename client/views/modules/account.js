// Global on purpose
lastLogin = new ReactiveVar(new Date());
organization = new ReactiveVar('');

/**
 * Determine last login and set to Reactive var
 * @method
 */
var getLastLogin = function () {
    Meteor.call('lastLogin', function (error, result) {
        // Update reactive var
        lastLogin.set(result);
    });
},

/**
 * Get the user's assigned organization, if they have one
 * @method
 */
getOrganization = function () {
    Meteor.call('getOrganization', function (error, result) {
        // Update reactive var
        organization.set(result);
    });
};

// Bind to login and on load
Template.body.onCreated(getLastLogin);
Accounts.onLogin       (getLastLogin);
Template.body.onCreated(getOrganization);
Accounts.onLogin       (getOrganization);

/**
 * Assign a user's organization upon account creation
 * @method
 *   @param {string}   token - The email verification token
 *   @param {Function} done  - Callback once verification flow is complete
 */
Accounts.onEmailVerificationLink(function (token, done) {
    // Verify email
    Accounts.verifyEmail(token, function (error) {
        if (error) {
            console.error(error);
            return;
        }
        
        // Assign organization
        Meteor.call('assignOrganization', Meteor.userId(), function () {
            // Update reactive vars
            getLastLogin();
            getOrganization();
            
            // Complete
            done();
        });
    });
});

function removeActiveClass(){
    $('.accountDetailsContent > li').removeClass('active');
}

function removeOpenAccounts(){
    document.body.classList.remove('registeredEventsM', 'subscriptionsManagerM', 'notificationsM', 'profileSettingsM');
}


//Register Form
Template.register.events({
    /**
     * Register a new account
     * @method
     *   @param {$.Event} - Form submission event
     */
    'submit form': function (event) {
        if (! (event instanceof $.Event))
            return;
        
        // Prevent navigation
        event.preventDefault(); event.stopPropagation();
        
        // Get form values
        var name     = event.target.name.value,
            email    = event.target.email.value,
            password = event.target.password.value,
            i, j,
        
        // Handle login errors    
        handleError = function (message) {
            var error = event.target.querySelector('#register-error');
            
            if (error instanceof Element)
                error.textContent = message;
        };
        
        // Enforce proper name format by removing excess spaces,
        // making all lower case, then capitalizing just the first character
        name = name.trim().replace(/\s+/g, ' ').toLowerCase().split(/\s/);
        for (i = 0, j = name.length; i < j; ++i)
            name[i] = name[i].charAt(0).toUpperCase() + name[i].substr(1);
        name = name.join(' ');
        
        Accounts.createUser({
            email: email,
            password: password,
            profile: {
                // Name
                firstname: name.replace(/^(.+)\s.+/, '$1'),
                lastname : name.replace(/^.+\s(.+)/, '$1'),
                
                // Email subscriptions by default
                subscriptions: {
                    pressReleases: true,
                    actionAlerts : true,
                    newsletter   : true
                }
            }
        },
        /**
         * Handle Account creation callback
         * @method
         *   @param {Error} error - Option argument passed on error
         */
        function (error) {
            if (error) {
                handleError(error);
                return;
            }
            
            // Send email verification email
            Meteor.call('sendVerificationEmail', Meteor.userId());
            
            // Notify user to check email
            document.querySelector('section.register form').classList.add('hide');
            document.querySelector('section.register p').classList.remove('hide');
        });
        
    },
    /**
     * Ensure password is the same in both fields
     * @method
     *   @param {$.Event} event - Event received from keyup event
     */
    'keyup [name="repeat"]': function (event) {
        if (! (event instanceof $.Event) )
            return;
        
        var parent   = event.target.parentElement,
            password = parent.parentElement['password'];
        
        if (password instanceof Element)
            if (password.value === event.target.value) {
                // Let user know passwords match
                parent.classList.remove('noMatch');
                // Allow form submit now
                parent.parentElement['submitButton'].disabled = false;
                return;
            }
        
        // By default indicate there's no match
        parent.classList.add('noMatch');
        // And prevent the form from submitting until they do match
        parent.parentElement['submitButton'].disabled = true;
    }
});



Template.utility.helpers({
    name: function () {
        var user = Meteor.user();
        if (user && user.profile)
            return user.profile.firstname + ' ' + user.profile.lastname;
        return '';
    },
    // Show notifications on bell icon
    show: function () {
        if (Meteor.user())
            return true;
        return false;
    },
    // Show notification count
    count: function () {
        // Return count
        return count.get();
    }
});

// Logout
Template.utility.events({
    'click li.logout button': function (event) {
        document.body.classList.remove('rightSmall', 'rightMedium', 'rightLarge', 'leftSmall', 'leftMedium');
        event.preventDefault(); event.stopPropagation();
        Meteor.logout(function (error) {
            if (error instanceof Error)
                console.error(error);
        })
    }
});

