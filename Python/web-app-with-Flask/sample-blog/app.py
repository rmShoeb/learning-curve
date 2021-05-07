from flask import Flask, render_template

app = Flask(__name__)

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
def hello():
    return render_template('home.html', posts=posts)

@app.route('/about')
def about():
    return render_template('about.html', title='About')

if __name__=='__main__':
    app.run(debug=True)