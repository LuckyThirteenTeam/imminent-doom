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

