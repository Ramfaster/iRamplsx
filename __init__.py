from flask import Blueprint, Flask
from main.index import main_bp
from terms.word import terms_bp

app = Flask(__name__)
app.secret_key = 'hyunkai'

# main look like 
app.register_blueprint(main_bp, url_prefix='/')
# terms look like
app.register_blueprint(terms_bp, url_prefix='/terms')

print("#### __init__start ####")

#if __name__ == "__main__":
    #app.secret_key = 'hyunkai'
    #app.config['SESSION_TYPE'] = 'memcached'
    #app.run(debug=True)
#    app.debug = True
