from flask import Blueprint, Flask

from main.index import main_bp
from terms.word import terms_bp

app = Flask(__name__)

# 파일 이름이 index.py이므로
app.register_blueprint(main_bp, url_prefix='/main')
app.register_blueprint(terms_bp, url_prefix='/terms')

if __name__ == "__main__":
   app.run(debug=True)

@app.errorhandler(404)
def page_not_found(error):
    return "<h1>404 Error</h1>", 404

