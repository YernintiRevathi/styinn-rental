// let mapToken=process.env.MAP_TOKEN; //environmental variables are not accessble in public files
// console.log("mapToken",mapToken);//the mapToken variable is taken from ejs file
//in ejs the first script runs first,takes the env variable
//then ejs code
//then this script runs
//the script access the variables from that ejs file
maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
    container: 'map', // container's id or the HTML element in which the SDK will render the map
    style: maptilersdk.MapStyle.STREETS,
    center: listing.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});
// console.log(coordinates);

const iconElement=document.createElement("div");
iconElement.className="custom-map-icon";
iconElement.innerHTML='<i class="fa-solid fa-location-crosshairs"></i>';

const marker = new maptilersdk.Marker({
        element:iconElement,
        anchor:"bottom",
    })
    .setLngLat(listing.geometry.coordinates) //listing.geometry.coordinates
    .setPopup(new maptilersdk.Popup({ 
        offset: 25, // Prevents the popup from overlapping your custom icon tip
        closeButton: false
        })
        .setHTML(`
            <div class="map-popup-content">
                <h4 class="text-muted small mb-0">${listing.title}</h4>
                <p class="text-secondary small mb-0">Exact location provided after booking</p>
            </div>
    `))
    .addTo(map);

//we can add any no. of markers by creating multiple individual marksers like above

document.querySelector(".map-mode").addEventListener("change",(e)=>{
    // console.log("map mode event",e.target.value);
    const style=e.target.value||"STREETS";
    const styleMap={
        "STREETS":maptilersdk.MapStyle.STREETS,
        "STREETS.DARK":maptilersdk.MapStyle.STREETS.DARK
    }
    const selectedStyle=styleMap[style]||maptilersdk.MapStyle.STREETS;
    map.setStyle(selectedStyle);  
    
});