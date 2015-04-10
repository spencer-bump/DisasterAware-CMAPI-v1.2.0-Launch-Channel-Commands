OWF.relayFile = 'js/eventing/rpc_relay.uncompressed.html';
// case #75313

var logger;
var appender;

// message variables
var widgetPayloadSpan 		= "";
var errorMessage 					= "";
var widgetNameLaunched 		= "";
var widgetChannel 				= "";
var launchResultsMessage 	= "";

// jQuery variables
var $button_field 				= $('#button_field');
// Message Display Area
var $isRunning  					= $('#isRunning');
var $widgetPayload 				= $('#widgetPayload');
var $widgetName 					= $('#widgetName');
var $widgetChannel 	      = $('#widgetChannel');
var $launchResults 	      = $('#launchResults');
var $error_panel 		      = $('#error-panel');

/************************ Start Navigation ************************/
	var clearAll = function () {
		$('#launch').hide();
 		$('#disaster').hide();
 		$('#overlay').hide();
 		$('#feature').hide();
 		$('#view').hide();
 		$('#status').hide();
 		$('#listeners').hide();
	};
	
  $('#launch-nav').on('click',function() {
  	clearAll();
  	$('#launch').show();
  });
  $('#disaster-nav').on('click',function() {
  	clearAll();
  	$('#disaster').show();
  });
  $('#overlay-nav').on('click',function() {
  	clearAll();
  	$('#overlay').show();
  });
  $('#feature-nav').on('click',function() {
  	clearAll();
  	$('#feature').show();
  });
  $('#view-nav').on('click',function() {
  	clearAll();
  	$('#view').show();
  });
  $('#status-nav').on('click',function() {
  	clearAll();
  	$('#status').show();
  });
  $('#listeners-nav').on('click',function() {
  	clearAll();
  	$('#listeners').show();
  });
  
/************************ End Navigation ************************/




/************************ Start Publish Channel Function ************************/
	var publishChannel = function (channel, message) {
		$widgetChannel.empty().append("Channel: " + channel);
		$widgetPayload.empty().append("Payload: " + JSON.stringify(message));
		$launchResults.empty(); // clear display
		logger.debug('Publishing channel: '+ channel + ', Publishing message: ' + JSON.stringify(message));
		console.log(JSON.stringify(message));
		$('#error-sender').html("sender: ");
		$('#error-type').html("type: ");
		$('#error-message').html("message: ");
		$('#error-error').html("error: ");
		OWF.Eventing.publish(channel, message);
	}
/************************ End Publish Channel Function ************************/


/************************ Start DisasterAware Channels  ************************/
	// DisasterAware Channels
	
	var $layerId							= $('#filter-layerId');
	var $filter_fieldName			= $('#filter-fieldName');
	var $filter_text					= $('#filter-text');
	var $layerId_toggle				= $('#filter-layerId-toggle');
	var $channelBookmarkId 	  = $('#channelBookmarkId');
	var $channelBookmarkUrl 	= $('#channelBookmarkUrl');
	 /*** Locale Translation Code ***/
	 // Initialize Translation Locale default to Spanish 
	 var locale_selected = "ES";
	 var locale_button_text = "Spanish"

	 // Select Language to Translate to
	 $( "#select-locale" )
	  .change(function () {
	  	locale_selected = "";
	    $( "#select-locale option:selected" ).each(function() {
	      locale_selected = $( this ).val();
	      locale_button_text = $( this ).text();
	    });
	    $('#change_locale').text("Translate To "+ locale_button_text);
	    var str = $('#change_locale').text();
	  })
	  .change();

	// Translate language based on selection
	$button_field.on('click', '#change_locale', function(){
		console.log("change locale");
		cmapi_channel = "gbsp.localeChannel";
		cmapi_message = { "locale": locale_selected };
		publishChannel(cmapi_channel, cmapi_message);
	});

	 /*** End Locale Translation Code ***/

	/*** Filter Code ***/
	// Add Filter
	$layerId.val("Recent_Earthquakes");
	$layerId_toggle.val("Recent_Earthquakes");
	$filter_fieldName.val("region");
	$filter_text.val("oklahoma");

	$button_field.on('click', '#add_filter', function(){ 
		console.log("add filter");
		cmapi_channel = "layer.filter.add";
		// Filter 'Recent_Earthquakes' layer in the 'oklahoma' 'region'.
		cmapi_message = { 
			"layerId": $layerId.val(), 
			"filter": {
				"region": {
					"fieldName": $filter_fieldName.val(),
					"text": $filter_text.val()
				}
			} 
		};
		publishChannel(cmapi_channel, cmapi_message);
	});

	// Toggle Filter
	// Use the programmed "map.view.center.location" to position map to view toggle results.
	$button_field.on('click', '#toggle_filter', function(){ 
		console.log("toggle filter");
		cmapi_channel = "layer.filter.toggle";
		cmapi_message = { "layerId": $layerId_toggle.val() };
		publishChannel(cmapi_channel, cmapi_message);
	});
	/*** End Filter Code ***/

	/*** Bookmark Code ***/
	// default bookmarks for channel commands
	var channelBookmarkIdPayload = { "bookmarkId": 10018 }; // good location to test filter toggle
	var channelBookmarkUrlPayload = { "bookmarkUrl": "http://local.msmv.pdc.org:8080/msmvng/msmvng/?bookmark=10017" };
	// load bookmark channel input fields with default values
	$channelBookmarkId.val(channelBookmarkIdPayload.bookmarkId);
	$channelBookmarkUrl.val(channelBookmarkUrlPayload.bookmarkUrl);

	// change channel payload to use bookmarkId with radio button
	$('#id').on('change', function () {
		channelBookmarkIdPayload = {};
		channelBookmarkIdPayload[$(this).val()] = $('#channelBookmarkId').val();
		console.log(channelBookmarkIdPayload);
		$('#load_bookmark').text("Load Bookmark by ID");
		
	});

	// change channel payload to use bookmarkUrl with radio button
	$('#url').on('change', function () {
		channelBookmarkIdPayload = {};
		channelBookmarkIdPayload[$(this).val()] = $('#channelBookmarkUrl').val();
		console.log(channelBookmarkIdPayload);
		$('#load_bookmark').text("Load Bookmark by URL");
	});

	// change channel payload if input field changes after radio button selected
	$('#channelBookmarkId').on('change', function () {
		channelBookmarkIdPayload ={};
		channelBookmarkIdPayload['bookmarkId'] = $(this).val();
	});

	// change channel payload if input field changes after radio button selected
	$('#channelBookmarkUrl').on('change', function () {
		channelBookmarkIdPayload ={};
		channelBookmarkIdPayload['bookmarkUrl'] = $(this).val();
	});

	// Load Bookmark
	$button_field.on('click', '#load_bookmark', function(){ // Alaska
		console.log("load bookmark");
		cmapi_channel = "org.pdc.bookmark.load";
		cmapi_message = channelBookmarkIdPayload;
		publishChannel(cmapi_channel, cmapi_message);
	});
	/*** End Bookmark Code ***/


	/*** Animation Code ***/
	
	var $startTime 					= $('#start-time');
	$startTime.val("1414270861000");
	$button_field.on('click', '#animation_time', function(){ 
		console.log("animation time");
		cmapi_channel = "map.animation.time";
		cmapi_message = { "time": $startTime.val() };
		publishChannel(cmapi_channel, cmapi_message);
	});
	/*** End Animation Code ***/
