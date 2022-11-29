import mysql.connector
from flask import Flask, request, session
from flask_cors import CORS
from random import randint
from hashlib import sha256

app = Flask(__name__)
CORS(app)

f = open('.secret_key')
secret_key = f.read().strip()
f.close()
app.secret_key = secret_key

@app.route("/")
def index_site():
    with open('index.html', 'r') as f:
        site = f.read()

    return site

@app.route("/sample")
def sample():
    with open('sample_backup.sql', 'r') as f:
        site = f.read()

    return site

@app.get("/query")
def query():
    args = request.args
    q = args['query']
    if 'drop' in q.lower():
        return 'no'

    print('Query:')
    print(q)
    print()

    cnx = mysql.connector.connect(user='user', password='password', host='127.0.0.1', database='production')
    cursor = cnx.cursor()
    try:
        cursor.execute(q)
    except Exception as e:
        return '[[%s]]' % str(e)

    l = []
    for row in cursor:
        l.append(row)
    cnx.close()
    return l

def generate_salt():
    s = ''
    valid_chars = list(range(65, 91)) + list(range(48, 58)) + list(range(97, 123))
    n = len(valid_chars)
    for i in range(32):
        s += chr(valid_chars[randint(0, n - 1)])
    return s

def read_pepper():
    f = open('.pepper')
    pepper = f.read().strip()
    f.close()
    return pepper

@app.post("/signup")
def signup():
    args = request.args
    if 'username' not in args:
        return 'Username Required', 400
    if 'password' not in args:
        return 'Password Required', 400

    username = args['username']
    password = args['password']

    cnx = mysql.connector.connect(user='user', password='password', host='127.0.0.1', database='production')
    cursor = cnx.cursor()

    try:
        cursor.execute('SELECT 1 FROM User WHERE username = %s', [username])
    except Exception as e:
        return '[[%s]]' % str(e)

    l = []
    for row in cursor:
        l.append(row)
    if len(l) > 0:
        return 'User Already Exists', 401

    salt = generate_salt()
    pepper = read_pepper()
    hashed = sha256((password + salt + pepper).encode()).hexdigest()

    try:
        cursor.execute('INSERT INTO User VALUES (%s, %s, %s)', [username, hashed, salt])
        cnx.commit()
    except Exception as e:
        return '[[%s]]' % str(e)

    cnx.close()
    return 'Signed Up'


@app.post("/login")
def login():
    args = request.args
    if 'username' not in args:
        return 'Username Required', 400
    if 'password' not in args:
        return 'Password Required', 400
    username = args['username']
    password = args['password']

    cnx = mysql.connector.connect(user='user', password='password', host='127.0.0.1', database='production')
    cursor = cnx.cursor()

    try:
        cursor.execute('SELECT salt FROM User WHERE username = %s', [username])
    except Exception as e:
        return '[[%s]]' % str(e)

    l = []
    for row in cursor:
        l.append(row)
    if len(l) != 1:
        return 'User Not Found', 401
    salt = l[0][0]
    pepper = read_pepper()

    hashed = sha256((password + salt + pepper).encode()).hexdigest()

    try:
        cursor.execute('SELECT 1 FROM User WHERE username = %s AND password = %s', [username, hashed])
    except Exception as e:
        return '[[%s]]' % str(e)

    l = []
    for row in cursor:
        l.append(row)
    if len(l) != 1:
        return 'Incorrect Password', 401

    cnx.close()
    session['username'] = username
    return 'Logged In'

@app.get("/username")
def is_logged_in():
    if 'username' in session:
        return session['username']
    return ''

@app.post("/logout")
def logout():
    if 'username' in session:
        session.pop('username')
    return 'Logged out'

@app.get("/saved_locations")
def saved_locations():
    if 'username' not in session:
        return 'Not Logged In', 401
    username = session['username']

    cnx = mysql.connector.connect(user='user', password='password', host='127.0.0.1', database='production')
    cursor = cnx.cursor()
    try:
        cursor.execute('SELECT locationId FROM SavedLocation WHERE username = %s', [username])
    except Exception as e:
        return '[[%s]]' % str(e)

    l = []
    for row in cursor:
        l.append(row)
    cnx.close()
    return l

@app.post("/save_location")
def save_location():
    args = request.args
    if 'username' not in session:
        return 'Not Logged In', 401
    if 'locationId' not in args:
        return 'Location ID Required', 400
    username = session['username']
    locid = args['locationId']

    cnx = mysql.connector.connect(user='user', password='password', host='127.0.0.1', database='production')
    cursor = cnx.cursor()
    try:
        cursor.execute('INSERT INTO SavedLocation VALUES (%s, %s)', [username, locid])
        cnx.commit()
    except Exception as e:
        return '[[%s]]' % str(e)
    
    return 'Success'

@app.post("/delete_saved_location")
def delete_saved_location():
    args = request.args
    if 'username' not in session:
        return 'Not Logged In', 401
    if 'locationId' not in args:
        return 'Location ID Required', 400
    username = session['username']
    locid = args['locationId']

    cnx = mysql.connector.connect(user='user', password='password', host='127.0.0.1', database='production')
    cursor = cnx.cursor()
    try:
        cursor.execute('DELETE FROM SavedLocation WHERE username = %s AND locationId = %s', [username, locid])
        cnx.commit()
    except Exception as e:
        return '[[%s]]' % str(e)
    
    return 'Success'

