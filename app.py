import mysql.connector
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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
    print(args)
    q = args['query']
    if 'drop' in q.lower():
        return 'no'
    cnx = mysql.connector.connect(user='user', password='password', host='127.0.0.1', database='sample')
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