/************************ End DisasterAware Channels ************************/


/************************ Start Overlay Channels ************************/
// Overlay Channels
	var $overlayName					= $('#overlay-name');
	var $overlayId					  = $('#overlay-overlayId');
	var $parentId					  	= $('#overlay-parentId');
	var $ovelayIdAction				= $('#overlay-overlayId-action');
	var $overlayNameUpdate		= $('#overlay-name-update');
	var $overlayIdUpdate			= $('#overlay-overlayId-update');
	var $parentIdUpdate				= $('#overlay-parentId-update');
	var $overlayUrl 		      = $('#overlayUrl');

	// default overlay url
	$overlayName.val("myOverlayName");
	$overlayId.val("myOverlay");
	$parentId.val("myParentID");
	$button_field.on('click', '#create_overlay', function(){ 
		console.log("create overlay");
		overlayUrl = $overlayUrl.val();
		cmapi_channel = "map.overlay.create";
		cmapi_message = { 
						"name":  			$overlayName.val(),
						"overlayId": 	$overlayId.val(),
						"parentId":   $parentId.val()
					};
		publishChannel(cmapi_channel, cmapi_message);
	});

	// Set input field for Overlay Actions: Show, Hide, Remove
	$ovelayIdAction.val("myOverlay");
	// Show Overlay
	$button_field.on('click', '#show_overlay', function(){ 
		console.log("show overlay");
		cmapi_channel = "map.overlay.show";
		cmapi_message = { "overlayId": 	$ovelayIdAction.val() };
		publishChannel(cmapi_channel, cmapi_message);
	});

	// Hide Overlay
	$button_field.on('click', '#hide_overlay', function(){ 
		console.log("hide overlay");
		cmapi_channel = "map.overlay.hide";
		cmapi_message = { "overlayId": 	$ovelayIdAction.val() };
		publishChannel(cmapi_channel, cmapi_message);
	});

	// Remove Overlay
	$button_field.on('click', '#remove_overlay', function(){ 
		console.log("remove overlay");
		cmapi_channel = "map.overlay.remove";
		cmapi_message = { "overlayId": 	$ovelayIdAction.val() };
		publishChannel(cmapi_channel, cmapi_message);
	});

	// Update Overlay
	$overlayNameUpdate.val("updatedOverlayName");
	$overlayIdUpdate.val("myOverlay");
	$parentIdUpdate.val("updatedParentId");
	$button_field.on('click', '#update_overlay', function(){ 
		console.log("update overlay");
		cmapi_channel = "map.overlay.update";
		cmapi_message = { 
						"name":  			$overlayNameUpdate.val(),
						"overlayId": 	$overlayIdUpdate.val(),
						"parentId":   $parentIdUpdate.val()
					};
		publishChannel(cmapi_channel, cmapi_message);
	});
/************************ End Overlay Channels ************************/


/************************ Start Feature Channels ************************/
/************** data *******************/

// Two geojson features in the Singapore area with slight variations
var feature_data_1 = { 
	"type": "FeatureCollection",
    "features": [
      { "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [102.0, 0.5]},
        "properties": {"prop0": "value0"}
        },
      { "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [102.0, 0.0], [103.0, 1.0], [104.0, 0.0], [105.0, 1.0]
            ]
          },
        "properties": {
          "prop0": "value0",
          "prop1": 0.0
          }
        },
      { "type": "Feature",
         "geometry": {
           "type": "Polygon",
           "coordinates": [
             [ [100.0, 0.0], [101.0, 0.0], [101.0, 1.0],
               [100.0, 1.0], [100.0, 0.0] ]
             ]
         },
         "properties": {
           "prop0": "value0",
           "prop1": {"this": "that"}
           }
         }
       ]
     };

 var feature_data_2 = { 
	"type": "FeatureCollection",
    "features": [
      { "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [104.0, 2.0]},
        "properties": {"prop0": "value0"}
        },
      { "type": "Feature",
        "geometry": {
          "type": "LineString",
          "coordinates": [
            [104.0, 3.0], [105.0, 0.0], [106.0, 3.0], [107.0, 0.0]
            ]
          },
        "properties": {
          "prop0": "value0",
          "prop1": 0.0
          }
        },
      { "type": "Feature",
         "geometry": {
           "type": "Polygon",
           "coordinates": [
             [ [100.0, 0.0], [101.0, 1.0], [101.0, 2.0],
               [100.0, 1.0], [100.0, 0.0] ]
             ]
         },
         "properties": {
           "prop0": "value0",
           "prop1": {"this": "that"}
           }
         }
       ]
     };

  // Two KML features - blue markers at slightly different locations in the eastern Pacific

	var feature_data_3 = '' +
						'<?xml version="1.0" encoding="UTF-8" ?>' +
							'<kml xmlns="http://www.opengis.net/kml/2.2">' +
							    '<Document>' +
							        '<Style id="1">' +
							            '<IconStyle>' +
							                '<scale>1</scale>' +
							                '<Icon>' +
							                    '<href>assets/images/draw_placemarkers/blue_01.png</href>' +
							                '</Icon>' +
							                '<hotSpot x="0.5" y="1" xunits="fraction" yunits="fraction" />' +
							                '<LabelStyle>' +
							                    '<color>ff0e0ef5</color>' +
							                '</LabelStyle>' +
							            '</IconStyle>' +
							        '</Style>' +
							        '<Placemark>' +
							            '<name>Placemarkasdf</name>' +
							            '<description><![CDATA[]]></description>' +
							            '<styleUrl>#1</styleUrl>' +
							            '<Point>' +
							                '<tesselate>1</tesselate>' +
							                '<coordinates>159.88203125,45.88833017263426,0</coordinates>' +
							            '</Point>' +
							        '</Placemark>' +
							   ' </Document>' +
							'</kml>' +
						'';


	var feature_data_4 = '' +
						'<?xml version="1.0" encoding="UTF-8" ?>' +
							'<kml xmlns="http://www.opengis.net/kml/2.2">' +
							    '<Document>' +
							        '<Style id="1">' +
							            '<IconStyle>' +
							                '<scale>1</scale>' +
							                '<Icon>' +
							                    '<href>assets/images/draw_placemarkers/blue_01.png</href>' +
							                '</Icon>' +
							                '<hotSpot x="0.5" y="1" xunits="fraction" yunits="fraction" />' +
							                '<LabelStyle>' +
							                    '<color>ff0e0ef5</color>' +
							                '</LabelStyle>' +
							            '</IconStyle>' +
							        '</Style>' +
							        '<Placemark>' +
							            '<name>Placemarkasdf</name>' +
							            '<description><![CDATA[]]></description>' +
							            '<styleUrl>#1</styleUrl>' +
							            '<Point>' +
							                '<tesselate>1</tesselate>' +
							                '<coordinates>159.08203125,45.08833017263426,0</coordinates>' +
							            '</Point>' +
							        '</Placemark>' +
							   ' </Document>' +
							'</kml>' +
						'';

