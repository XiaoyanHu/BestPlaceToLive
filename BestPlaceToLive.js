var map;
var map_extent;
var myView;
var symbolCategory;
var colorArray;
var symbolAttribute;
var content;
var overlay;
var select;

$(document).ready(function(){
	
	var myLayers = addlayers();	
	setupMap(myLayers);
	createTree();
	$("#full_ext").click(FullExt);
	popWindow();
	$('#clear_select').click(ClearSelect);
	
});
		
/*##############################################################################*/
/*set back to original map extent*/
function FullExt() {
	myView.fit(map_extent,map.getSize());
	myView.setZoom(8);
};

//clear selection on map
function ClearSelect(){
	map.removeInteraction(select);
	overlay.setPosition(undefined);
};

function createTree(){
//add layer control panel
	$('#jstree').jstree({
		'core':{
			'themes':{'variant':'large'},
			'data':[
					{
						'text':'Administrative Boundary',
						'icon':false,
						state:{checked:true},
						'children':
						[
							{'text':'County Boundary',
							state:{checked:true}

							},
							{'text':'City Town Boundary',
							state:{checked:true}
							}
						]
					},
					{
						'text':'Entertainment',
						'icon':false,
						'children':
						[
							{'text':'Library',
			 				'icon':'Icon/library.png'},
			 				{'text':'Bike Trail'},
			 				{'text':'Local Park'}
			 			]
			 		},
			 		{
			 			'text':'Education',
			 			'icon':false,
			 			'children':
			 			[
			 				{'text':'College',
			 				'icon':'Icon/college.png'}
			 			]
			 		},
			 		{
			 			'text':'Facility',
			 			'icon':false,
			 			'children':
			 			[
			 				{'text':'Hospital',
			 				'icon':'Icon/hospital.png'}
			 			]
			 		},
			 		{
			 			'text':'Others',
			 			'icon':false,
			 			'children':
			 			[
			 				{'text':'Crime'}
			 			]
			 		}
				]
			},
		'checkbox':{
			//three_state:false, // to avoid that fact that checking a node also check others
			whole_node: false, // to avoid checking the box just clicking the node 
			tie_selection: false, // for checking without selecting and selecting without checking
			cascade:'down'
		},
		'plugins':['checkbox','wholerow']
	}).bind('check_node.jstree uncheck_node.jstree',function(e,data){
		
		var cl=data.node.children;
		console.log(cl);
		
		if(data.node.children.length>0){
			
			for (i in cl){
				//console.log(cl[i]);
				child_info=data.instance.get_node(cl[i]); //get children node by node id
				//console.log(child_info.text);
				SelectNode(data,child_info.text);
				//console.log('1111111')
			}
			
		}
		else{
			SelectNode(data,data.node.text);
			//console.log('222222')
		}
	});

};

//create layer source and layer vector
function getGeoserverWFS(layername,workspace,typename,style,visibility){
	var layersource = new ol.source.Vector({
		loader: function(extent) {
			$.ajax('http://localhost:8080/geoserver/' + workspace + '/wfs',{
					type: 'GET',
					data: {
						service: 'WFS',
						version: '1.1.0',
						request: 'GetFeature',
						typename: workspace + ':' + typename,
						srsname: 'EPSG:3857',
						//bbox: extent.join(',') + ',EPSG:4326'
						layername:layername
			    	},
			}).done(
					function(response) {
	    				var formatWFS = new ol.format.WFS();
	   					layersource.addFeatures(formatWFS.readFeatures(response));
					}
				);
		}
	});


	if (style['attribute']){
		symbolCategory=style['class'];
		symbolAttribute=style['attribute'];
		colorArray=style['colorArray'];

		var layer  = new ol.layer.Vector({
			layername:layername,
		    source: layersource,
		    style: styleFunction,
			visible: visibility
		});
	}
	else{
		var layer  = new ol.layer.Vector({
			layername:layername,
		    source: layersource,
		    style: style,
			visible: visibility
	});
	
	}
	return layer;

	
}

//add layer to map canvas
function addlayers(){
	var layerArray = [];

	for (i = 0; i < layerConfigurations.length; i++) {
		var layerConfig = layerConfigurations[i];
		if (layerConfig['category']){
			var layer  = new ol.layer.Tile({
				layername:layerConfig['layername'],
			    source: layerConfig['source'],
			});
		}
		else{
			var layer = getGeoserverWFS(layerConfig['layername'],layerConfig['workspace'],layerConfig['typename'],layerConfig['style'],layerConfig['visibility']); 
		}
		layerArray.push(layer);
	}

	return layerArray;
}

