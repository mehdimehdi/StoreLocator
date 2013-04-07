$(function() {

    Parse.$ = jQuery;


    //initialize with parse's credential
    Parse.initialize("EE1v8eLeCMeQmXAQKjcg2fvjLR2OoO8AzYY3KQfx", "o9B99wDktfYCBWAFQVwhpVBhCswLKQ14vE2rBDuO");


    // Models
    //-------
    var Venue = Parse.Object.extend("Venue");
    var Brand = Parse.Object.extend("Brand");


    // Collections
    //-----------------

    var BrandList = Parse.Collection.extend({
        model:Brand
    });

    var VenueList = Parse.Collection.extend({
        model:Venue
    });


    // Views
    //------

    //the app view
    var AppView = Parse.View.extend({
        el:$("#store-locator"),
        initialize: function() {
            this.render(); 
        },
        render: function() {
            console.log('app view');
        }
        
    });


    //the admin view
    var VenueView = Parse.View.extend({

        //the anchor
        el: ".venue",

        //the template for the brand
        template: _.template($('#venue-template').html()),
        events: {
            "submit #save-venue": "saveVenue"
        },

        //initialize the whole view
        initialize: function() {

            var self = this;

            //create our collection of venues
            this.venues = new VenueList;
            
            //fetch the list
            this.venues.fetch();

            //bind the reset to show what's inside
            this.venues.on("reset",this.render,this);

        },

        //render the list of brands
        render: function() {

            this.$el.html(this.template({venues:this.venues.models}));
            return this;

        },

        saveVenue: function(event) {

            //get the id of the venue
            var venue_id = $(event.target).find("input[name=venue-checkboxes]:checked").val();

            //get the venue
            var venue = this.venues.get(venue_id)

            //Save brand into venue
            var relation = venue.relation('brands');
            relation.add(this.options.brand);
            venue.save()
            alert('done!');

            return false;
        }

    });




    //the admin view
    var AdminView = Parse.View.extend({

        //the anchor
        el: ".content",

        //the template for the brand
        template: _.template($('#brand-template').html()),
        events: {
            "submit #pick-brand": "selectBrand"
        },

        //initialize the whole view
        initialize: function() {

            var self = this;

            //create our collection of brands
            this.brands = new BrandList;
            
            //fetch the list
            this.brands.fetch();

            //bind the reset to show what's inside
            this.brands.on("reset",this.render,this);

        },

        //render the list of brands
        render: function() {

            this.$el.html(this.template({brands:this.brands.models}));
            return this;

        },

        selectBrand: function(event) {

            //get the id of the brand selected
            var brand_id = $(event.target).find(":selected").val();

            //pass it to the view to save
            new VenueView({brand:this.brands.get(brand_id)});

            return false;
        }

    });


    var AppRouter = Parse.Router.extend({
        routes: {
            "admin": "admin", // matches http://example.com/#/admin
            "*actions": "app" // matches http://example.com/#anything, basically the default app

        },

        initialize: function(options) {

        },

        admin: function() {
            new AdminView();
        },

        app: function() {
            new AppView();
        },

    });

    // Initiate the router
    var appRouter = new AppRouter;

    Parse.history.start();

});
