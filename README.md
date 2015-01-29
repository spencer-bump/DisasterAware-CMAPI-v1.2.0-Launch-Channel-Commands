The files in this repository can be used to create an example widget 
that demonstrates the following list of commands.

# list 
#DisasterAware CMAPI
#### DisasterAware Launch with Payload: [launch](#launch) 
#Channels
#### Set Language Translation: ["gbsp.localeChannel"](#gbsp_locale_channel)
#### Add Layer Filter: ["layer.filter.add"](#layer_filter_add)
#### Toggle Layer Filter:["layer.filter.toggle"](#layer_filter_toggle)
#### Create Map Overlay:["map.overlay.create"](#map_overlay_create)
#### Hide Map Overlay:["map.overlay.hide"](#map_overlay_hide)
#### Remove Map Overlay:["map.overlay.remove"](#map_overlay_remove)
#### Show Map Overlay: ["map.overlay.show"](#map_overlay_show)
#### Set Map Center and Zoom: ["map.view.center.location"](#map_view_center_location)
#### Set Map Zoom: ["map.view.zoom"](#map_view_zoom)
#### Set Animation Time: ["map.view.animation.time"](#map_view_animation_time)
#### Load Bookmark: ["org.pdc.bookmark.load"](#org_pdc_bookmark_load)
<br>
<hr>

####launch
#DisasterAware Launch with Payload:
####[back to list](#list)
###Purpose:
To launch the DisasterAware widget from an external widget.

###Description:
The DisasterAware widget can be launched from an external widget with a call to OWF.Launch.launcher(). 
Within the call to OWF.Launch.launcher() an object containing the GUID of the widget to launch,
data, and a boolean if set to true will only launch an unopened widget.

If the data for the launch is set to the bookmark channel and specific bookmark payload the DisasterAware
application will lauch and load that bookmark.

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
         data: dataString             // Initial launch config data to be passed to 
                                      // a widget only if the widget is opened.  
                                      // The data must be a string!
       }, 
         callbackOnLaunch
      );
	
The callbackOnLaunch function can be used for success and/or error messages.


<hr>
#Chanels:
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
#### map_overlay_create
#map.overlay.create 
####[back to list](#list)
###Purpose:

Create KML overlay with specified ID and source url.

###Channel:

`map.overlay.create`

###Payload:

	{
		overlayId: integer or string,
		url: string
	}
	

###Properties
<table>
	<tr>
		<th>Properties</th><th>Required</th><th>Type</th><th>Default</th><th>Description</th>
	</tr>
	<tr>
		<td>overlayId</td><td>true</td><td>integer or string</td><td>N/A</td><td>The overlayId is used to reference the overlay in the show, hide, and remove commands.</td>
	</tr>
	<tr>
		<td>url</td><td>true</td><td>string</td><td>N/A</td><td>Url of the KML overlay.</td>
	</tr>
</table>

###Notes

###Schema

###Example Payload

	{
		overlayId: "myOverlay",
		url: "http://plu.sx/kml/1.kml"
	}
	
	or 
	
	{
		overlayId: 9822,
		url: "plu.sx/kml/1.kml"
	}
	
<hr>
#### map_overlay_hide
#map.overlay.hide 
####[back to list](#list)
###Purpose:

Hide overlay specified by ID.

###Channel:

`map.overlay.hide`

###Payload:

	{
		overlayId: integer or string
	}

###Properties
<table>
	<tr>
		<th>Properties</th><th>Required</th><th>Type</th><th>Default</th><th>Description</th>
	</tr>
	<tr>
		<td>overlayId</td><td>true</td><td>integer or string</td><td>N/A</td><td>The overlayId is used to specify which overlay to hide.</td>
	</tr>
</table>

###Notes

###Schema

###Example Payload

	{
		"overlayId": 9822
	}
	
	or 
	
	{
		"overlayId": "myOverlay"
	}
	
<hr>
#### map_overlay_remove
#map.overlay.remove 
####[back to list](#list)
###Purpose:

Remove overlay specified by ID.

###Channel:

`map.overlay.remove`

###Payload:

	{
		overlayId: integer or string
	}
	
###Properties
<table>
	<tr>
		<th>Properties</th><th>Required</th><th>Type</th><th>Default</th><th>Description</th>
	</tr>
	<tr>
		<td>overlayId</td><td>true</td><td>integer or string</td><td>N/A</td><td>The overlayId is used to specify which overlay to remove.</td>
	</tr>
</table>
 
###Notes

###Schema

###Example Payload

	{
		"overlayId": 9822
	}
	
	or 
	
	{
		"overlayId": "myOverlay"
	}
	
<hr>
#### map_overlay_show
#map.overlay.show 
####[back to list](#list)
###Purpose:

Show overlay specified by ID.

###Channel:

`map.overlay.show`

###Payload:

	{
		overlayId: integer or string
	}

###Properties
<table>
	<tr>
		<th>Properties</th><th>Required</th><th>Type</th><th>Default</th><th>Description</th>
	</tr>
	<tr>
		<td>overlayId</td><td>true</td><td>integer or string</td><td>N/A</td><td>The overlayId is used to specify which overlay to show.</td>	</tr>
