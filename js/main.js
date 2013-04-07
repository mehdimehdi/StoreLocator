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
        el:$("#app-container"),

        events: {
            'foundBrand' : 'foundBrand'
        },

        initialize: function() {

            //create our collection of venues
            this.brands = new BrandList;
            
            //fetch the list
            this.brands.fetch();

            //bind the reset to show what's inside
            this.brands.on("reset",this.render,this);


        },
        render: function() {

            var self = this;

            //inserting the right template
            this.$el.html(_.template($("#app-template").html()));


            //adding the tooltip, not really sure this needs to be added at this time yet.
            $("a").tooltip({
                'selector': '',
                'placement': 'bottom'
            });


            //setting up the typeahead with the brand collection, and the callback for one selected
            $('.typeahead').typeahead({
                                source: this.brands.pluck('name'),
                                updater: function(brandName) {

                                    //triggering the event when a brand has been chosen
                                    $(self.el).trigger('foundBrand', brandName);
                                }
            });

            //adding the map when everything is properly loaded
            google.maps.event.addDomListener(window, 'load', this.map());

        },
        foundBrand: function(event,brandName) {

            var self = this;

            //based on the name, let's look up the brand object
            brand = this.brands.find(function(item){
                return item.get('name') == brandName;
            })

            var query = new Parse.Query(Venue);
            query.equalTo("brands", brand);
            query.find({
                success: function(venues) {

                    //for each of the venue who carry the brand
                    for (var i=0; i<venues.length;i++) {

                        //get the longitude and latitude
                        var myLatlng = new google.maps.LatLng(venues[i].get('location')['latitude'],venues[i].get('location')['longitude']);

                        //add the marker to the map
                        var marker = new google.maps.Marker({
                            position: myLatlng,
                            map: self.map,
                            title:"Hello World!"
                        });

                        //Add the listener so we can add the infor window
                        google.maps.event.addListener(marker, 'click', function() {

                            //create the info window
                            var infoWindow = new google.maps.InfoWindow({ 
                                size: new google.maps.Size(150,50)
                            });
                            
                            //add some fake content for now.
                            infoWindow.setContent("hello"); 


                            //open the info window
                            infoWindow.open(this.map,marker);
    
                            //allow to close the info window when clicking on the map
                            google.maps.event.addListener(this.map, 'click', function() {
                                infoWindow.close();
                            });

                        });

                    }
                    
                }
            });
            

        },

        map: function() {

            //the properties of the map
            var mapOptions = {
                    center: new google.maps.LatLng(37.770, -122.440),
                    zoom: 13,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            this.map = new google.maps.Map($("#map-canvas").get(0),mapOptions);
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
