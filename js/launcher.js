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


/************************ Start DisasterAware Launch Code ************************/
	// launch variables
	var widgetToLaunch;
	var data = {};
	var cmapi_channel;
	var cmapi_message;
	var bookmarkLaunchType = "";
	// widget names used for the GUID lookup
	var widgetOne = "MSMV";
	var widgetTwo = "MSMV Trunk";
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

	// Lookup GUID for the widget whose name is set in the 'widgetOne' variable
	// launch the widget if successful
	$button_field.on('click', '#launch-widget', function(){
		widgetToLaunch = $widget_name.val(); // set to "MSMV" by default
		$widgetPayload.empty().append("Payload: " + JSON.stringify(data.payload));
		lookupSecondTracker();
	});

	/**   End Launch Code  **/
/************************ End DisasterAware Launch Code ************************/


/************************ Start Publish Channel Function ************************/
	var publishChannel = function (channel, message) {
		$widgetChannel.empty().append("Channel: " + channel);
		$widgetPayload.empty().append("Payload: " + JSON.stringify(message));
		$launchResults.empty(); // clear display
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
	    console.log(locale_button_text+ ": "+ locale_selected);
	    $('#change_locale').text("Translate To "+ locale_button_text);
	    var str = $('#change_locale').text();
	    console.log(str);
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
	/* 
		not functional yet
		TODO:
			set up an animation sequence
			add animation to configService
			create time object within the animation window
			set message with the time object
	 */
	$button_field.on('click', '#animation_time', function(){ 
		console.log("animation time");
		cmapi_channel = "map.view.animation.time";
		cmapi_message = { "time": "time object" };
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
	var overlayUrl = "http://plu.sx/kml/1.kml";
	// var overlayUrl = "plu.sx/kml/1.kml";
	$overlayName.val("myOverlayName");
	$overlayId.val("myOverlay");
	$parentId.val("myParentID");
	$overlayUrl.val(overlayUrl);
	$button_field.on('click', '#create_overlay', function(){ 
		console.log("create overlay");
		overlayUrl = $overlayUrl.val();
		cmapi_channel = "map.overlay.create";
		cmapi_message = { 
						"name":  			$overlayName.val(),
						"overlayId": 	$overlayId.val(),
						"parentId":   $parentId.val(),
						"url": 				$overlayUrl.val()
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
	// Plot Feature - pass an object
	var $plotFeatureOverlayId			= $('#plot-feature-overlayId');
	var $plotFeatureFeatureId			= $('#plot-feature-featureId');
	var $plotFeatureName					= $('#plot-feature-name');
	var $plotFeature 							= $('#plot-feature');
	var $plotFeatureZoom					= $('#plot-feature-zoom');
	$plotFeatureOverlayId.val("plotFeatureOverlayId");
	$plotFeatureFeatureId.val("plotFeatureFeatureId");
	$plotFeatureName.val("plotFeatureName");
	$plotFeature.val("plotFeature");
	$plotFeatureZoom.val("plotFeatureZoom");
	$button_field.on('click', '#plot_feature', function(){
		console.log("plot feature");
		cmapi_channel = "map.feature.plot";
		cmapi_message = {  
			"overlayId": $plotFeatureOverlayId.val(),
			"featureId": $plotFeatureFeatureId.val(),
			"name": $plotFeatureName.val(),
			"feature": $plotFeature.val(),
			"zoom": true
		};
		publishChannel(cmapi_channel, cmapi_message);
	});

	// Plot URL Feature - send a URL
	// feature input field variables
	var $plotUrlOverlayId			= $('#plot-url-overlayId');
	var $plotUrlFeatureId			= $('#plot-url-featureId');
	var $plotUrlName					= $('#plot-url-name');
	var $plotUrlUrl 					= $('#plot-url-url');
	var $plotUrlZoom					= $('#plot-url-zoom');
	// var overlayUrl = "http://plu.sx/kml/1.kml";
	// initialize input fields
	$plotUrlOverlayId.val("plotOverlayId");
	$plotUrlFeatureId.val("plotFeatureId");
	$plotUrlName.val("myPlotUrl");
	$plotUrlUrl.val(overlayUrl);
	$plotUrlZoom.val("true");
	$button_field.on('click', '#plot_url', function(){
		console.log("plot url");
		cmapi_channel = "map.feature.plot.url";
		cmapi_message = {  
			"overlayId": $plotUrlOverlayId.val(),
			"featureId": $plotUrlFeatureId.val(),
			"name": $plotUrlName.val(),
			"url": $plotUrlUrl.val(),
			"zoom": true
		};
		publishChannel(cmapi_channel, cmapi_message);
	});

	// Unplot Feature - removes feature
	var $unplotOverlayId			= $('#unplot-feature-overlayId');
	var $unplotFeatureId			= $('#unplot-feature-featureId');
	$unplotOverlayId.val("plotOverlayId");
	$unplotFeatureId.val("plotFeatureId");
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
	$hideOverlayId.val("plotOverlayId");	
	$hideFeatureId.val("plotFeatureId");
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
	var $showZoom							= $('#show-feature-zoom');
	$showOverlayId.val("plotOverlayId");
	$showFeatureId.val("plotFeatureId");
	$showZoom.val("showZoom");
	$button_field.on('click', '#feature_show', function(){
		console.log("show feature");
		cmapi_channel = "map.feature.show";
		cmapi_message = {  
			"overlayId": $showOverlayId.val(),
			"featureId": $showFeatureId.val(),
			"zoom": true
		};
		publishChannel(cmapi_channel, cmapi_message);
	});	

/************************ End Feature Channels ************************/


/************************ Start Map View Channels ************************/
	// map input field variables
	var $latitude							= $('#map-latitude');
	var $longitude						= $('#map-longitude');
	var $zoom 					      = $('#map-zoom');
	var $range			  		    = $('#map-range');
	// initialize map input fields, default location is Oklahoma to view filter toggling
	$latitude.val(38.186);
	$longitude.val( -98.042);
	$zoom.val(2500);
	$range.val(5000);
	// Set Map Center
	$button_field.on('click', '#map_set_center', function(){
		console.log("map set center clicked");
		cmapi_channel = "map.view.center.location";
		cmapi_message = {  
			"location": { "lat": $latitude.val(), "lon": $longitude.val() },
			"zoom": $zoom.val()
		};
		publishChannel(cmapi_channel, cmapi_message);
	});

	// Set Map Zoom
	$button_field.on('click', '#map_set_zoom', function(){
		console.log("map set zoom");
		cmapi_channel = "map.view.zoom";
		cmapi_message = { "range": $range.val() };
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
		cmapi_message = { "types": ["selected"]       };
		publishChannel(cmapi_channel, cmapi_message);
	});

/************************ End Map Status Channels - Request Status ************************/


/************************ Start Launch Related Functions & Status Display  ************************/

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
   else {
      var guidOfWidgetToLaunch = findResultsResponseJSON[0].path;
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
	 /************************ Start Map Status Listener Channels ************************/
// var publishChannel = function (channel, message) {
// 		$widgetChannel.empty().append("Channel: " + channel);
// 		$widgetPayload.empty().append("Payload: " + JSON.stringify(message));
// 		$launchResults.empty(); // clear display
// 		OWF.Eventing.publish(channel, message);
// 	}
	// var catchMessage = true;

	var prepareMessage = function (message) {
	    if (typeof message === 'string') {
	        message = angular.fromJson(message);
	    }
	    // console.log("here is the payload message prepared from JSON: ");
	    // console.log(message);
	    return message;
	};
	
	OWF.Eventing.subscribe("map.status.view", function (sender, message) {
			message = prepareMessage(message);
			console.log("map.status.view - southWest: %O, northEast: %O", message.bounds.southWest, message.bounds.northEast);
			console.log("map.status.view - latitude: %O, longitude %O", message.center.lat, message.center.lon);
			console.log("map.status.view - range: %O", message.range);
			console.log("map.status.view - sender GUID: %O", sender);
	});

	OWF.Eventing.subscribe("map.status.format", function (sender, message) {
			message = prepareMessage(message);
			for (var i = 0; i < message.formats.length; i++) {
				console.log("map.status.format - valid format: ", message.formats[i]);
			}
			// console.log(sender);
	});

	OWF.Eventing.subscribe("map.status.about", function (sender, message) {
			message = prepareMessage(message);
			console.log("map.status.about - version: %O", message.version);
			console.log("map.status.about - type: %O", message.type);
			console.log("map.status.about - widgetName: %O", message.widgetName);
			// console.log(sender);
	});

	OWF.Eventing.subscribe("map.status.selected", function (sender, message) {
			message = prepareMessage(message);
			console.log("inside map.status.selected message %O", message);
			// console.log(sender);
	});

/************************ End Map Status Listener Channels ************************/
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
   $isRunning.empty().append('Running in OWF: ' + (OWF.Util.isRunningInOWF()?"Yes":"No"));
}

owfdojo.addOnLoad(function() {
  OWF.ready(initPage);
});

/************************ End Launch Related Functions & Status Display  ************************/