//set up map
function setupMap(myLayers){

	var centerCoords = [-71,42.3];
	/*as the layer could be projected instead of in decimal degree, so project it first*/
	var transCoords = ol.proj.transform(centerCoords,'EPSG:4326','EPSG:3857');

	myView = new ol.View({
		center:transCoords,
		zoom:8
	});

	map = new ol.Map({
		target:"mymap",
		layers:myLayers,
		
		view:myView
	});

	map_extent = map.getView().calculateExtent(map.getSize());
	
	select=null;
	var select_singleClick;
	 /*
    * Add a click handler to the map to render the popup.
    */
    map.on('singleclick', function(evt) {
    	

    	//only show pop up window if click at loaded layers
    	var feature = map.forEachFeatureAtPixel(evt.pixel,function(feature,layer){
    		return feature;
    	});
    	
    	if (feature){

    		var coord = evt.coordinate;    		
    		var props=feature.getProperties();  
    		console.log(props);
    		//label popup window based on feature attributes
    		if (feature.getId().indexOf('ma_countybdry')!=-1){
    			content.innerHTML = '<p>County: '+props.county+'</p>'
    		}  	
    		else if (feature.getId().indexOf('ma_citytown')!=-1){
    			content.innerHTML = '<p>Town: '+props.town_c+'</p>'
    		}
    		else if (feature.getId().indexOf('ma_library_prj')!==-1){
    			content.innerHTML='<p>Name: '+props.name+'</p>'+'<p>Office: '+props.office+'</p>'+'<p>Address: '+props.address+'</p>'+'<p>Town: '+props.town+'</p>'+'<p>State: '+props.state+'</p>'
    		}
    		else if (feature.getId().indexOf('ma_bike')!==-1){
    			content.innerHTML='<p>Trail Name: '+props.trailname+'</p>'
    		}
    		else if (feature.getId().indexOf('ma_parks')!==-1){
    			content.innerHTML='<p>Park Name: '+props.name+'</p>'
    		}
    		else if (feature.getId().indexOf('ma_college')!==-1){
    			content.innerHTML='<p>College Name: '+props.college+'</p>'+'<p>Address1: '+props.address+'</p>'+'<p>Address2: '+props.cityst+'</p>'+'<p>Zip Code: '+props.zipcode+'</p>'+'<p>URL: '+props.url+'</p>'
    		}
    		else if (feature.getId().indexOf('ma_hospital')!==-1){
    			content.innerHTML='<p>Hospital Name: '+props.name+'</p>'
    		}
    		else if (feature.getId().indexOf('ma_citytown_crime')!==-1){
    			content.innerHTML='<p>Town/City: '+props.town_c+'</p>'+'<p>Number of Incidents: '+props.num_incide+'</p>'
    		}
    		else{
    			content.innerHTML='<p>TEST</P>'
    		};
    	
    	
       	overlay.setPosition(coord);
    	

    	};
    	//add map interaction to highlight select polygon
    	if (select!=null){
    		map.removeInteraction(select);
    	}
    	select_singleClick=new ol.interaction.Select();
 		select=select_singleClick;
 		map.addInteraction(select);
	});



}



//toggle layers
function SelectNode(data,x){
	//console.log(x);
	var layer;
	map.getLayers().forEach(function(lyr){
				
	if(x==lyr.get('layername')){
		layer=lyr;
		//console.log(data.node.state.checked);
		if (data.node.state.checked == true){
		//console.log(data.node.state.checked);
			layer.setVisible(true);
			}else{
			//console.log('111');
			layer.setVisible(false);
						}
			}

		});
	
};

//change symbology based on attribute
function styleFunction(feature,resolution){
	// symbolCategory and colorArray are currently set based on current layer
	// Fetch the value from global var
	// Using slice method to do a shallow copy instead deep copy
	// Google shawllow copy VS deep copy for difference
	var symbolCategory_instance = symbolCategory.slice();
	var colorArray_instance = colorArray.slice();
	//get one record at a time by individual feature
	var attributeValue = parseInt(feature.get(symbolAttribute));

	// Push current value into the category array and sort the array
	// To find the index which is the same in the colorArray
	symbolCategory_instance.push(attributeValue);

	symbolCategory_instance.sort(function(a, b){return a-b});;

	var index = symbolCategory_instance.indexOf(attributeValue);

	var Style_instance = new ol.style.Style({
        fill: new ol.style.Fill({
          color: colorArray_instance[index]
        }),
        stroke: new ol.style.Stroke({
          color: 'grey',
          width: 0.5
        })
      });

	return [Style_instance];
};

function popWindow(){
	console.log('popwindow');
	/* Elements that make up the popup. */
	var container = document.getElementById('popup');
	content = document.getElementById('popup-content');
	var closer = document.getElementById('popup-closer');

	/* Create an overlay to anchor the popup to the map.*/ 
	overlay = new ol.Overlay({
		element: container
		
	});
   	map.addOverlay(overlay);
	
     /**
       * Add a click handler to hide the popup.
       * @return {boolean} Don't follow the href.
       */
    closer.onclick = function() {
    	overlay.setPosition(undefined);
    	closer.blur();
    	return false;
      };

};