// var feature_data_5 = {
// "overlayId":"gbspTestCaseOverlayId",
// "featureId":"gbspTestCaseFeatureId",
// "feature":"<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\" xmlns:kml=\"http://www.opengis.net/kml/2.2\" xmlns:atom=\"http://www.w3.org/2005/Atom\"><Placemark id=\"gbspTestCaseFeatureId\"><name>gbspTestCase</name><description><![CDATA[gbspTestCase Description]]></description><Style><IconStyle><scale>0.1</scale><Icon><href>data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADSCAYAAAB0MU2vAAAgAElEQ…71VAvN3xGJgxa5r4b/QS+ZwAQCEhgkEmARBhWZPcL2hO7/AV1tNyuKimWpAAAAAElFTkSuQmCC</href></Icon><hotSpot x=\"0.5\" y=\"0\" xunits=\"fraction\" yunits=\"fraction\"></hotSpot></IconStyle></Style><Point><coordinates>10,10,0 </coordinates></Point></Placemark></kml>",
// "name":"gbspTestCase"
// };

var feature_data_5 = "<kml xmlns=\"http://www.opengis.net/kml/2.2\" xmlns:gx=\"http://www.google.com/kml/ext/2.2\" xmlns:kml=\"http://www.opengis.net/kml/2.2\" xmlns:atom=\"http://www.w3.org/2005/Atom\">" + 
												"<Placemark id=\"gbspTestCaseFeatureId\">" + 
													"<name>gbspTestCase</name>" + 
													"<description><![CDATA[gbspTestCase Description]]></description>" + 
													"<Style>" + 
														"<IconStyle>" + 
															"<scale>0.1</scale>" + 
															"<Icon>" + 
																"<href>data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADSCAYAAAB0MU2vAAAgAElEQ…71VAvN3xGJgxa5r4b/QS+ZwAQCEhgkEmARBhWZPcL2hO7/AV1tNyuKimWpAAAAAElFTkSuQmCC</href>" + 
															"</Icon>" + 
															"<hotSpot x=\"0.5\" y=\"0\" xunits=\"fraction\" yunits=\"fraction\"></hotSpot>" + 
														"</IconStyle>" + 
													"</Style>" + 
													"<Point>" +
														"<coordinates>10,10,0 </coordinates>" + 
													"</Point>" + 
												"</Placemark>" + 
											"</kml>";


var feature_data_6 = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://www.opengis.net/kml/2.2"><Document><Style id="1"><LineStyle><color>ff000000</color><width>2</width></LineStyle><PolyStyle><color>7f000000</color></PolyStyle></Style><Placemark><name>GPSP Example</name><description><![CDATA[GPSP Example]]></description><styleUrl>#1</styleUrl><Polygon><tesselate>1</tesselate><outerBoundaryIs><LinearRing><coordinates>9.989662170410156,9.991843267457002,0\n10.009231567382812,9.991843267457002,0\n10.009231567382812,10.00638190424161,0\n9.989662170410156,10.00638190424161,0\n9.989662170410156,9.991843267457002,0</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark></Document></kml>';
// "<?xml version=\"1.0\" encoding=\"UTF-8\"?><kml xmlns=\"http://www.opengis.net/kml/2.2\"><Document><Style id=\"1\"><LineStyle><color>ff000000</color><width>2</width></LineStyle><PolyStyle><color>7f000000</color></PolyStyle></Style><Placemark><name>GPSP Example</name><description><![CDATA[GPSP Example]]></description><styleUrl>#1</styleUrl><Polygon><tesselate>1</tesselate><outerBoundaryIs><LinearRing><coordinates>9.989662170410156,9.991843267457002,0\n10.009231567382812,9.991843267457002,0\n10.009231567382812,10.00638190424161,0\n9.989662170410156,10.00638190424161,0\n9.989662170410156,9.991843267457002,0</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark></Document></kml>”;





 var features = {
 	"feature_data_1": feature_data_1,
 	"feature_data_2": feature_data_2,
 	"feature_data_3": feature_data_3,
 	"feature_data_4": feature_data_4,
 	"feature_data_5": feature_data_5,
 	"feature_data_6": feature_data_6
 };

 var formats = {
 	"feature_data_1": "geojson",
 	"feature_data_2": "geojson",
 	"feature_data_3": "kml",
 	"feature_data_4": "kml",
 	"feature_data_5": "kml",
 	"feature_data_6": "kml"
 };

 // window.setInterval(function() {
 //            var channelMsg = {
 //                            overlayId: 'gbspTestCaseOverlayId',
 //                            featureId: 'gbspTestCaseFeatureId',
 //                            feature: feature_data_6,
 //                            name: 'gbspTestCase',
 //                            zoom: true
 //                        };
 //            console.log(channelMsg);
 //            OWF.Eventing.publish('map.feature.plot', channelMsg);
 //        }, 30000);



