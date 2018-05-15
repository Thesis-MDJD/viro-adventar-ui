export default (lat1, lat2, lon1, lon2) => {
  var R = 6371 * 1000; // Radius of the earth in m

  var dLat = (lat2-lat1) * Math.PI / 180;  // Javascript functions in radians
  var dLon = (lon2-lon1) * Math.PI / 180;
  
  lat1 = lat1 * Math.PI / 180;
  lat2 = lat2 * Math.PI / 180;
  lon1 = lon1 * Math.PI / 180;
  lon2 = lon2 * Math.PI / 180;
  
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1) * Math.cos(lat2) *
          Math.sin(dLon/2) * Math.sin(dLon/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in m

  var y = Math.sin(lon2-lon1) * Math.cos(lat2);
  var x = Math.cos(lat1)*Math.sin(lat2) -
          Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
  var brng = Math.atan2(y, x);
  
  return {degrees: ((brng * 180 / Math.PI) + 360) % 360, distance: d};
}