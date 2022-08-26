//Harita üzerine çizilmiş olan çizgilerin kayıttan sonra kalmasını sağlar!
var styles = {
    'Point': [new ol.style.Style({
        image: new ol.style.Circle({
            radius: 8,
            fill: new ol.style.Fill({
                color: [255, 255, 255, 0.3]
            }),
            stroke: new ol.style.Stroke({color: '#cb1d1d', width: 2})
        })
    })],
    'LineString': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'green',
            width: 1
        })
    })],
    'Polygon': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'blue',
            lineDash: [4],
            width: 3
        }),
        fill: new ol.style.Fill({
            color: 'rgba(0, 0, 255, 0.1)'
        })
    })],
    'Circle': [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: 'blue',
            width: 2
            
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255,0,0,0.2)'
        })
    })]
};
var styleFunction = function(feature, resolution) {
  return styles[feature.getGeometry().getType()];
};

const raster = new ol.layer.Tile({
    source: new ol.source.OSM(),
});



var features = new ol.Collection(); 
var kaynak = new ol.source.Vector({features: features});
var drawtype = "Point";

const vector = new ol.layer.Vector({
    source: kaynak,
	style: styleFunction
});

var layer1 = new ol.layer.Vector({
    source: new ol.source.Vector(),
    style: styleFunction
});


let draw, snap;
const modify = new ol.interaction.Modify({ source: kaynak });

//Map
var map = new ol.Map({
    target: 'map',
    layers: [raster, vector],
    view: new ol.View({
        center: ol.proj.fromLonLat([39.5266912715, 39.613190261]), //Türkiye için.
        zoom: 6
    })
});
map.addLayer(layer1);

var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var btnSave=document.getElementById("btnKaydet");
var cikis = document.getElementById("mcikic");

var secilen;
var kayitlar=[];
kayitlar["type"]="FeatureCollection";
kayitlar["features"]=[];
var bilgiler=[];
var dataGelen;


function addInteractions(drawtype) {
    map.getInteractions().pop();
    draw = new ol.interaction.Draw({
        source: kaynak,
        type: drawtype,
    });
	
    draw.on('drawend', function (evt) {
		var writer = new ol.format.GeoJSON();
        evt.feature.setId("Set" + kayitlar["features"].length);
        var geojson = writer.writeFeaturesObject([evt.feature],{
            featureProjection: 'EPSG:3857',
            dataProjection: 'EPSG:4326'
        });
        secilen = geojson.features[geojson.features.length - 1];
        console.log("Seçilen : " + JSON.stringify(secilen));
		$('#myModal').modal('show');
    });	
	
    map.addInteraction(draw);
}


function DrawTypeSelect(sel) {
    drawtype = sel.value;
    if (drawtype != "")
        addInteractions(drawtype);

}
addInteractions(drawtype);



// Butona tıklandığı zaman modal göster.
btn.onclick = function (event) {
		$('#myModal').modal('show');
}

//Tıkladığım zaman modal kapat ve harita üzerindeki işaretleri sil.

mcikis.onclick = function (event) {
    var a = kaynak.getFeatures();
    var b = a[a.length - 1];
    kaynak.removeFeature(b);
    $('#myModal').modal('hide');
    debugger
};

var btnSavetiklandi = false;
$('#myModal').on('hidden.bs.modal', function () {
    if (!btnSavetiklandi) {
        var a = kaynak.getFeatures();
        var b = a[a.length - 1];
        kaynak.removeFeature(b);
    }
});

btnSave.onclick = function (event) {
	var sehir=document.getElementById("sehir");
	var ilce=document.getElementById("ilce");
    var mahalle = document.getElementById("mahalle");
    var haritaID = document.getElementById("haritaID");

    var bilgi = {
        sehir: sehir.value,
        ilce: ilce.value,
        mahalle: mahalle.value,
        id: haritaID.value
    };

    if (bilgi.id == "0") {
        console.log(secilen);
        var json = secilen;
        var c = json;//.features[0];
        bilgiler.push(bilgi);
        c.properties = { name: sehir.value, description: sehir.value + " - " + ilce.value + " - " + mahalle.value };


        kayitlar["features"].push(json);
        var feature = new ol.Feature(
            new ol.geom.Point(json)
        );
        kaynak.addFeature(feature);
        sehir.value = "";
        ilce.value = "";
        mahalle.value = "";
        $('#myModal').modal('hide');
        console.log(c);
        koordinatKaydet(json, bilgi);
    } else {
        koordinatDuzenle(bilgi);
    }
}