/************** data *******************/
	// Plot Feature - pass an object
	var $plotFeatureOverlayId			= $('#plot-feature-overlayId');
	var $plotFeatureFeatureId			= $('#plot-feature-featureId');
	var $plotFeatureName					= $('#plot-feature-name');
	var $plotFeature 							= $('#plot-feature');
	$plotFeatureOverlayId.val("myOverlay");
	$plotFeatureFeatureId.val("myFeature");
	$plotFeatureName.val("myFeatureName");
	// $plotFeature.val("feature_data_1");
	var plotZoom = true;
	// change zoom value for Plot Feature - true zoom map to feature
	$('#plot_feature_true').on('change', function () {
		plotZoom = true;
		console.log("plotZoom set to: " + plotZoom);
	});
	// change zoom value for Plot Feature - false does not zoom map to feature
	$('#plot_feature_false').on('change', function () {
		plotZoom = false;
		console.log("plotZoom set to: " + plotZoom);
	});
	$button_field.on('click', '#plot_feature', function(){
		console.log("plot feature, zoom: " + plotZoom) ;
		console.log($plotFeature.val());
		console.log(features[$plotFeature.val()]);
		cmapi_channel = "map.feature.plot";
		cmapi_message = {  
			"overlayId": $plotFeatureOverlayId.val(),
			"featureId": $plotFeatureFeatureId.val(),
			"name": $plotFeatureName.val(),
			"format":  formats[$plotFeature.val()],
			"feature": features[$plotFeature.val()],
			"zoom": plotZoom
		};
		publishChannel(cmapi_channel, cmapi_message);
	});

	// Plot URL Feature - send a URL

	// http://192.168.1.184:8080/kml/Point1.kml
 //  http://192.168.1.184:8080/kml/Point2.kml
	var $plotUrlOverlayId			= $('#plot-url-overlayId');
	var $plotUrlFeatureId			= $('#plot-url-featureId');
	var $plotUrlName					= $('#plot-url-name');
	var $plotUrlUrl 					= $('#plot-url-url');
	$plotUrlOverlayId.val("myOverlay");
	$plotUrlFeatureId.val("myURLFeature");
	$plotUrlName.val("myPlotUrl");
	$plotUrlUrl.val("http://plu.sx/kml/1.kml");
	var urlZoom = true;
	// change zoom value for Plot Feature - true zoom map to feature
	$('#plot_url_true').on('change', function () {
		urlZoom = true;
		console.log("urlZoom set to: " + urlZoom);
	});
	// change zoom value for Plot Feature - false does not zoom map to feature
	$('#plot_url_false').on('change', function () {
		urlZoom = false;
		console.log("urlZoom set to: " + urlZoom);
	});
	$button_field.on('click', '#plot_url', function(){
		console.log("plot url");
		cmapi_channel = "map.feature.plot.url";
		cmapi_message = {  
			"overlayId": $plotUrlOverlayId.val(),
			"featureId": $plotUrlFeatureId.val(),
			"name": $plotUrlName.val(),
			"url": $plotUrlUrl.val(),
			"zoom": urlZoom
		};
		publishChannel(cmapi_channel, cmapi_message);
	});

	// Unplot Feature - removes feature
	var $unplotOverlayId			= $('#unplot-feature-overlayId');
	var $unplotFeatureId			= $('#unplot-feature-featureId');
	$unplotOverlayId.val("myOverlay");
	$unplotFeatureId.val("myFeature");
	$button_field.on('click', '#feature-unplot', function(){
		console.log("unplot feature");
		cmapi_channel = "map.feature.unplot";
		cmapi_message = {  
			"overlayId": $unplotOverlayId.val(),
			"featureId": $unplotFeatureId.val()
		};
		publishChannel(cmapi_channel, cmapi_message);
	});

	// Hide Feature 
	var $hideOverlayId				= $('#hide-feature-overlayId');
	var $hideFeatureId				= $('#hide-feature-featureId');
	$hideOverlayId.val("myOverlay");	
	$hideFeatureId.val("myFeature");
	$button_field.on('click', '#feature_hide', function(){
		console.log("hide feature");
		cmapi_channel = "map.feature.hide";
		cmapi_message = {  
			"overlayId": $hideOverlayId.val(),
			"featureId": $hideFeatureId.val()
		};
		publishChannel(cmapi_channel, cmapi_message);
	});

	// Show Feature 
	var $showOverlayId				= $('#show-feature-overlayId');
	var $showFeatureId				= $('#show-feature-featureId');
	$showOverlayId.val("myOverlay");
	$showFeatureId.val("myFeature");
	var showZoom = true;
	// change zoom value for Plot Feature - true zoom map to feature
	$('#plot_show_true').on('change', function () {
		showZoom = true;
		console.log("showZoom set to: " + showZoom);
	});
	// change zoom value for Plot Feature - false does not zoom map to feature
	$('#plot_show_false').on('change', function () {
		showZoom = false;
		console.log("showZoom set to: " + showZoom);
	});
	$button_field.on('click', '#feature_show', function(){
		console.log("show feature");
		cmapi_channel = "map.feature.show";
		cmapi_message = {  
			"overlayId": $showOverlayId.val(),
			"featureId": $showFeatureId.val(),
			"zoom": showZoom
		};
		publishChannel(cmapi_channel, cmapi_message);
	});	

	// Feature Selected
	var $feature_selectedId				= $('#feature-selectedId');
	var $feature_selectedName			= $('#feature-selectedName');
	var $selected_featureId				= $('#feature-selected-featureId');
	var $selected_overlayId				= $('#feature-selected-overlayId');
	$feature_selectedId.val("feature_selectedId");
	$feature_selectedName.val("feature_selectedName");
	$selected_featureId.val("myFeature");
	$selected_overlayId.val("myOverlay");
	$button_field.on('click', '#feature_selected', function(){
		console.log("feature selected");
		cmapi_channel = "map.feature.selected";
		cmapi_message = {  
			"selectedId": 	$feature_selectedId.val(),
			"selectedName": $feature_selectedName.val(),
			"featureId": 		$selected_featureId.val(),
			"overlayId": 		$selected_overlayId.val()
		};
		publishChannel(cmapi_channel, cmapi_message);
	});	

	// Feature De-Selected
	var $feature_deSelectedId				= $('#feature-deSelectedId');
	var $feature_deSelectedName			= $('#feature-deSelectedName');
	var $deSelected_featureId				= $('#feature-deSelected-featureId');
	var $deSelected_overlayId				= $('#feature-deSelected-overlayId');
	$feature_deSelectedId.val("feature_selectedId");
	$feature_deSelectedName.val("feature_selectedName");
	$deSelected_featureId.val("myFeature");
	$deSelected_overlayId.val("myOverlay");
	$button_field.on('click', '#feature_deselected', function(){
		console.log("feature deSelected");
		cmapi_channel = "map.feature.deselected";
		cmapi_message = {  
			"deSelectedId": 	$feature_deSelectedId.val(),
			"deSelectedName": $feature_deSelectedName.val(),
			"featureId": 		$deSelected_featureId.val(),
			"overlayId": 		$deSelected_overlayId.val()
		};
		publishChannel(cmapi_channel, cmapi_message);
	});	

	// Update Feature Data
	var $feature_updated_overlayId				= $('#feature-updated-overlayId');
	var $feature_updated_featureId				= $('#feature-updated-featureId');
	var $feature_updated_name							= $('#feature-updated-name');
	var $feature_updated_newOverlayId			= $('#feature-updated-newOverlayId');
	$feature_updated_overlayId.val("myOverlay");
	$feature_updated_featureId.val("myFeature");
	$feature_updated_name.val("newFeatureName");
	$feature_updated_newOverlayId.val("newOverlayId");
	
	$button_field.on('click', '#feature_updated', function(){
		console.log("feature updated");
		cmapi_channel = "map.feature.update";
		cmapi_message = {  
			"overlayId": 		$feature_updated_overlayId.val(),
			"featureId": 		$feature_updated_featureId.val(),
			"name": 				$feature_updated_name.val(),
			"newOverlayId": $feature_updated_newOverlayId.val()
		};
		publishChannel(cmapi_channel, cmapi_message);
	});	

	// Edit Feature Data
	var $feature_edit_overlayId				= $('#feature-edit-overlayId');
	var $feature_edit_featureId				= $('#feature-edit-featureId');
	var $feature_edit_messageId				= $('#feature-edit-messageId');
	$feature_edit_overlayId.val("myOverlay");
	$feature_edit_featureId.val("myFeature");
	$feature_edit_messageId.val("feature_edit_messageId");
	
	$button_field.on('click', '#feature_edit', function(){
		console.log("feature edit");
		// cmapi_channel = "map.feature.edit";
		// cmapi_message = {  
		// 	"overlayId": 		$feature_edit_overlayId.val(),
		// 	"featureId": 		$feature_edit_featureId.val(),
		// 	"messageId": 				$feature_edit_messageId.val()
		// };
		// publishChannel(cmapi_channel, cmapi_message);
	});	

