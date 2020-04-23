from __init__ import app

print("#### wsgi _start ####")

if __name__ == "__main__":
    #app.secret_key = 'hyunkai'
    #app.config['SESSION_TYPE'] = 'memcached'
    #app.run(debug=True)
    app.debug = True


