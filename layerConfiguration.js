var layerConfigurations = 
[

{
	layername: 'Basemap',
	category : 'BaseMap',
	source: new ol.source.OSM()
},

{
	layername:'City Town Boundary',
	workspace : "BestPlaceToLive", 
	typename : "ma_citytown", 
	style:{
		attribute:'pop2010',
		class:[20000,70000,180000],
		colorArray:[
			[241,238,246,1],
			[189,201,225,1],
			[116,169,207,1],
			[5,112,176,1]
		]
	},

	/*
	style : new ol.style.Style({
    			stroke: new ol.style.Stroke({
    				color: 'blue',
    				width: 2
				})
			}),*/
	visibility: true
},

{	
	layername:'County Boundary',
	workspace : "BestPlaceToLive",
	typename : "ma_countybdry",
	style: new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: "#000033",
			width: 2
		})
	}),
	visibility:true
},
{
	layername:'Local Park',
	workspace:"BestPlaceToLive",
	typename:"ma_parks",
	style: new ol.style.Style({
		stroke: new ol.style.Stroke({
			color: 'green',
			width:2
		})
	}),
	visibility: false
},
{
	layername:'Crime',
	workspace : "BestPlaceToLive", 
	typename : "ma_citytown_crime", 
	style : new ol.style.Style({
    			stroke: new ol.style.Stroke({
    			color: 'yellow',
    			width: 2
				})
			}),
	visibility: false
},
{
	layername:'Bike Trail',
	workspace:"BestPlaceToLive",
	typename:"ma_bike",
	style: new ol.style.Style({
			stroke: new ol.style.Stroke({
			color:'purple',
			width:2
				})
			}),
	visibility:false
},
{
	layername:'Library',
	workspace : "BestPlaceToLive", 
	typename : "ma_library_prj", 
	style : new ol.style.Style({
		 		image: new ol.style.Icon({
		   			anchor: [0.5,0.5],
		   			size: [2000,2000],
		   			//offset: [1067,0],
		   			opacity: 1,
		   			scale:0.01,
		   			//src:'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Circle-icons-bookshelf.svg/2000px-Circle-icons-bookshelf.svg.png'
		   			src:'Icon/library.png'
		 		}),
		 		zIndex: Infinity
			}),
	visibility: false
},
{
	layername:'Hospital',
	workspace : "BestPlaceToLive", 
	typename : "ma_hospital", 
	style : new ol.style.Style({
		 		image: new ol.style.Icon({
		   			anchor: [0.5,0.5],
		   			size: [256,256],
		   			//offset: [300,0],
		   			opacity: 1,
		   			scale:0.1,
		   			//src:'http://www.iconarchive.com/download/i87464/graphicloads/medical-health/hospital-sign.ico'
		   			src:'Icon/hospital.png'
		 		}),
		 		zIndex: Infinity
			}),
	visibility: false
},
{
	layername:'College',
	workspace : "BestPlaceToLive", 
	typename : "ma_college", 
	style : new ol.style.Style({
		 		image: new ol.style.Icon({
		   			anchor: [0.5,0.5],
		   			size: [300,300],
		   			//offset: [300,0],
		   			opacity: 1,
		   			scale:0.05,
		   			//src:'http://ui.aroundcampusgroup.com/images/internships.png'
		   			src:'Icon/college.png'
		 		}),
		 		zIndex: Infinity
			}),
	visibility: false
}]