/************************ End Feature Channels ************************/


/************************ Start Map View Channels ************************/
	// initialize map input fields, default location is Oklahoma to view filter toggling
	
	// Set Map Zoom
	var $range			  		    = $('#map-range');
	$range.val(5000);
	$button_field.on('click', '#map_set_zoom', function(){
		console.log("map set zoom");
		cmapi_channel = "map.view.zoom";
		cmapi_message = { "range": $range.val() };
		publishChannel(cmapi_channel, cmapi_message);
	});

	// Set Center on Overlay
	var $center_overlay_overlayId				= $('#center-overlay-overlayId');
	var $center_overlay_zoom						= $('#center-overlay-zoom');
	$center_overlay_overlayId.val("myOverlay");
	$center_overlay_zoom.val("auto");
	$button_field.on('click', '#map_center_overlay', function(){
		console.log("map view center overlay");
		cmapi_channel = "map.view.center.overlay";
		cmapi_message = {
			"overlayId": 		$center_overlay_overlayId.val(),
			"zoom": 		$center_overlay_zoom.val()
		};
		publishChannel(cmapi_channel, cmapi_message);
	});

	// Set Center on Feature
	var $center_feature_overlayId			= $('#center-feature-overlayId');
	var $center_feature_featureId			= $('#center-feature-featureId');
	var $center_feature_zoom					= $('#center-feature-zoom');
	$center_feature_overlayId.val("myOverlay");
	$center_feature_featureId.val("myFeature");
	$center_feature_zoom.val("auto");
	$button_field.on('click', '#map_center_feature', function(){
		console.log("map view center feature");
		cmapi_channel = "map.view.center.feature";
		cmapi_message = {
			"overlayId": 		$center_feature_overlayId.val(),
			"featureId": 		$center_feature_featureId.val(),
			"zoom": $center_feature_zoom.val()
		};
		publishChannel(cmapi_channel, cmapi_message);
	});

	// Set Center on Location
	var $latitude							= $('#map-latitude');
	var $longitude						= $('#map-longitude');
	var $zoom 					      = $('#map-zoom');
	$latitude.val(38.186);
	$longitude.val( -98.042);
	$zoom.val(2500);
	$button_field.on('click', '#map_center_location', function(){
		console.log("map center on location");
		cmapi_channel = "map.view.center.location";
		cmapi_message = {  
			"location": { "lat": parseFloat( $latitude.val() ), "lon": parseFloat( $longitude.val() )},
			"zoom": parseInt( $zoom.val() )
		};
		publishChannel(cmapi_channel, cmapi_message);
	});

	//Set Center on Bounds
	var $bounds_sw_lat				= $('#bounds-sw-lat');
	var $bounds_sw_lon				= $('#bounds-sw-lon');
	var $bounds_ne_lat				= $('#bounds-ne-lat');
	var $bounds_ne_lon				= $('#bounds-ne-lon');
	var $bounds_zoom 			    = $('#bounds-zoom');
	$bounds_sw_lat.val(  45.21977527);
	$bounds_sw_lon.val(-130.38024902);
	$bounds_ne_lat.val(  50.67296494);
	$bounds_ne_lon.val(-116.43859863);
	$bounds_zoom.val("auto");

	$button_field.on('click', '#map_center_bounds', function(){
		console.log("map center on bounds");
		cmapi_channel = "map.view.center.bounds";
		cmapi_message = { "bounds": {
					"southWest": {"lat": parseFloat( $bounds_sw_lat.val() ), "lon": parseFloat( $bounds_sw_lon.val() )},
					"northEast": {"lat": parseFloat( $bounds_ne_lat.val() ), "lon": parseFloat( $bounds_ne_lon.val() )}
			},
			"zoom": $bounds_zoom.val()
		};
		publishChannel(cmapi_channel, cmapi_message);
	});

	// Map View Clicked
	var $map_clicked_lat					= $('#map-clicked-latitude');
	var $map_clicked_lon					= $('#map-clicked-longitude');
	var $map_clicked_button				= $('#map-clicked-button');
	var $map_clicked_type					= $('#map-clicked-type');
	var $map_clicked_keys					= $('#map-clicked-keys');
	$map_clicked_lat.val(44.950);
	$map_clicked_lon.val(-93.955);
	$map_clicked_button.val("left");
	$map_clicked_type.val("single");
	$map_clicked_keys.val("none");
	$button_field.on('click', '#map_view_clicked', function(){
		console.log("map view clicked");
		cmapi_channel = "map.view.clicked";
		cmapi_message = {
			"lat": 		parseFloat( $map_clicked_lat.val() ),
			"lon": 		parseFloat( $map_clicked_lon.val() ),
			"button": $map_clicked_button.val(),
			"type": 	$map_clicked_type.val(),
			"keys": 	$map_clicked_keys.val()
		};
		publishChannel(cmapi_channel, cmapi_message);
	});

	
/************************ End Map View Channels ************************/


