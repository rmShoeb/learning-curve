# templates folder will have the HTML templates that flask will look for
# static folder will have CSS and other kind of files (e.g. images)
import json
from flask import Flask, redirect, request, render_template

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])     # by default, this will work with GET request
def welcome():
    if request.method == 'POST':
        height = float(request.form.get('height'))
        weight = float(request.form.get('weight'))
        bmi = weight/((height/100)**2)
        return render_template('index.html', bmi=bmi)
    else:
        return render_template('index.html')

@app.route('/submit-form', methods=['POST'])     # when defining, only the defined methods will work
def submit_form():
    name = request.form.get('name')
    password = request.form.get('password')
    return redirect('/')

@app.route('/stop-server')
def stop_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()
    return "Shutting down..."

app.run()