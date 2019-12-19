"""
The flask application package.
"""

from flask import Blueprint, Flask
from index import main_blueprint
from terms import terms_blueprint

app = Flask(__name__)

if __name__ == "__main__":
   app.run(debug=True)


# 파일 이름이 index.py이므로
app.register_blueprint(main_blueprint)

app.register_blueprint(terms_blueprint)

@app.errorhandler(404)
def page_not_found(error):
    return "<h1>404 Error</h1>", 404

