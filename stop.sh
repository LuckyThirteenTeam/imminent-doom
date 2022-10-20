#!/bin/bash
ps aux | grep flask | grep 'app app' | awk '{print $2}' | xargs kill -9
