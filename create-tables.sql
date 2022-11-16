CREATE TABLE User (username VARCHAR(20) NOT NULL PRIMARY KEY, password VARCHAR(20) NOT NULL);

CREATE TABLE Location (locationId VARCHAR(11) NOT NULL PRIMARY KEY, country VARCHAR(30) NOT NULL, latitude DECIMAL(6, 4) NOT NULL, longitude DECIMAL(7, 4) NOT NULL);

CREATE TABLE Weather (date DATE NOT NULL, locationId VARCHAR(11) NOT NULL, meanTemp DECIMAL(3, 1) NOT NULL, stationLevelPressure DECIMAL(4, 1), precipitation DECIMAL(3, 2), visibility DECIMAL(3, 1), windSpeed DECIMAL(3, 1), minTemp DECIMAL(3, 1), maxTemp DECIMAL(3, 1), PRIMARY KEY(date, locationId), FOREIGN KEY(locationId) REFERENCES Location(locationId));

CREATE TABLE SavedLocation(username VARCHAR(20) NOT NULL, locationId VARCHAR(11) NOT NULL, PRIMARY KEY(username, locationId), FOREIGN KEY (username) REFERENCES User(username), FOREIGN KEY (locationId) REFERENCES Location(locationId));