/************************ Start Map Status Channels - Request Status  ************************/
	// map.status.request
	// payload: { types: array, enum (optional)}
	var statusTypes = ['view', 'format', 'about', 'selected'];
	// Request Map Status
	$button_field.on('click', '#map_status_request_all', function(){
		console.log("map status request all");
		cmapi_channel = "map.status.request";
		cmapi_message = { "types": statusTypes };
		publishChannel(cmapi_channel, cmapi_message);
	});

	$button_field.on('click', '#map_status_request_view', function(){
		console.log("map status request view");
		cmapi_channel = "map.status.request";
		cmapi_message = { "types": ["view"] };
		publishChannel(cmapi_channel, cmapi_message);
	});

	$button_field.on('click', '#map_status_request_format', function(){
		console.log("map status request format");
		cmapi_channel = "map.status.request";
		cmapi_message = { "types": ["format"] };
		publishChannel(cmapi_channel, cmapi_message);
	});

	$button_field.on('click', '#map_status_request_about', function(){
		console.log("map status request about");
		cmapi_channel = "map.status.request";
		cmapi_message = { "types": ["about"] };
		publishChannel(cmapi_channel, cmapi_message);
	});

	$button_field.on('click', '#map_status_request_selected', function(){
		console.log("map status request selected");
		cmapi_channel = "map.status.request";
		cmapi_message = { "types": ["selected"] };
		publishChannel(cmapi_channel, cmapi_message);
	});

	$button_field.on('click', '#clear_map_status', function(){
		console.log("clear map status");
		$('#map-status-display').empty();
	});



/************************ End Map Status Channels - Request Status ************************/

/************************ Start DisasterAware Launch Code ************************/
	// launch variables
	var widgetToLaunch;
	var data = {};
	var cmapi_channel;
	var cmapi_message;
	var bookmarkLaunchType = "";
	// default launch bookmark 
	var bookmarkIdPayload = { "bookmarkId": 9853 };
	var bookmarkUrlPayload = { "bookmarkUrl": "http://local.msmv.pdc.org:8080/msmvng/msmvng/?bookmark=9853" };
	var $widget_name					= $('#widget-name');
	var $bookmarkId 		      = $('#bookmarkId');
	var $bookmarkUrl 		      = $('#bookmarkUrl');
	/**   Launch Code  **/
	// load bookmark launch input fields with default values
	$bookmarkId.val(bookmarkIdPayload.bookmarkId);
	$bookmarkUrl.val(bookmarkUrlPayload.bookmarkUrl);
	$widget_name.val("MSMV");

	// radio button to select launch type: bookmarkId or bookmarkUrl
	$("input[type='radio'][name='launch-type']").on('checked', function() {
		console.log("radio button change was detected");
	});

	// initial data value for launch channel and payload - default setting
	data = {
		  channel: "org.pdc.bookmark.load",
		  payload: bookmarkIdPayload
		};

	// change launch payload to use bookmarkId with radio button
	$('#launchWithId').on('change', function () {
		$('#launch-widget').text("Launch " + $widget_name.val() + " by ID" );
		data.payload = {};
		data.payload[$(this).val()] = $('#bookmarkId').val();
	});

	// change launch payload to use bookmarkUrl with radio button
	$('#launchWithUrl').on('change', function () {
		$('#launch-widget').text("Launch " + $widget_name.val() + " by URL");
		data.payload = {};
		data.payload[$(this).val()] = $('#bookmarkUrl').val();
	});

	// change launch payload if input field changes after radio button selected
	$('#bookmarkId').on('change', function () {
		data.payload ={};
		data.payload['bookmarkId'] = $(this).val();
	});

	// change launch payload if input field changes after radio button selected
	$('#bookmarkUrl').on('change', function () {
		data.payload ={};
		data.payload['bookmarkUrl'] = $(this).val();
	});

	$widget_name.on('keyup', function () {
		var isID = new RegExp("ID");
		if (isID.test($('#launch-widget').text()) ){
			$('#launch-widget').text("Launch " + $widget_name.val() + " by ID" );
		} else {
			$('#launch-widget').text("Launch " + $widget_name.val() + " by URL");
		}
	});

	// Lookup GUID for the widget whose name is set in the widget name text input field
	// launch the widget if successful
	$button_field.on('click', '#launch-widget', function(){
		widgetToLaunch = $widget_name.val(); // set to "MSMV" by default
		console.log("widgetToLaunch: ", widgetToLaunch);
		$widgetPayload.empty().append("Payload: " + JSON.stringify(data.payload));
		lookupSecondTracker();
	});

/************************ End DisasterAware Launch Code ************************/


/************************ Start Launch Related Functions ************************/

// Search for the GUID corresponding to the 'widgetToLaunch' name
// if successful call the launchSecondTracker function
var lookupSecondTracker = function() {
	var searchConfig = {
	  searchParams:  { widgetName: widgetToLaunch }, 
	  onSuccess: launchSecondTracker, 
	  onFailure: failWidgetLookupError
	};
	logger.debug('Looking up:'+searchConfig.searchParams.widgetName);

	OWF.Preferences.findWidgets(searchConfig);
};
         
// Launch the widget based on the found GUID
// on success callback from lookupSecondTracker function
var launchSecondTracker = function  (findResultsResponseJSON) {

   logger.debug('Search result:'+ findResultsResponseJSON);
   if(findResultsResponseJSON.length == 0) {
      // Did not find Widget
      failWidgetLookupError("Widget was not found in user profile.  User may not have access.");
   }
   else { // look for exact match on widget name
			for (i = 0; i < findResultsResponseJSON.length; i++) {
				if (findResultsResponseJSON[i].value.namespace === widgetToLaunch) {
					var guidOfWidgetToLaunch = findResultsResponseJSON[i].path;
					break;
				}
			}
      logger.debug('Search result [GUID]:'+ guidOfWidgetToLaunch);
              
      var dataString = OWF.Util.toString(data);
      
      OWF.Launcher.launch(
         {
            guid: guidOfWidgetToLaunch,  // The retrieved GUID of the widget to launch
            launchOnlyIfClosed: true, // If true will only launch the widget if it is not already opened.
            data: dataString  // Initial launch config data to be passed to 
                              //   a widget only if the widget is opened.  This must be a string!
         }, 
         callbackOnLaunch
      );
   }
}

// Display an error when a widget cannot be located
var failWidgetLookupError= function (widgetLookupErrorMessage) {
	errorMessage = "Launch Failure: [" + widgetToLaunch +"]: " + widgetLookupErrorMessage;
	$error_panel.empty().append(errorMessage);
}

