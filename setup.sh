#!/bin/bash
echo 'Installing dependencies'
sleep 1
sudo apt-get install mysql-server
sudo apt-get install python3-pip
sudo apt-get install nginx

echo 'Installing Python dependencies'
sleep 1
pip3 install mysql-connector-python
pip3 install Flask

echo 'Setting up database'
sleep 1
sudo mysql < setup.sql

echo 'Done setting up'
