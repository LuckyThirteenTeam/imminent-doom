================
  Installation
================

These instructions are written for Ubuntu but should work fine with any Linux/Mac computer.

1. Install MySql
	a. For Ubuntu: sudo apt-get install mysql-server
	b. If your machine has very little RAM (< 1GB) and the post-installation setup fails, try increasing your swap space.
2. Install pip3
	a. For Ubuntu: sudo apt-get install python3-pip
3. Install the Python connector for MySql
	a. Switch to a non-root user
	b. pip3 install mysql-connector-python
4. Set up database user and sample table in MySql
	a. Start mysql as root
	b. CREATE USER 'user'@'127.0.0.1' IDENTIFIED BY 'password';
	c. GRANT ALL PRIVILEGES ON *.* TO 'user'@'127.0.0.1' WITH GRANT OPTION;
	d. CREATE DATABASE test;
	e. USE test;
	f. CREATE TABLE t (a INTEGER, b INTEGER);
	g. INSERT INTO t VALUES (1, 2), (3, 4), (5, 6), (7, 8)
5. Install Flask
	a. Switch to a non-root user
	b. pip3 install Flask

===============
    Running    
===============
1. Make sure you are in the folder with app.py and index.html
2. flask --app app run
3. If on a remote server with an IP address, run
	flask --app app run -h [ip address]
4. The program runs by deault on port 5000

================
      Demo    
================
1. Go to http://143.198.181.16:5000/
