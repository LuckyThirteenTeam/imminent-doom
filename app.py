import mysql.connector
from flask import Flask, request

app = Flask(__name__)

@app.route("/")
def index_site():
    with open('index.html', 'r') as f:
        site = f.read()

    return site

@app.get("/query")
def query():
    args = request.args
    print(args)
    q = args['query']
    if 'drop' in q.lower():
        return 'no'
    cnx = mysql.connector.connect(user='user', password='password', host='127.0.0.1', database='sample')
    cursor = cnx.cursor()
    try:
        cursor.execute(q)
    except:
        return '[]'

    l = []
    for row in cursor:
        l.append(row)
    cnx.close()
    return l

@app.get("/nearby-stations")
def nearby_stations():
    args = request.args
    lat = args['lat']
    lng = args['lng']
    cnx = mysql.connector.connect(user='user', password='password', host='127.0.0.1', database='production')
    cursor = cnx.cursor()
    try:
        cursor.execute("""
            CREATE FUNCTION `haversine` (lat1 FLOAT, lng1 FLOAT, lat2 FLOAT, lng2 FLOAT) RETURNS FLOAT
            BEGIN
                DECLARE R INT;
                DECLARE dLat DECIMAL(30,15);
                DECLARE dLng DECIMAL(30,15);
                DECLARE a1 DECIMAL(30,15);
                DECLARE a2 DECIMAL(30,15);
                DECLARE a DECIMAL(30,15);
                DECLARE c DECIMAL(30,15);
                DECLARE d DECIMAL(30,15);
            
                SET R = 3959; -- Earth's radius in miles
                SET dLat = RADIANS( lat2 ) - RADIANS( lat1 );
                SET dLng = RADIANS( lng2 ) - RADIANS( lng1 );
                SET a1 = SIN( dLat / 2 ) * SIN( dLat / 2 );
                SET a2 = SIN( dLng / 2 ) * SIN( dLng / 2 ) * COS( RADIANS( lng1 )) * COS( RADIANS( lat2 ) );
                SET a = a1 + a2;
                SET c = 2 * ATAN2( SQRT( a ), SQRT( 1 - a ) );
                SET d = R * c;
                RETURN d;
            END

            SELECT locationId, latitude, longitude, haversine(latitude, %s, longitude, %s) AS distance FROM Location
            WHERE haversine(latitude, %s, longitude, %s) IS NOT NULL
            ORDER BY distance ASC
            LIMIT 10;""", (lat, lng, lat, lng))
    except Exception as e:
        return '[[%s]]' % str(e)

    l = []
    for row in cursor:
        l.append(row)
    cnx.close()
    return l
