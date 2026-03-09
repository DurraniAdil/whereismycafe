import L from 'leaflet';

export const defaultIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width: 32px; height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 3px 5px rgba(0,0,0,0.3));
      transition: all 0.3s ease;
    ">
      <img src="${import.meta.env.BASE_URL}media/map-pin.png" alt="pin" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export const blurredIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width: 24px; height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 2px 3px rgba(0,0,0,0.2)) blur(1px);
      opacity: 0.45;
      transition: all 0.3s ease;
    ">
      <img src="${import.meta.env.BASE_URL}media/map-pin.png" alt="pin" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 24],
  popupAnchor: [0, -24],
});

export const activeIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width: 64px; height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      filter: drop-shadow(0 4px 16px rgba(11,78,157,0.6));
      transform: translateY(-8px);
      transition: all 0.3s ease;
      z-index: 1000;
    ">
      <img src="${import.meta.env.BASE_URL}media/map-pin.png" alt="pin" style="width: 100%; height: 100%; object-fit: contain;" />
    </div>
  `,
  iconSize: [64, 64],
  iconAnchor: [32, 64],
  popupAnchor: [0, -64],
});
