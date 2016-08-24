	DisasterAware is CMAPI v1.2.0 compliant. Additional channel commands 
	that are specific to the DisasterAware application are also provided 
	and documented below. The files in this repository can be used to create 
	an example widget that demonstrates the CMAPI v1.2.0 compliant commands 
	and the additional DisasterAware specific commands.

# list 
#DisasterAware - CMAPI v1.2.0
#### DisasterAware Launch with Payload: [launch](#launch) 
## DisasterAware Submit Channels
#### Set Language Translation: ["gbsp.localeChannel"](#gbsp_locale_channel)
#### Add Layer Filter: ["layer.filter.add"](#layer_filter_add)
#### Toggle Layer Filter:["layer.filter.toggle"](#layer_filter_toggle)
#### Load Bookmark: ["org.pdc.bookmark.load"](#org_pdc_bookmark_load)
#### Set Animation Time: ["map.animation.time"](#map_animation_time)
## DisasterAware Publish Channels
#### Show Map Overlay: ["jpeo.map.overlay.show"](#jpeo_map_overlay_show)
#### Hide Map Overlay: ["jpeo.map.overlay.hide"](#jpeo_map_overlay_hide)
#### Center Map on Hazard:["jpeo.map.center.hazard"](#jpeo_map_center_hazard)
#### View Center Location: ["map.view.center.location"](#map_view_center_location)
#### View Center Bounds: ["map.view.center.bounds"](#map_view_center_bounds)
#### Application Launched: ["org.pdc.app.didLoad"](#org_pdc_app_didLoad)


## [CMAPI v1.2.0 API Core Specification](http://cmapi.org/versions/v1.2.0/index.html)
### [DisasterAware Errata to CMAPI v1.2.0 Specification](#Errata)
<br>
<hr>

####launch
#DisasterAware Launch with Bookmark Payload:
####[back to list](#list)
###Purpose:
To launch the DisasterAware widget from an external widget.

###Description:
The DisasterAware widget can be launched from an external widget with a call to OWF.Launch.launcher(). 
Within the call to OWF.Launch.launcher() an object containing the GUID of the widget to launch,
data, and a boolean if set to true will only launch an unopened widget.

DisasterAware accepts a bookmark payload and will load that bookmark after launch. 
The bookmark payload is not required for the application to launch.

###Example launch code:
	
The data payload is as follows:

     var data = {
	  channel: "org.pdc.bookmark.load",
	  payload: bookmarkPayload
	};

Where the bookmarkUrlPayload is:

	var bookmarkPayload = { "bookmarkUrl": "<url of bookmark>" };
	
	or
	
	var bookmarkPayload = { "bookmarkId": "<Id of bookmark>" }

It can be launched with the following:

     var dataString = OWF.Util.toString(data);
     
     OWF.Launcher.launch(
       {
         guid: guidOfWidgetToLaunch,  // The retrieved GUID of the widget to launch
         launchOnlyIfClosed: true,    // If true will only launch an unopened widget.
         data: dataString             // Initial launch config data (channel 
         							  // and payload) to be passed to the
                                      // widget as it is opened.  
       }, 
         callbackOnLaunch
      );
	

<hr>
#Channels:
#### gbsp_locale_channel
#gbsp.localeChannel 
####[back to list](#list)
###Purpose:

To translate the language of DisasterAware based on the locale setting.

###Channel:

`gbsp.localeChannel`

###Payload:

	{
		locale: string
	}
	
###Properties
<table>
	<tr>
		<th>Properties</th><th>Required</th><th>Type</th><th>Default</th><th>Description</th>
	</tr>
	<tr>
		<td>locale</td><td>true</td><td>string</td><td>N/A</td><td>The language translation of the app is based on the locale setting. See notes for the locale string settings. </td>
	</tr>
</table>

###Notes
	Locale Setting Options:
		"EN_US" - English
		"ID" - Indonesian
		"ES" - Spanish
		"TH" - Thai
		"VI" - Vietnamese
	

###Schema

###Example Payloads
	For English:
	{
		"locale": "EN_US"
	}
	
	or
	
	For Spanish:
	{
		"locale": "ES"
	}
<hr>
#### layer_filter_add
#layer.filter.add
####[back to list](#list)
###Purpose:

Add a filter for a specified map layer.

###Channel:


`layer.filter.add`

###Payload:

	{
		layerId: string,
		filter: {
			<filterable attribute>: {
				fieldName: string,
				text: string
			}
		}
	}
	

###Properties
<table>
	<tr>
		<th>Properties</th><th>Required</th><th>Type</th><th>Default</th><th>Description</th>
	</tr>
	<tr>
		<td>layerId</td><td>true</td><td>string</td><td>N/A</td><td>The layerId is used to reference the filter in the toggle command.</td>
	</tr>
	<tr>
		<td>filter</td><td>true</td><td>object</td><td>N/A</td><td>Specify which filterable attribute and fieldname to be used in the filter. </td>
	</tr>
