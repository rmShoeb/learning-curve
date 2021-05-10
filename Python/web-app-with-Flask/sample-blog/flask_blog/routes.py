from flask import render_template, url_for, flash, redirect

from flask_blog import app
from flask_blog.forms import RegistrationForm, LoginForm
from flask_blog.models import User, Post


posts = [
    {
        'author':       'Riyad Morshed',
        'title':        'Hello World!',
        'content':      'Hello World!',
        'date posted':  'May 7, 2021'
    },
    {
        'author':       'John Doe',
        'title':        'Hello World!-2',
        'content':      'Hello World!',
        'date posted':  'May 6, 2021'
    }
]

@app.route('/')
@app.route('/home')
def home():
    return render_template('home.html', posts=posts)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        if form.username.data == 'admin' and form.password.data == 'admin':
            flash(f'Welcome {form.username.data}!', 'success')
            return redirect(url_for('home'))
        else:
            flash(f'Incorrect information!', 'danger')
    return render_template('login.html', title='Login', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        flash(f'Account created for {form.username.data}', 'success')
        return redirect(url_for('home'))
    return render_template('register.html', title='Register', form=form)

@app.route('/about')
def about():
    return render_template('about.html', title='About')