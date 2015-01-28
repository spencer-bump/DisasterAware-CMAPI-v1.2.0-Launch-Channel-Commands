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

var widgetToLaunch;

// jQuery variables
var $button_field 				= $('#button_field');
var $isRunning  					= $('#isRunning');
var $widgetPayload 				= $('#widgetPayload');
var $widgetName 					= $('#widgetName');
var $widgetChannel 	      = $('#widgetChannel');
var $launchResults 	      = $('#launchResults');
var $error_panel 		      = $('#error-panel');
var $bookmarkId 		      = $('#bookmarkId');
var $bookmarkUrl 		      = $('#bookmarkUrl');
var $overlayUrl 		      = $('#overlayUrl');
var $latitude							= $('#map-latitude');
var $longitude						= $('#map-longitude');
var $zoom 					      = $('#map-zoom');
var $zoom_zoom			      = $('#map-zoom-zoom');
var $channelBookmarkId 	  = $('#channelBookmarkId');
var $channelBookmarkUrl 	= $('#channelBookmarkUrl');
var $layerId							= $('#filter-layerId');
var $filter_fieldName			= $('#filter-fieldName');
var $filter_text					= $('#filter-text');

// launch variables
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

// default bookmarks for channel commands
var channelBookmarkIdPayload = { "bookmarkId": 9944 }; // good location to test filter toggle
var channelBookmarkUrlPayload = { "bookmarkUrl": "http://local.msmv.pdc.org:8080/msmvng/msmvng/?bookmark=9886" };

// default overlay url
var overlayUrl = "http://plu.sx/kml/1.kml";
// var overlayUrl = "plu.sx/kml/1.kml";

/**   Launch Code  **/
// load bookmark launch input fields with default values
$bookmarkId.val(bookmarkIdPayload.bookmarkId);
$bookmarkUrl.val(bookmarkUrlPayload.bookmarkUrl);

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
	$('#launch_msmv').text("Launch " + widgetOne + " by ID");
	$('#launch_trunk').text("Launch " + widgetTwo + " by ID");
	data.payload = {};
	data.payload[$(this).val()] = $('#bookmarkId').val();
});

// change launch payload to use bookmarkUrl with radio button
$('#launchWithUrl').on('change', function () {
	$('#launch_msmv').text("Launch " + widgetOne + " by URL");
	$('#launch_trunk').text("Launch " + widgetTwo + " by URL");
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

// Lookup GUID for the widget whose name is set in the 'widgetOne' variable
// launch the widget if successful
$button_field.on('click', '#launch_msmv', function(){
	widgetToLaunch = widgetOne; // set to "MSMV" by default
	$widgetPayload.empty().append("Payload: " + JSON.stringify(data.payload));
	lookupSecondTracker();
});

// Lookup GUID for the widget whose name is set in the 'widgetTwo' variable
// launch the widget if successful
$button_field.on('click', '#launch_trunk', function(){
	widgetToLaunch = widgetTwo; // set to "MSMV Trunk" by default
	$widgetPayload.empty().append("Payload: " + JSON.stringify(data.payload));
	lookupSecondTracker()
});
/**   End Launch Code  **/

/********************************/
/*** Publish Channel Function ***/
var publishChannel = function (channel, message) {
	$widgetChannel.empty().append("Channel: " + channel);
	$widgetPayload.empty().append("Payload: " + JSON.stringify(message));
	$launchResults.empty();
	OWF.Eventing.publish(channel, message);
}
/********************************/

/*** Bookmark Code ***/
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

/*** Overlay Code ***/
// load overlay input field with default value
$overlayUrl.val(overlayUrl);

// Create Overlay
$button_field.on('click', '#create_overlay', function(){ 
	console.log("create overlay");
	overlayUrl = $overlayUrl.val();
	cmapi_channel = "map.overlay.create";
	cmapi_message = { 
					"overlayId": 	"myOverlay", 
					"url": 				overlayUrl
				};
	publishChannel(cmapi_channel, cmapi_message);
});

// Remove Overlay
$button_field.on('click', '#remove_overlay', function(){ 
	console.log("remove overlay");
	cmapi_channel = "map.overlay.remove";
	cmapi_message = { "overlayId": 	"myOverlay" };
	publishChannel(cmapi_channel, cmapi_message);
});

// Show Overlay
$button_field.on('click', '#show_overlay', function(){ 
	console.log("show overlay");
	cmapi_channel = "map.overlay.show";
	cmapi_message = { "overlayId": 	"myOverlay" };
	publishChannel(cmapi_channel, cmapi_message);
});

// Hide Overlay
$button_field.on('click', '#hide_overlay', function(){ 
	console.log("hide overlay");
	cmapi_channel = "map.overlay.hide";
	cmapi_message = { "overlayId": 	"myOverlay" };
	publishChannel(cmapi_channel, cmapi_message);
});

// Update Overlay
$button_field.on('click', '#update_overlay', function(){ 
	console.log("update overlay");
	cmapi_channel = "map.overlay.update";
	cmapi_message = { "overlayId": 	"myOverlay" };
	publishChannel(cmapi_channel, cmapi_message);
});
/*** End Overlay Code ***/

/*** Map Control Code ***/
var mapLatitude = 38.186;
$latitude.val(mapLatitude);
var mapLongitude = -98.042;
$longitude.val(mapLongitude);
var zoom = 2500;
$zoom.val(zoom);
var zoom_zoom = 5000;
$zoom_zoom.val(zoom_zoom);

// Set Map Center
$button_field.on('click', '#map_set_center', function(){
	console.log("map set center clicked");
	mapLatitude = $latitude.val();
	mapLongitude = $longitude.val();
	zoom = $zoom.val();
	cmapi_channel = "map.view.center.location";
	cmapi_message = {  
		// Default location is Oklahoma to view filter toggling
		"location": { "lat": mapLatitude, "lon": mapLongitude },
		"zoom": zoom
	};
	publishChannel(cmapi_channel, cmapi_message);
});

// Set Map Zoom
$button_field.on('click', '#map_set_zoom', function(){
	console.log("map set zoom");
	zoom_zoom = $zoom_zoom.val();
	cmapi_channel = "map.view.zoom";
	cmapi_message = { "range": zoom_zoom };
	publishChannel(cmapi_channel, cmapi_message);
});
/*** End Map Control Code ***/

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
	cmapi_message = { "layerId": "Recent_Earthquakes" };
	publishChannel(cmapi_channel, cmapi_message);
});
/*** End Filter Code ***/

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