</table>


###Notes

###Schema

###Example Payload

	{
		"layerId"": "Recent_Earthquakes",
		"filter": {
			"region": {
				"fieldName": "region",
				"text": "oklahoma"
			}
		}
	}
	
<hr>
#### layer_filter_toggle
#layer.filter.toggle
####[back to list](#list)
###Purpose:

To toggle a specified filter on and off.

###Channel:

`layer.filter.toggle`

###Payload:

	{
		layerId: string
	}
	

###Properties
<table>
	<tr>
		<th>Properties</th><th>Required</th><th>Type</th><th>Default</th><th>Description</th>
	</tr>
	<tr>
		<td>layerId</td><td>true</td><td>string</td><td>N/A</td><td>The layerId is used to speciy which layer to toggle the filter on and off of.</td>
	</tr>
</table>


###Notes

###Schema

###Example Payload

	{
		"layerId"": "Recent_Earthquakes"
	}
		
<hr>
#### org_pdc_bookmark_load
#org.pdc.bookmark.load 
####[back to list](#list)
###Purpose:

Load DisasterAware at specified bookmark location.

###Channel:


`org.pdc.bookmark.load`

###Payload:

	{
		bookmarkId: integer
	}
	
	or
	
	{
		bookmarkUrl: string
	}

###Properties
<table>
<tr>
<th>Properties</th><th>Required</th><th>Type</th><th>Default</th><th>Description</th>
</tr>

<tr>
<td>bookmarkId</td><td>true</td><td>integer</td><td>N/A</td><td>Bookmark ID</td>
</tr>
</table>
 or
 <table>
<tr>
<th>Properties</th><th>Required</th><th>Type</th><th>Default</th><th>Description</th>
</tr>
<tr>
<td>bookmarkUrl</td><td>true</td><td>string</td><td>N/A</td><td>Url that contains a bookmark link.</td>
</tr>
</table>

###Notes

###Schema

###Example Payloads
	{
		"bookmarkId": 9853
	}
	
	or
	
	{
		"bookmarkUrl": "http://local.msmv.pdc.org:8080/msmvng/msmvng/?bookmark=9853"
	}
<hr>
#### map_animation_time
#map.animation.time 
####[back to list](#list)
###Purpose:

To set the time to start or resume the animation. The animation will start at the given time as long 
as the time given is within that animation's time window. The start time must be specified as a
UNIX timestamp in milliseconds.

###Channel:


`map.animation.time`

###Payload:

	{
		time: string
	}


###Properties
<table>
<tr>
<th>Properties</th><th>Required</th><th>Type</th><th>Default</th><th>Description</th>
</tr>

<tr>
<td>time</td><td>true</td><td>string</td><td>N/A</td><td>Specify the animation start time with UNIX timestamp in milliseconds.</td>
</tr>
</table>


###Notes

###Schema

###Example Payloads
	{
		"time": "1414270861000"
	}
	
	would result in a date of: 2014-10-25T21:00:00.000Z

<hr>

#### jpeo_map_overlay_show
#jpeo.map.overlay.show
####[back to list](#list)
###Purpose:

DisasterAware publishes information (id, description, state, and sender) about the layer that was added.
###Channel:


`jpeo.map.overlay.show`

###Payload:

	{
		layerId: string,
		layerDescription: string,
		layerState: string,
		sender: string
	}


###Properties
<table>
<tr>
<th>Properties</th><th>Type</th><th>Description</th>
</tr>
<tr>
<td>layerId</td><td>string</td><td>Id for layer added.</td>
</tr>
<tr>
<td>layerDescription</td><td>string</td><td>Brief description of layer added.</td>
</tr>
<tr>
<td>layerState</td><td>string</td><td>True or False...</td>
</tr>
<tr>
<td>sender</td><td>string</td><td>GUID of sending widget.</td>
</tr>
</table>


<hr>
#### jpeo_map_overlay_hide
#jpeo.map.overlay.hide
####[back to list](#list)
###Purpose:

DisasterAware publishes information (id, description, state, and sender) about the layer that was removed.

###Channel:


`jpeo.map.overlay.hide`

###Payload:

	{
		layerId: string,
		layerDescription: string,
		layerState: string,
		sender: string
	}


###Properties
<table>
<tr>
<th>Properties</th><th>Type</th><th>Description</th>
</tr>

