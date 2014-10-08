	//Load the map after the page loads
	if (window.addEventListener){ // W3C standard
	  window.addEventListener('load', function(){worldmap()}, false); //true means that this request will be ignored if auto is set to off
	} 
	else if (window.attachEvent){ // Microsoft
		window.attachEvent('onload', function(){worldmap()});
	}
	
	function worldmap(){
	  
		image_array=[];
		var div = document.getElementById('map');
		var width=1000;
		var height=400; 
		var paper = Raphael(div, width, height); //create the Raphael canvas in the map div
		//var paper = this;
                var background= paper.rect(0, 0, 1000, 400, 10).attr({
                    stroke: "none",
                    fill: "0-#9bb7cb-#adc8da"
                });
		//background.attr({fill: 'skyblue', 'stroke-width': 0}); 

		//create the map		
		paper.setStart();
		 for (var country in map_path.shapes) {
                    paper.path(map_path.shapes[country]).attr({stroke: "#ccc6ae", fill: "#f0efeb", "stroke-opacity": 0.25});
                }
		var world = paper.setFinish();
		
                world.hover(over, out);
		world.click(click);
		
		//show position of the user
		try {
                    navigator.geolocation && navigator.geolocation.getCurrentPosition(function (pos) {
                        paper.circle().attr({fill: "none", stroke: "#f00", r: 5}).attr(get_xy(pos.coords.latitude, pos.coords.longitude));
                    this.toFront();
		    });
                } catch (e) {}

		//create set of locations
		var location_set=paper.set();
		
		//create locations
		for (var location in locations){
			var loc=locations[location];
			var xy=get_xy(loc.lat, loc.lng);
			
			if (loc.color=='red') {
			  var loc_obj=paper.circle(xy.x, xy.y, 4).attr({fill: loc.color, stroke: 'gold', 'stroke-width': 2, cursor: 'pointer'});
			  loc_obj.year=loc.firstyear;
			  loc_obj.year=loc.lastyear;//fix this, it only will show the last year and I would like to show a range
			}
			else if(loc.color=='yellow'){
			  var loc_obj=paper.circle(xy.x, xy.y, 2).attr({fill: loc.color, stroke: 'DarkGreen', 'stroke-width': 2, cursor: 'pointer'});
			  loc_obj.year=loc.tripyear;
			}
			else
			{
			  var loc_obj=paper.circle(xy.x, xy.y, 2).attr({fill: loc.color, stroke: '#808080', 'stroke-width': 2, cursor: 'pointer'});
			  loc_obj.year=loc.tripyear;
			}
			
			loc_obj.city=loc.city;
			loc_obj.country=loc.country;
			loc_obj.url=loc.url;
			loc_obj.img=loc.img;
			loc_obj.x=xy.x;
			loc_obj.y=xy.y;
			
			location_set.push(loc_obj);
		}
					
		var name = document.getElementById('location_name');
		location_set.hover(overcity,outcity); 	//Adds event handlers for hovering over the element
		location_set.click(clickcity);

		// *********************************************Functions ********************************************
		var rectangle,textbox;
		
		function over(){
		  this.c = this.c || this.attr("fill");
		  this.stop().animate({fill: "#bacabd"}, 500);
                }
		
		function out(){
		  this.stop().animate({fill: this.c}, 500);
		}
		
		function click(){
		}
		
		function overcity(){
		    	this.attr({'stroke-width': 3});
			//image_array[this.id]=paper.image(this.img+'.jpg', this.x+8, this.y-160, 150, 150).scale(scale, scale, 0, 0);
			name.innerHTML=this.city+', '+this.country+' ('+this.year+')'+"<h1><br><br></h1>";
			/*rectangle = paper.rect(this.x+8, this.y-8,180,32,5).attr({fill: "white", stroke: 'black', 'stroke-width': 2, cursor: 'pointer'});
			textbox = paper.text(this.x+98, this.y+7, this.name);
			textbox.attr({ "font-size": 16, "font-family": "Arial, Helvetica, sans-serif" });
			*/
                }
		
				
		function outcity(){
			this.attr({'stroke-width': 2});
			name.innerHTML='<h1><br><br></h1>';
			/*
			rectangle.remove();
			textbox.remove();
			*/
		}
		function clickcity(){
			window.location.href = this.url;
		}
		
		function get_xy(lat, lng){  //http://stackoverflow.com/questions/14329691/covert-latitude-longitude-point-to-a-pixels-x-y-on-mercator-projection
			
			// This map would show the world, limit latitude and longitude for a specific geographical area
//var south = deg2rad(-90);
//var north = deg2rad(90);
//var west = deg2rad(-180);
//var east = deg2rad(180);
			//var latRad = deg2rad(lat);
			//var lngRad = deg2rad(lng);
			
			//var Mercy = Math.log(Math.tan(latRad/2+Math.PI/4));
			
			//var ymin = Math.log(Math.tan(south/2+Math.PI/4));
			//var ymax = Math.log(Math.tan(north/2+Math.PI/4));
			
			//var yfactor = width/(east - west);
			//var xfactor = height/(ymax-ymin);
			
			//var x = (lngRad-west)*xfactor;
			//var x = (lng+180)*(width/360);
			
			//var y = (ymax-Mercy)*yfactor;
			//var y = (height/2) - (width*Mercy/(2*Math.PI));
			
			var x = lng*(2.6938) + 465.4;
			var y = lat*(-2.6938) + 227.066;
			return { x:x, y:y}
		}
		
//		function deg2rad(deg)
//		{
//		    var Rad = deg*Math.PI/180;
//		    return Rad;
//		}
	}
		
	var d = new Date();
	// *********************************************Location Data*********************************************
	var locations={
		0: { 
			city: 'Madrid',
			country: 'Spain',
			lat: 40.4000,
			lng: -3.6833,
			color: 'red',
			url: '#Madrid',
			img: 'Madrid',
			firstyear: 1988,
			lastyear: d.getFullYear(),
		},
		1: { 
			city: 'Shanghai',
			country: 'China',
			lat: 31.10,
			lng: 121.366,
			color: 'yellow',
			url: '#Shanghai',
			img: 'shanghai',
			tripyear: 2013
		},
		2: { 
			city: 'New York',
			country: 'USA',
			lat: 40.7,
			lng: -73.90,
			color: 'yellow',
			url: '#NewYork',
			img: 'newyork',
			tripyear: 2011
		},
		3: { 
			city: 'Los Angeles',
			country: 'USA',
			lat: 34.0,
			lng: -118.25,
			color: 'yellow',
			img: 'losangeles',
			url: 'http://www.flickr.com/photos/ahhdrjones/2233960320/sizes/l/in/photostream/',
			tripyear: 2011
		},
		4: { 
			city: 'Beijing',
			country: 'China',
			lat: 39.9139,
			lng: 116.3917,
			color: 'red',
			img: 'Beijing',
			url: '#Beijing',
			firstyear:2013,
			lastyear:2014
		},
		5: { 
			city: 'Chicago',
			country: 'USA',
			lat: 41.8819,
			lng: -87.6278,
			color: 'red',
			img: 'Chicago',
			url: '#Chicago',
			firstyear: 2010,
			lastyear: 2013
		},
		6: { 
			city: 'Herrera de Alc&aacute;ntara',
			country: 'Spain',
			lat: 39.6333,
			lng: -7.4000,
			color: 'red',
			img: 'Herrera de Alc&aacute;ntara',
			url: '#Herrera',
			firstyear: 1988,
			lastyear: d.getFullYear()
		},
		7: { 
			city: 'Singapore',
			country: 'Singapore',
			lat: 1.30,
			lng: 103.83,
			color: 'yellow',
			img: 'Singapore',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2013
		},
		8: {
		  	city: 'Boston',
			country: 'USA',
			lat: 42.3581,
			lng: -71.0636,
			color: 'yellow',
			img: 'Boston',
			url: '#Boston',
			tripyear: 2014,
		},
		9: { 
			city: 'Torino',
			country: 'Italy',
			lat: 45.0667,
			lng: 7.7000,
			color: 'yellow',
			img: 'Torino',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2011
		},
		10: { 
			city: 'London',
			country: 'UK',
			lat: 51.5072,
			lng: 0.1275,
			color: 'yellow',
			img: 'London',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2009
		},
		11: { 
			city: 'Paris',
			country: 'France',
			lat: 48.8567,
			lng: 2.3508,
			color: 'yellow',
			img: 'Paris',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2001
		},
		12: { 
			city: 'Barcelona',
			country: 'Spain',
			lat: 41.3833,
			lng: 2.1833,
			color: 'yellow',
			img: 'Paris',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2009
		},
		13: { 
			city: 'Stockholm',
			country: 'Sweden',
			lat: 59.3294,
			lng: 18.0686,
			color: 'yellow',
			img: 'Paris',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2013
		},
		14: { 
			city: 'Prague',
			country: 'Czech Republic',
			lat: 50.0833,
			lng: 14.4167,
			color: 'yellow',
			img: 'Prague',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2009
		},
		15: { 
			city: 'Seattle',
			country: 'USA',
			lat: 47.6097,
			lng: -122.3331,
			color: 'yellow',
			img: 'Seattle',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2011
		},
		16: { 
			city: 'San Francisco',
			country: 'USA',
			lat: 37.7833,
			lng: -122.4167,
			color: 'yellow',
			img: 'SanFrancisco',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2012
		},
		17: { 
			city: 'Cambridge',
			country: 'UK',
			lat: 52.2050,
			lng: 0.1190,
			color: 'yellow',
			img: 'Cambridge',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2013
		},
		18: { 
			city: 'Rome',
			country: 'Italy',
			lat: 41.9000,
			lng: 12.5000,
			color: 'yellow',
			img: 'Rome',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2005
		},
		19: { 
			city: 'Istanbul',
			country: 'Turkey',
			lat: 41.0136,
			lng: 28.9550,
			color: 'yellow',
			img: 'Istanbul',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2009
		},
		20: { 
			city: 'Xi\'an',
			country: 'China',
			lat: 34.2667,
			lng: 108.9000,
			color: 'yellow',
			img: 'Xian',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2012
		},
		21: { 
			city: 'Kuala Lumpur',
			country: 'Malaysia',
			lat: 3.1357,
			lng: 101.6880,
			color: 'yellow',
			img: 'KL',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2013
		},
		22: { 
			city: 'Venezia',
			country: 'Italy',
			lat: 45.4375,
			lng: 12.3358,
			color: 'yellow',
			img: 'Venice',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2013
		},
		23: { 
			city: 'Denver',
			country: 'USA',
			lat: 39.7392,
			lng: -104.9847,
			color: 'yellow',
			img: 'Denver',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2011
		},
		24: { 
			city: 'Las Vegas',
			country: 'USA',
			lat: 36.1215,
			lng: -115.1739,
			color: 'yellow',
			img: 'LasVegas',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2011
		},
		25: { 
			city: 'San Diego',
			country: 'USA',
			lat: 32.7150,
			lng: -117.1625,
			color: 'yellow',
			img: 'SanDiego',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2014
		},
		26: { 
			city: 'Brussels',
			country: 'Belgium',
			lat: 50.8500,
			lng: 4.3500,
			color: 'yellow',
			img: 'Brussels',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2009
		},
		27: { 
			city: 'Amsterdam',
			country: 'Holland',
			lat: 52.3667,
			lng: 4.9000,
			color: 'yellow',
			img: 'Amsterdam',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2009
		},
		28: { 
			city: 'Saint Petersburg',
			country: 'Russia',
			lat: 59.9500,
			lng: 30.3000,
			color: 'yellow',
			img: 'SaintPetersburg',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2014
		},
		29: { 
			city: 'Tallin',
			country: 'Estonia',
			lat: 59.4372,
			lng: 24.7453,
			color: 'yellow',
			img: 'Tallin',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2014
		},
		30: { 
			city: 'Dublin',
			country: 'Ireland',
			lat: 53.3478,
			lng: -6.2597,
			color: 'yellow',
			img: 'Dublin',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2013
		},
		31: { 
			city: 'Positano',
			country: 'Italy',
			lat: 40.6333,
			lng: 14.4833,
			color: 'yellow',
			img: 'Positano',
			url: 'http://www.flickr.com/photos/jjcbaron/5072266832/sizes/l/in/photostream/',
			tripyear: 2012
		},
		32: { 
			city: 'Cambridge',
			country: 'USA',
			lat: 42.3736,
			lng: -71.1106,
			color: 'red',
			img: 'Cambridge',
			url: '#Cambridge',
			firstyear: 2014,
			lastyear: d.getFullYear()
		},
		33:
		{
		  	city: 'New Orleans',
			country: 'USA',
			lat:  29.9667,
			lng: -90.0500,
			color: 'silver',
			img: 'NewOrleans',
			url: '#NewOrleands',
			tripyear: 2011,
		},
		34:
		{
		  	city: 'Cancun',
			country: 'Mexico',
			lat:  21.1606,
			lng: -86.8475,
			color: 'yellow',
			img: 'cancun',
			url: '#cancun',
			tripyear: 2013,
		}
	}
	

