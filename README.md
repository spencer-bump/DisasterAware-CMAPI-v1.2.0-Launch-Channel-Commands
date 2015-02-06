	DisasterAware is CMAPI v1.2.0 compliant. Additional channel commands 
	that are specific to the DisasterAware application are also provided 
	and documented below. The files in this repository can be used to create 
	an example widget that demonstrates the CMAPI v1.2.0 compliant commands 
	and the additional DisasterAware specific commands.

# list 
#DisasterAware - CMAPI v1.2.0
#### DisasterAware Launch with Payload: [launch](#launch) 
## DisasterAware Channels
#### Set Language Translation: ["gbsp.localeChannel"](#gbsp_locale_channel)
#### Add Layer Filter: ["layer.filter.add"](#layer_filter_add)
#### Toggle Layer Filter:["layer.filter.toggle"](#layer_filter_toggle)
#### Load Bookmark: ["org.pdc.bookmark.load"](#org_pdc_bookmark_load)
#### Set Animation Time: ["map.view.animation.time"](#map_view_animation_time)
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

If the data for the launch is set to the bookmark channel and specific bookmark payload the DisasterAware application will lauch and load that bookmark. The bookmark payload is not required for the application to launch.

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

#### map_view_animation_time
#map.view.animation.time 
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
