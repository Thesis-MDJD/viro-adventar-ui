export default (lat1, lat2, lon1, lon2) => {
  const R = 6371 * 1000; // Radius of the earth in m

  const dLat = (lat2 - lat1) * Math.PI / 180; // Javascript functions in radians
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  lat1 = lat1 * Math.PI / 180;
  lat2 = lat2 * Math.PI / 180;
  lon1 = lon1 * Math.PI / 180;
  lon2 = lon2 * Math.PI / 180;

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(lat1) * Math.cos(lat2) *
          Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in m

  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) -
          Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  const brng = Math.atan2(y, x);
  
  return {degrees: ((brng * 180 / Math.PI) + 360) % 360, distance: d};
};