<tr>
<td>layerId</td><td>string</td><td>Id for layer removed.</td>
</tr>
<tr>
<td>layerDescription</td><td>string</td><td>Brief description of layer removed.</td>
</tr>
<tr>
<td>layerState</td><td>string</td><td>True or False...</td>
</tr>
<tr>
<td>sender</td><td>string</td><td>GUID of sending widget.</td>
</tr>
</table>


<hr>
#### jpeo_map_center_hazard
#jpeo.map.center.hazard
####[back to list](#list)
###Purpose:

DisasterAware publishes the location of the hazard when the hazard is selected (double click on icon) or edited.

###Channel:


`jpeo.map.center.hazard`

###Payload:

	{
		hazardId: string,
		location.lat: string,
		location.lon: string,
		zoom: string,
		sender: string
	}


###Properties
<table>
<tr>
<th>Properties</th><th>Type</th><th>Description</th>
</tr>

<tr>
<td>hazardId</td><td>string</td><td>Id of the Hazard selected or edited.</td>
</tr>
<tr>
<td>location.lat</td><td>string</td><td>Latitude of Hazard location.</td>
</tr>
<tr>
<td>location.lon</td><td>string</td><td>Longitude of Hazard location.</td>
</tr>
<tr>
<td>zoom</td><td>string</td><td>Zoom level in meters of map view.</td>
</tr>
<tr>
<td>sender</td><td>string</td><td>GUID of sending widget.</td>
</tr>
</table>


<hr>
#### map_view_center_location
#map.view.center.location 
####[back to list](#list)
###Purpose:

DisasterAware publishes the latitude, logitude and zoom for the center location of the map when there is a change to any one of the parameters.

###Channel:


`map.view.center.location`

###Payload:

	{
		location.lat: string,
		location.lon: string,
		zoom: string,
		sender: string
	}


###Properties
<table>
<tr>
<th>Properties</th><th>Type</th><th>Description</th>
</tr>

<tr>
<td>location.lat</td><td>string</td><td>Latitude of center of map.</td>
</tr>
<tr>
<td>location.lon</td><td>string</td><td>Longitude of center of map.</td>
</tr>
<tr>
<td>zoom</td><td>string</td><td>Zoom level for current map view.</td>
</tr>
<tr>
<td>sender</td><td>string</td><td>GUID of sending widget.</td>
</tr>
</table>


<hr>
#### map_view_center_bounds
#map.view.center.bounds
####[back to list](#list)
###Purpose:

DisasterAware publishes the rectangular map bounds when the "Area Brief", "Identify", or "ZoomTo" modes are selected.

###Channel:


`map.view.center.bounds`

###Payload:

	{
		southWest.lat: string,
		southWest.lon: string,
		northEast.lat: string,
		northEast.lon: string,
		zoom: string,
		sender: string
	}


###Properties
<table>
<tr>
<th>Properties</th><th>Type</th><th>Description</th>
</tr>

<tr>
<td>southWest.lat</td><td>string</td><td>SouthWest latitude of current map view.</td>
</tr>
<tr>
<td>southWest.lon</td><td>string</td><td>SouthWest longitude of current map view.</td>
</tr>
<tr>
<td>northEast.lat</td><td>string</td><td>NorthEast latitude of current map view.</td>
</tr>
<tr>
<td>northEast.lon</td><td>string</td><td>NorthEast longitude of current map view.</td>
</tr>
<tr>
<td>zoom</td><td>string</td><td>Zoom level for current map view.</td>
</tr>
<td>sender</td><td>string</td><td>GUID of sending widget.</td>
</tr>
</table>

<hr>

#### org_pdc_app_didLoad
#org.pdc.app.didLoad
####[back to list](#list)
###Purpose:

DisasterAware publishes to this channel when the app has completed loading. The payload message is empty.

###Channel:

`org.pdc.app.didLoad`

###Payload:

	{ }


###Properties
	none


<hr>

#### Errata
#DisasterAware Errata to CMAPI v1.2.0 Specification
#map.feature.selected 

###Properties not supported
<table>
<tr>
<th>Properties</th><th>Required</th><th>Type</th><th>Default</th><th>Description</th>
</tr>
<tr>
<td>selectedId</td><td>false</td><td>string</td><td>N/A</td><td>Specify id of sub-feature.</td>
</tr>
<tr>
<td>selectedName</td><td>false</td><td>string</td><td>N/A</td><td>Specify the feature name.</td>
</tr>
</table>

#map.feature.deselected
###Properties not supported
<table>
<tr>
<th>Properties</th><th>Required</th><th>Type</th><th>Default</th><th>Description</th>
</tr>
<tr>
<td>deselectedId</td><td>false</td><td>string</td><td>N/A</td><td>Specify id of sub-feature.</td>
</tr>
<tr>
<td>deselectedName</td><td>false</td><td>string</td><td>N/A</td><td>Specify the feature name.</td>
</tr>
</table>
