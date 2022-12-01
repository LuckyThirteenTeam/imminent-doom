--- Feature 1 
SELECT country, Weather.locationId, maxTemp
FROM Weather 
JOIN Location 
ON Weather.locationId = Location.locationId 
WHERE date = "2022-10-16" and maxTemp != 9999.9
ORDER BY maxTemp DESC
LIMIT 5;

SELECT country, Weather.locationId, minTemp
FROM Weather 
JOIN Location 
ON Weather.locationId = Location.locationId 
WHERE date = "2022-10-16" and maxTemp != 9999.9
ORDER BY minTemp ASC 
LIMIT 5;

--- Feature 2
DELIMITER $$
CREATE FUNCTION `haversine` (lat1 FLOAT, lat2 FLOAT, lng1 FLOAT, lng2 FLOAT) RETURNS FLOAT
BEGIN
    DECLARE R INT;
    DECLARE dLat DECIMAL(30,15);
    DECLARE dLng DECIMAL(30,15);
    DECLARE a1 DECIMAL(30,15);
    DECLARE a2 DECIMAL(30,15);
    DECLARE a DECIMAL(30,15);
    DECLARE c DECIMAL(30,15);
    DECLARE d DECIMAL(30,15);

    SET R = 6371; -- Earth's radius in km
    SET dLat = lat2 - lat1;
    SET dLng = lng2 - lng1;
    SET a1 = SIN( dLat / 2 ) * SIN( dLat / 2 );
    SET a2 = SIN( dLng / 2 ) * SIN( dLng / 2 ) * COS( lat1 ) * COS( lat2 );
    SET a = a1 + a2;
    SET c = 2 * ASIN( SQRT( a ) );
    SET d = R * c;
    RETURN d;
END $$
DELIMITER ;

SELECT locationId, latitude, longitude, haversine(latitude, 32.0, longitude, 32.0) AS distance FROM Location
WHERE haversine(latitude, 32.0, longitude, -87.0) IS NOT NULL
ORDER BY distance ASC
LIMIT 10;

--- Feature 3
SELECT w.locationId, w.meanTemp, AvgTemps.avgTemp, ABS(w.meanTemp - AvgTemps.avgTemp) AS diffTemps
FROM (
SELECT sum(meanTemp)/count(meanTemp) as avgTemp, locationId
FROM Weather
WHERE date LIKE '%01-03' and meanTemp != 9999.9
GROUP BY locationId
) as AvgTemps
JOIN Weather as w ON w.locationId = AvgTemps.locationId
WHERE date = '2022-01-03' and w.meanTemp != 9999.9
ORDER BY diffTemps DESC limit 10;

--- Feature 4
INSERT INTO SavedLocation VALUES ("user", "71956199999");
SELECT * FROM SavedLocation;

--- Feature 5
SELECT *
FROM Weather NATURAL JOIN Location
WHERE locationId = "71040099999"
ORDER BY date ASC
LIMIT 10;

--- Feature 6
DELETE FROM SavedLocation
WHERE username = "user" AND locationId = "71956199999";
SELECT * FROM SavedLocation;

-- Fancy Feature 5
CREATE INDEX LocationIndex ON Weather(locationId);