// Widget Launching callback function indicating success or failure
function callbackOnLaunch (resultJson) {
   
   if(resultJson.error) {
      // if there was an error, print that out on the launching widget
      launchResultsMessage += ("Launch Error:" + resultJson.message);
   }
      
   if(resultJson.newWidgetLaunched) {
      // if the new widget was launched, say so
      widgetNameLaunched =  "Widget Launched: " + widgetToLaunch;
      widgetChannel = "Channel: " + data.channel;
      launchResultsMessage = "Unique id of Widget Launched: " + resultJson.uniqueId;
   }
   else {
      // if the new widget was not launched, say so and explain why not
      launchResultsMessage = ("Launch Error: " + resultJson.message  + 
                            " Widget exists already with id: " + resultJson.uniqueId);               
   }
   $widgetName.empty().append(widgetNameLaunched);
   $widgetPayload.empty().append("Payload: " + JSON.stringify(data.payload));
   $widgetChannel.empty().append(widgetChannel);
	 $launchResults.empty().append(launchResultsMessage);
	
}

/************************ End Launch Related Functions ************************/

/************************ Start Initialize Functions  ************************/

	var prepareMessage = function (message) {
	  if (typeof message === 'string') {
	      message = JSON.parse(message);
	  }
	  console.log("inside widget: JSON.parse(message): ");
	  console.log(message);
	  return message;
	};

	function startListeners() {

		/************************ Start Map Error ************************/
		var mapError 		= "";
		var $mapErrorDisplay = $('#map-error');

		OWF.Eventing.subscribe("map.error", function (sender, message) {
			console.log("inside widget map.error subscribe - message %O", message);
			message = prepareMessage(message);
			$('#error-sender').html("sender: "+ message.sender);
			$('#error-type').html("type: "+ message.type);
			$('#error-message').html("message: "+ message.msg);
			$('#error-error').html("error: "+ message.error);
		});

		$('#map-error').on('click', '#clear-map-errors', function (){
			$('#error-sender').html("sender: ");
			$('#error-type').html("type: ");
			$('#error-message').html("message: ");
			$('#error-error').html("error: ");
		});
		/************************ End Map Error ************************/

		/************************ Start Map View Clicked ************************/

		OWF.Eventing.subscribe("map.view.clicked", function (sender, message) {
			console.log("inside widget map.view.clicked subscribe - message %O", message);
			message = prepareMessage(message);
			$('#clicked-lat').html("lat: " + message.lat);
			$('#clicked-lon').html("lon: " + message.lon);
			$('#clicked-button').html("button: " + message.button);
			$('#clicked-type').html("type: " + message.type);
			$('#clicked-keys').html("keys: " + message.keys);
			$('#clicked-sender').html("sender: " + message.sender);
		});

	   /************************ End Map View Clicked ************************/

	    /************************ Start Map Status Listener Channels ************************/
	var mapStatus 		= "";
	var $mapStatusDisplay = $('#map-status-display');

	OWF.Eventing.subscribe("map.status.view", function (sender, message) {
		console.log("inside widget map.status.view subscribe - message %O", message);
		message = prepareMessage(message);
		mapStatus  = "<div><h3>Map View Status</h3><ul>";
		mapStatus += "<li>bounds.southWest.lat: " + message.bounds.southWest.lat + "</li>";
		mapStatus += "<li>bounds.southWest.lon: " + message.bounds.southWest.lon + "</li>";
		mapStatus += "<li>bounds.northEast.lat: " + message.bounds.northEast.lat + "</li>";
		mapStatus += "<li>bounds.northEast.lon: " + message.bounds.northEast.lon + "</li>";
		mapStatus += "<li>center.lat: " + message.center.lat + "</li>";
		mapStatus += "<li>center.lon: " + message.center.lon + "</li>";
		mapStatus += "<li>range: " + message.range + "</li>";
		mapStatus += "<li>sender: " + sender + "</li>";
		mapStatus += "</ul></div>"
		$mapStatusDisplay.append(mapStatus);
		$mapStatusDisplay.css('text-align','left');
		$mapStatusDisplay.css('padding-left','10%');
		$('#map-status-display h3').css('padding-left','10%');
	});

	OWF.Eventing.subscribe("map.status.format", function (sender, message) {
			message = prepareMessage(message);
			mapStatus  = "<div><h3>Map Format Status</h3><ul>";
			for (var i = 0; i < message.formats.length; i++) {
				console.log("map.status.format - valid format: ", message.formats[i]);
				mapStatus += "<li>format: " + message.formats[i] + "</li>";
			}
			mapStatus += "<li>sender: " + sender + "</li>";
			mapStatus += "</ul></div>"
			$mapStatusDisplay.append(mapStatus);
			$mapStatusDisplay.css('text-align','left');
			$mapStatusDisplay.css('padding-left','10%');
			$('#map-status-display h3').css('padding-left','10%');
	});

	OWF.Eventing.subscribe("map.status.about", function (sender, message) {
		console.log("inside widget map.status.about subscribe - message %O", message);
		message = prepareMessage(message);
		mapStatus  = "<div><h3>Map About Status</h3><ul>";
		mapStatus += "<li>version: " + message.version + "</li>";
		mapStatus += "<li>type: " + message.type + "</li>";
		mapStatus += "<li>widgetName.: " + message.widgetName + "</li>";
		mapStatus += "<li>sender: " + sender + "</li>";
		mapStatus += "</ul></div>"
		$mapStatusDisplay.append(mapStatus);
		$mapStatusDisplay.css('text-align','left');
		$mapStatusDisplay.css('padding-left','10%');
		$('#map-status-display h3').css('padding-left','10%');
	});

	OWF.Eventing.subscribe("map.status.selected", function (sender, message) {
			message = prepareMessage(message);
			console.log("inside widget map.status.selected message %O", message);
			var featuresSelected = "";
			for (i = 0; i < message.selectedFeatures.length; i++) {
				if (i < message.selectedFeatures.length -1 ){
					featuresSelected += message.selectedFeatures[i].featureId + ", ";
				} else {
					featuresSelected += message.selectedFeatures[i].featureId;
				}
			}
			mapStatus  = "<div><h3>Map Selected Feature Status</h3><ul>";
			mapStatus += "<li>overlayId: " + message.overlayId + "</li>";
			mapStatus += "<li>selectedFeatures: " + featuresSelected + "</li>";
			mapStatus += "<li>sender: " + sender + "</li>";
			mapStatus += "</ul></div>"
			$mapStatusDisplay.append(mapStatus);
			$mapStatusDisplay.css('text-align','left');
			$mapStatusDisplay.css('padding-left','10%');
			$('#map-status-display h3').css('padding-left','10%');
		});

/************************ End Map Status Listener Channels ************************/

/************************ Start Event Listener Channels ************************/

		$('#listeners').on('click', '#clear-listeners', function () {
			$('#listen-overlay-show-layerId').empty().html("layerId: " );
				$('#listen-overlay-show-layerDescription').empty().html("layerDescription: ");
				$('#listen-overlay-show-layerState').empty().html("layerState: ");
				$('#listen-overlay-show-sender').empty().html("sender: ");
				$('#listen-overlay-hide-layerId').empty().html("layerId: " );
				$('#listen-overlay-hide-layerDescription').empty().html("layerDescription: " );
				$('#listen-overlay-hide-layerState').empty().html("layerState: " );
				$('#listen-overlay-hide-sender').empty().html("sender: " );
				$('#listen-center-on-hazard-hazardId').empty().html("hazardId: " );
				$('#listen-center-on-hazard-zoom').empty().html("zoom: " );
				$('#listen-center-on-hazard-lon').empty().html("location.lon: " );
				$('#listen-center-on-hazard-lat').empty().html("location.lat: " );
				$('#listen-center-on-hazard-sender').empty().html("sender: " );
				$('#listen-center-on-location-lat').empty().html("location.lat: " );
				$('#listen-center-on-location-lon').empty().html("location.lon: " );
				$('#listen-center-on-location-zoom').empty().html("zoom: " );
				$('#listen-center-on-location-sender').empty().html("sender: " );
				$('#listen-center-on-bounds-southWest-lat').empty().html("southWest.lat: " );
				$('#listen-center-on-bounds-southWest-lon').empty().html("southWest.lon: " );
				$('#listen-center-on-bounds-northEast-lat').empty().html("northEast.lat: " );
				$('#listen-center-on-bounds-northEast-lon').empty().html("northEast.lon: " );
				$('#listen-center-on-bounds-zoom').empty().html("zoom: " );
				$('#listen-center-on-bounds-sender').empty().html("sender: ");
		});

		/************************ Start Map Overlay Show ************************/
			OWF.Eventing.subscribe("jpeo.map.overlay.show", function (sender, message) {
				console.log("inside widget jpeo.map.overlay.show subscribe - message %O", message);
				message = prepareMessage(message);
				$('#listen-overlay-show-layerId').empty().html("layerId: " + message.layerId);
				$('#listen-overlay-show-layerDescription').empty().html("layerDescription: " + message.layerDescription);
				$('#listen-overlay-show-layerState').empty().html("layerState: " + message.layerState);
				$('#listen-overlay-show-sender').empty().html("sender: " + sender);
			});
	   /************************ End Map Overlay Show ************************/

		/************************ Start Map Overlay Hide ************************/
			OWF.Eventing.subscribe("jpeo.map.overlay.hide", function (sender, message) {
				console.log("inside widget jpeo.map.overlay.hide subscribe - message %O", message);
				message = prepareMessage(message);
        $('#listen-overlay-hide-layerId').empty().html("layerId: " + message.layerId);
				$('#listen-overlay-hide-layerDescription').empty().html("layerDescription: " + message.layerDescription);
				$('#listen-overlay-hide-layerState').empty().html("layerState: " + message.layerState);
				$('#listen-overlay-hide-sender').empty().html("sender: " + sender);
			});
	   /************************ End Map Overlay Hide ************************/

 		/************************ Start Map Center on Hazard ************************/
			OWF.Eventing.subscribe("jpeo.map.view.center.hazard", function (sender, message) {
				console.log("inside widget jpeo.map.view.center.hazard subscribe - message %O", message);
				message = prepareMessage(message);
				$('#listen-center-on-hazard-hazardId').empty().html("hazardId: " + message.hazardId);
				$('#listen-center-on-hazard-lat').empty().html("location.lat: " + message.location.lat);
				$('#listen-center-on-hazard-lon').empty().html("location.lon: " + message.location.lon);
				$('#listen-center-on-hazard-zoom').empty().html("zoom: " + message.zoom);
				$('#listen-center-on-hazard-sender').empty().html("sender: " + sender);
			});
	   /************************ End Map Center on Hazard ************************/

	   // /************************ Start Map Center on Location ************************/
			OWF.Eventing.subscribe("map.view.center.location", function (sender, message) {
				console.log("inside widget map.view.center.location subscribe - message %O", message);
				message = prepareMessage(message);
				$('#listen-center-on-location-lat').empty().html("location.lat: " + message.location.lat);
				$('#listen-center-on-location-lon').empty().html("location.lon: " + message.location.lon);
				$('#listen-center-on-location-zoom').empty().html("zoom: " + message.zoom);
				$('#listen-center-on-location-sender').empty().html("sender: " + sender);
			});
	   /************************ End Map Center on Bounds ************************/

 		// /************************ Start Map Center on Bounds ************************/
			OWF.Eventing.subscribe("map.view.center.bounds", function (sender, message) {
				console.log("inside widget map.view.center.bounds subscribe - message %O", message);
				message = prepareMessage(message);
				$('#listen-center-on-bounds-southWest-lat').empty().html("southWest.lat: " + message.southWest.lat);
				$('#listen-center-on-bounds-southWest-lon').empty().html("southWest.lon: " + message.southWest.lon);
				$('#listen-center-on-bounds-northEast-lat').empty().html("northEast.lat: " + message.northEast.lat);
				$('#listen-center-on-bounds-northEast-lon').empty().html("northEast.lon: " + message.northEast.lon);
				$('#listen-center-on-bounds-zoom').empty().html("zoom: " + message.zoom);
				$('#listen-center-on-bounds-sender').empty().html("sender: " + sender);
			});
	   /************************ End Map Center on Bounds ************************/

/************************ End Event Listener Channels ************************/

} // end startListeners