var koordinatDuzenle = function (bilgi) {
    var Sehir = bilgi.sehir;
    var Ilce = bilgi.ilce;
    var Mahalle = bilgi.mahalle;
    var Id = bilgi.id;


    $.post('/home/updateharita/', { Sehir, Ilce, Mahalle, Id }, function (result) {
        console.log(result);
        alert("Duzenleme Yapıldı");
        $("#haritaID").val("0");
        self.location = top.location;
    }, '');
}

var koordinatKaydet = function (c,bilgi) {
    var Sehir = bilgi.sehir;
    var Ilce = bilgi.ilce;
    var Mahalle = bilgi.mahalle;
    var GeoType = c.geometry.type;
    var Koordinat = JSON.stringify(secilen);
    

    $.post('/home/addharita/', { Sehir,Ilce,Mahalle,GeoType,Koordinat }, function (result) {
        console.log(result);
        var html = "";
        html += "<tr>";
        html += "<td>" + Sehir + "</td>";
        html += "<td>" + Ilce + "</td>";
        html += "<td>" + Mahalle + "</td>";
        html += "<td>" + c.geometry.type + "</td>";
        html += "<td><button class='btn btn-sm btn-success btnDuzenle' data-id='" + result.id + "' type='button'>Düzenle</button><button class='btn btn-sm btn-danger btnRotaSil' data-index='" + kayitlar["features"].length + "' data-id='" + result.id + "' type='button'>Sil</button></td>";
        html += "</tr>";
        $("#tblCizimler tbody").append(html);
        //c.id = "Set" + result.id;
        alert("Eklendi");
        self.location = top.location
    }, '');
}

$("body").on("click", ".btnRotaSil", function () {
    var $this = $(this);
    var index = $this.data("index");
    var id = $this.data("id");
	var temp=[];
	var tempbilgi=[];
	
	//var silinen=kayitlar["features"][index];
    $.getJSON('/home/delharita/', { id }, function (result) {
        console.log(result);
        for (i = 0; i < kayitlar["features"].length; i++) {
            if (index != i) {
                temp.push(kayitlar["features"][i]);
                tempbilgi.push(bilgiler[i])
            }
        }


        kayitlar["features"] = temp;
        bilgiler = tempbilgi;

        const featureExists = kaynak.getFeatureById("Set" + index);
        if (featureExists) {
            kaynak.removeFeature(featureExists);
            $this.parents("tr").remove();
            alert("Silindi");
        }

    }, '');

});

$("body").on("click", ".btnSil", function () {
    var $this=$(this);
    var id = $this.data("id");

    $.getJSON('/home/delharita/', { id }, function (result) {
        console.log(result);
        $this.parents("tr").remove();
        alert("Silindi");
    }, '');
});

$("body").on("click", ".btnDuzenle", function () {
    console.log("Tıklandı");
    var id = $(this).data("id");

    $.getJSON('/home/getharita/', { id }, function (result) {
        console.log(result);
        dataGelen = result;
        var sehir = document.getElementById("sehir");
        var ilce = document.getElementById("ilce");
        var mahalle = document.getElementById("mahalle");
        var haritaID = document.getElementById("haritaID");
        sehir.value = result.sehir;
        ilce.value = result.ilce;
        mahalle.value = result.mahalle;
        haritaID.value = result.id;
        $('#myModal').modal('show');
    }, '');
});

function featuresToGeoJSON(features) {
    var reader = new ol.format.GeoJSON();
    var geojson = reader.writeFeatures(features, {
        featureProjection: 'EPSG:3857',
        dataProjection: 'EPSG:4326'
    });
    return JSON.parse(geojson);
}

function GeoJSONToFeature(geojson) {
    var reader = new ol.format.GeoJSON();
    var features = reader.readFeatures(geojson, {
        featureProjection: 'EPSG:3857',
        dataProjection: 'EPSG:4326'
    });
    return features;
}

function addFeaturesToLayer(layer, features) {
    var src = layer.getSource();
    src.clear();
    src.addFeatures(features);
}

var getAllHaritalar = function () {
    $.getJSON('/home/getallharitalar/', null, function (result) {
        kayitlarJson = result;
        console.log("KayıtlarJson : " + JSON.stringify(kayitlarJson));
        $.each(result, function (i, obj) {
            var p = JSON.parse(obj.koordinat);
            //p.id = "Set" + obj.id;
            kayitlar["features"].push(p);
        });
        console.log(kayitlar);
        addFeaturesToLayer(vector, GeoJSONToFeature(kayitlar));
    }, '');
}

getAllHaritalar();


