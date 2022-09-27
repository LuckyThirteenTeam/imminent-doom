import mysql.connector
from flask import Flask, request

app = Flask(__name__)

def toHTML(table, includeCols=False):
    s = ""
    for row in table:
        r = ''
        for col in row:
            r += '<td>' + str(col) + '</td>'
        s += '<tr>' + r + '</tr>'
    stylesheet = '<style>td{ border: 1px solid black; padding: 10px; } thead td { font-weight: bold; }</style>'
    head = '<table><thead><tr><td>a</td><td>b</td></tr></head><tbody>'
    if includeCols:
        stylesheet += head
    else:
        stylesheet += '<table><tbody>'
    return stylesheet + s + '</tbody></table>'

@app.route("/")
def index_site():
    cnx = mysql.connector.connect(user='user', password='password', host='127.0.0.1', database='test')
    cursor = cnx.cursor()
    cursor.execute('use test')
    cursor.execute('select * from t;')
    l = []
    for row in cursor:
        l.append(row)
    cnx.close()

    with open('index.html', 'r') as f:
        site = f.read()

    return site + 'Current state of t: ' + toHTML(l, True)

@app.get("/query")
def query():
    back_button = '<br/><a href="/"><button>Go back</button></a>'
    args = request.args
    q = args['query']
    if 'drop' in q.lower():
        return 'no' + back_button
    cnx = mysql.connector.connect(user='user', password='password', host='127.0.0.1', database='test')
    cursor = cnx.cursor()
    try:
        cursor.execute(q)
    except:
        return 'bad query' + back_button
    l = []
    for row in cursor:
        l.append(row)
    cnx.close()
    return toHTML(l) + back_button

@app.get("/reset")
def reset():
    cnx = mysql.connector.connect(user='user', password='password', host='127.0.0.1', database='test')
    cursor = cnx.cursor()
    cursor.execute('drop table if exists t;')
    cursor.execute('create table t (a integer, b integer);')
    cursor.execute('insert into t (a, b) values (1, 2), (3, 4), (5, 6), (7, 8);')
    cnx.close()
    back_button = '<br/><a href="/"><button>Go back</button></a>'
    return "Table has been reset" + back_button
    
"""

cnx = mysql.connector.connect(user='user', password='password', host='127.0.0.1', database='test1')
cursor = cnx.cursor()

cursor.execute('show databases;')
for row in cursor:
    print(row)

cnx.close()

"""