</table>

###Notes

###Schema

###Example Payload

	{
		"overlayId": 9822
	}
	
	or 
	
	{
		"overlayId": "myOverlay"
	}
	
<hr>
#### map_view_center_location
#map.view.center.location 
####[back to list](#list)
###Purpose:

Move the DisasterAware map to the desired center location based on longitude and latitude provided.

###Channel:

`map.view.center.location`

###Payload:

	{
		"location": { "lat": float, "lon": float },
		"zoom": number
	}

###Properties
<table>
	<tr>
		<th>Properties</th><th>Required</th><th>Type</th><th>Default</th><th>Description</th>
	</tr>
	<tr>
		<td>location</td><td>true</td><td>object</td><td>N/A</td><td>The "location" object specifies longitude and latitude of desired map center position.</td>
	</tr>
	<tr>
		<td>zoom</td><td>true</td><td>integer</td><td>N/A</td><td>Submit a zoom value based on the zoom ranges specified in the notes section.</td>
	</tr>
</table>


###Notes
Map Zoom Ranges:
<table>
	<tr><th>Zoom Range</th><th>Map Zoom</th><th>Zoom Range</th><th>Map Zoom</th></tr>
	<tr><td> > 5,850 </td><td> 3 </td><td> 24 -46 </td><td> 11 </td></tr>
	<tr><td>2,975 - 5,849 </td><td> 4 </td><td> 12 - 23 </td><td> 12 </td></tr>
	<tr><td> 1,488 - 2,974 </td><td> 5 </td><td> 6 - 11 </td><td> 13 </td></tr>
	<tr><td> 744 - 1,487 </td><td> 6 </td><td> 3 - 5 </td><td> 14 </td></tr>
	<tr><td> 372 - 743 </td><td> 7 </td><td> 1.5 - 2.5 </td><td> 15 </td></tr>
	<tr><td> 186 - 371 </td><td> 8 </td><td> 0.8 - 1.4 </td><td> 16 </td></tr>
	<tr><td> 93 - 185 </td><td> 9 </td><td> 0.4 - 0.7 </td><td> 17 </td></tr>
	<tr><td> 47 - 92 </td><td> 10 </td><td> 0.2 - 0.3 </td><td> 18 </td></tr>
</table>
	

###Schema

###Example Payload

	{
		"location": { "lat": 38.186, "lon": -98.042 },
		"zoom": 2500
	}
	
<hr>
#### map_view_zoom
#map.view.zoom 
####[back to list](#list)
###Purpose:

Set the DisasterAware map zoom to the value provided.

###Channel:

`map.view.zoom`

###Payload:

	{
		range: number
	}

###Properties
<table>
	<tr>
		<th>Properties</th><th>Required</th><th>Type</th><th>Default</th><th>Description</th>
	</tr>
	<tr>
		<td>range</td><td>true</td><td>integer</td><td>N/A</td><td>Submit a zoom value based on the zoom ranges specified in the notes section.</td>
	</tr>
</table>

###Notes
Map Zoom Ranges:
<table>
	<tr><th>Zoom Range</th><th>Map Zoom</th><th>Zoom Range</th><th>Map Zoom</th></tr>
	<tr><td> > 5,850 </td><td> 3 </td><td> 24 -46 </td><td> 11 </td></tr>
	<tr><td>2,975 - 5,849 </td><td> 4 </td><td> 12 - 23 </td><td> 12 </td></tr>
	<tr><td> 1,488 - 2,974 </td><td> 5 </td><td> 6 - 11 </td><td> 13 </td></tr>
	<tr><td> 744 - 1,487 </td><td> 6 </td><td> 3 - 5 </td><td> 14 </td></tr>
	<tr><td> 372 - 743 </td><td> 7 </td><td> 1.5 - 2.5 </td><td> 15 </td></tr>
	<tr><td> 186 - 371 </td><td> 8 </td><td> 0.8 - 1.4 </td><td> 16 </td></tr>
	<tr><td> 93 - 185 </td><td> 9 </td><td> 0.4 - 0.7 </td><td> 17 </td></tr>
	<tr><td> 47 - 92 </td><td> 10 </td><td> 0.2 - 0.3 </td><td> 18 </td></tr>
</table>
###Schema

###Example Payloads
	{
		"zoom": 2500
	}

<hr>
#### map_view_animation_time
#map.view.animation.time 
####[back to list](#list)
###Purpose:

To set the time to start or resume the animation. The animation will start at the given time as long 
as the time given is within that animation's time window.

###Channel:


`map.animation.time`

###Payload:

	{
		time: date object
	}


###Properties
<table>
<tr>
<th>Properties</th><th>Required</th><th>Type</th><th>Default</th><th>Description</th>
</tr>

<tr>
<td>time</td><td>true</td><td>date object</td><td>N/A</td><td>Specify the animation start time with the date object.</td>
</tr>
</table>


###Notes

###Schema

###Example Payloads
	{
		"time": Date()
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