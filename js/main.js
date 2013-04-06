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
            //for now we only have the admin view, but it will change soon
            if (true) {
                new AdminView();
            }
        }
    });


    //the brand view
    var brandView = Parse.View.extend({
        className: "content",
        template: _.template($('#brand-template').html()),
        events: {
            "submit": "selectBrand"
        },
        initialize: function() {
        },
        render: function() {
            /*
            var brand_query = new Parse.Query(Brand);
            this.$el.html(this.template(this.model.attributes));
            return this;
            */
        },
        selectBrand: function() {
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
            var venue_id = $(event.target).find("input[name=venue-checkboxes]:checked").val();
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
            var brand_id = $(event.target).find(":selected").val();
            console.log(brand_id);
            new VenueView();
            return false;
        }

    });

    var appView = new AppView;

    /*

    var brand_query = new Parse.Query(Brand);
    brand_query.find({
      success: function(brands) {
        var brand_template_compiled = _.template($('#brand-template').html(),{brands:brands});
        $(".content").html(brand_template_compiled);
        $("#pick-brand").submit(function(){
            var brand_id = $('#brand-dropdown').find(":selected").val();

            var venue_query = new Parse.Query(Venue);

            venue_query.find({
              success: function(venues) {

                var venue_template_compiled = _.template($('#venue-template').html(),{venues:venues,brand:brand_id});

                $("#save-venue").remove();
                $(".content").append(venue_template_compiled);

                $("#save-venue").submit(function(){

                    var venue_id = $("input[name=venue-checkboxes]:checked").val();

                    //Get the venue object based on what was checked
                    var found_venue = venues.filter(function(venue) {
                        if (venue.id == venue_id) {
                            return venue
                        }
                    });

                    //Convert array of one into one venue
                    found_venue = found_venue[0];
                    
                    //Get the select brand
                    var found_brand = brands.filter(function(brand) {
                        if (brand.id == brand_id) {
                            return brand
                        }
                    });

                    //Convert array of one into one venue
                    found_brand = found_brand[0];

                    //Save brand into venue
                    var relation = found_venue.relation('brands');
                    relation.add(found_brand);
                    found_venue.save()

                    alert('done!');
                    return false;
                });

              },
              error: function(object, error) {
                console.log("something weird happened");
              }
            });
            return false;
        });

      },
      error: function(object, error) {
        console.log("something weird happened");
      }
    });

    */

});
