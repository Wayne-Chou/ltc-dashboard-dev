// initMap.js
function initMap() {
  class LabelOverlay extends google.maps.OverlayView {
    constructor(position, text, map) {
      super();
      this.position = position;
      this.text = text;
      this.map = map;
      this.div = null;
      this.setMap(map);
    }

    onAdd() {
      this.div = document.createElement("div");
      this.div.style.position = "absolute";
      this.div.style.background = "rgba(255,255,255,0.9)";
      this.div.style.padding = "4px 8px";
      this.div.style.border = "1px solid #333";
      this.div.style.borderRadius = "4px";
      this.div.style.fontSize = "14px";
      this.div.style.fontWeight = "bold";
      this.div.style.whiteSpace = "nowrap";
      this.div.innerHTML = this.text;
      const panes = this.getPanes();
      panes.overlayLayer.appendChild(this.div);
    }

    draw() {
      const overlayProjection = this.getProjection();
      const pos = overlayProjection.fromLatLngToDivPixel(this.position);
      if (this.div) {
        this.div.style.left = pos.x + "px";
        this.div.style.top = pos.y - 30 + "px";
      }
    }

    onRemove() {
      if (this.div) {
        this.div.parentNode.removeChild(this.div);
        this.div = null;
      }
    }
  }

  const mapElement = document.getElementById("map");
  if (!mapElement) return;

  const map = new google.maps.Map(mapElement, {
    zoom: 12,
    center: { lat: 25.038, lng: 121.5645 },
    mapTypeControl: false,
  });

  // 用快取的 locationMap 畫 marker 和 Label
  const bounds = new google.maps.LatLngBounds();
  Object.values(locationMap).forEach((loc) => {
    const position = new google.maps.LatLng(loc.lat, loc.lng);

    // Marker
    new google.maps.Marker({
      position: position,
      map: map,
      title: loc.name,
    });

    // LabelOverlay
    const labelText = `<div style="text-align:center">${loc.name}<br>${t(
      "assessedCount",
    )} <span style="color:red">${loc.Count}</span></div>`;
    new LabelOverlay(position, labelText, map);

    bounds.extend(position);
  });

  if (Object.keys(locationMap).length > 0) {
    map.fitBounds(bounds);
  }
}

window.initMap = initMap;
