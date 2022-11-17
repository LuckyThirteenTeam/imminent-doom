SELECT country, Weather.locationId, maxTemp
FROM Weather 
JOIN Location 
ON Weather.locationId = Location.locationId 
WHERE date = "2022-10-16"
ORDER BY maxTemp DESC 
LIMIT 5;

SELECT country, Weather.locationId, minTemp
FROM Weather 
JOIN Location 
ON Weather.locationId = Location.locationId 
WHERE date = "2022-10-16"
ORDER BY minTemp ASC 
LIMIT 5;

SELECT country, Weather.locationId, maxTemp FROM Weather JOIN Location ON Weather.locationId = Location.locationId WHERE date = "2022-10-16" ORDER BY maxTemp DESC LIMIT 5;

SELECT country, Weather.locationId, minTemp FROM Weather JOIN Location ON Weather.locationId = Location.locationId WHERE date = "2022-10-16" ORDER BY minTemp ASC LIMIT 5;

SELECT locationId, latitude, longitude 
FROM Location
WHERE latitude >= (48.0 - 1) AND latitude <= (48.0 + 1) AND longitude >= (-71.0 - 1) AND longitude <= (-71.0 + 1);

SELECT w.locationId, w.meanTemp, AvgTemps.avgTemp, ABS(w.meanTemp - AvgTemps.avgTemp) AS diffTemps
FROM (
SELECT sum(meanTemp)/count(*) as avgTemp, locationId
FROM Weather
WHERE date LIKE "%01-03"
GROUP BY locationId
) as AvgTemps
JOIN Weather as w ON w.locationId = AvgTemps.locationId
WHERE date = "2022-01-03"
ORDER BY diffTemps DESC;

INSERT INTO SavedLocation VALUES ("user", 7247099999);
SELECT * FROM SavedLocation;

SELECT *
FROM Weather NATURAL JOIN Location
WHERE locationId = 71040099999
ORDER BY date ASC;

DELETE FROM SavedLocation
WHERE username = "user" AND locationId = 71039099999;
SELECT * FROM SavedLocation;