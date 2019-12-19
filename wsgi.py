from __init__ import app

app.secret_key = 'hyunkai'

if __name__ == "__main__":
    #app.secret_key = 'hyunkai'
    #app.config['SESSION_TYPE'] = 'memcached'
    app.run(debug=True)
