$(function() {

    Parse.$ = jQuery;


    //initialize with parse's credential
    Parse.initialize("EE1v8eLeCMeQmXAQKjcg2fvjLR2OoO8AzYY3KQfx", "o9B99wDktfYCBWAFQVwhpVBhCswLKQ14vE2rBDuO");


    // Models
    //-------
    var Venue = Parse.Object.extend("Venue");
    var Brand = Parse.Object.extend("Brand", {

        initialize: function() {
            console.log('init brand');
        }


    });


    // Brand Collection
    //-----------------

    var BrandList = Parse.Collection.extend({
        model:Brand
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
    var AdminView = Parse.View.extend({
        el: ".content",
        //template: _.template($('#brand-template').html()),
        events: {
            "submit": "selectBrand"
        },
        initialize: function() {

            _.bindAll(this, 'render', 'selectBrand');

            //create our collection of brands
            this.brands = new BrandList;
            
            //fetch the list
            this.brands.fetch();


            /*
            console.log(this.brands.length);

            this.brands.fetch({
                success: function(collection) {
                    collection.each(function(object) {
                        console.warn(object.get('name'));
                    });
                },
                error: function(collection, error) {
                    // The collection could not be retrieved.
                }
            });
            */


            //this.render();

        },
        render: function() {

            console.log('allo quoi');
            //console.log(this.brands);
            //this.$el.html(_.template($('#some-template').html()));
            //this.$el.html(this.template(b.toJSON()));
            return this;
        },
        selectBrand: function() {
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
