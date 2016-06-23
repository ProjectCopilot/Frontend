#!/usr/bin/env python

from __future__ import print_function

from flask import Flask
from flask import render_template

app = Flask(__name__, static_folder='static', static_url_path='')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    # TODO(ankitr): make this configurable. For now, we'll leave it as debug.
    app.run(debug=True)

