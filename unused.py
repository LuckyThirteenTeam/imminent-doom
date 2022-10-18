#@app.route("/")
#def index_site():
#    cnx = mysql.connector.connect(user='user', password='password', host='127.0.0.1', database='test')
#    cursor = cnx.cursor()
#    cursor.execute('use test')
#    cursor.execute('select * from t;')
#    l = []
#    for row in cursor:
#        l.append(row)
#    cnx.close()
#
#    with open('index.html', 'r') as f:
#        site = f.read()
#
#    return site + 'Current state of t: ' + toHTML(l, True)

#@app.get("/query")
#def query():
#    back_button = '<br/><a href="/"><button>Go back</button></a>'
#    args = request.args
#    q = args['query']
#    if 'drop' in q.lower():
#        return 'no' + back_button
#    cnx = mysql.connector.connect(user='user', password='password', host='127.0.0.1', database='test')
#    cursor = cnx.cursor()
#    try:
#        cursor.execute(q)
#    except:
#        return 'bad query' + back_button
#    l = []
#    for row in cursor:
#        l.append(row)
#    cnx.close()
#    return toHTML(l) + back_button

"""

cnx = mysql.connector.connect(user='user', password='password', host='127.0.0.1', database='test1')
cursor = cnx.cursor()

cursor.execute('show databases;')
for row in cursor:
    print(row)

cnx.close()

"""