function setupNav() {
	$('#disaster').hide();
	$('#overlay').hide();
	$('#feature').hide();
	$('#view').hide();
	$('#status').hide();
	$('#listeners').hide();
}


function logInit() {

   //logger = OWF.Log.getLogger('DynamicLauncher');
   logger = OWF.Log.getDefaultLogger();
   OWF.Log.setEnabled(true);

   appender = logger.getEffectiveAppenders()[0];
   appender.setThreshold(log4javascript.Level.DEBUG);
}

function onSetFailure(error,status){
   OWF.Util.ErrorDlg.show("Got an error updating preferences! Status Code: " + status + " . Error message: " + error);
};

function initPrefs() {
    OWF.Preferences.getUserPreference(
            {namespace:'com.mycompany.AnnouncingClock', 
             onSuccess:function(){
              console.log('great success');
             }, 
             onFailure:onGetFailure});
}

function onGetFailure(error,status) {
    if (status != 404) {
        OWF.Util.ErrorDlg.show("Got an error getting preferences! Status Code: " + status + " . Error message: " + error);
    }
}

function initPage() { 
 	logInit();
 	initPrefs();
 	startListeners();
 	setupNav();
  $isRunning.empty().append('Running in OWF: ' + (OWF.Util.isRunningInOWF()?"Yes":"No"));
}

owfdojo.addOnLoad(function() {
  OWF.ready(initPage);
});

/************************ End Initialize Functions  ************************/




