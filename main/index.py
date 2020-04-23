from flask import Blueprint, request, render_template, Flask, flash, redirect, url_for, session
from flask import current_app as app
from datetime import datetime
import re
from module import dbModule

main_bp = Blueprint('index', __name__, url_prefix='/main')

db_class = dbModule.Database()

@main_bp.route('/', methods=['GET', 'POST'])
def login():
    msg = ''
    # Check if "username" and "password" POST requests exist (user submitted form)
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
        # Create variables for easy access
        username = request.form['username']
        password = request.form['password']

        print("#1-1 USER_ID: ", username, ", PASSWD: ", password) 
        # Check if account_id exists using MySQL
        try:
            sql = "SELECT USER_ID, password('%s') as D_PWD, PWD, NAME FROM TB_USER WHERE user_id = '%s'"%(password, username)
            row = db_class.executeOne(sql)
        except Exception as e:
            print(e)

        # If account_id exists in account_ids table in out database
        #print("#2-1 USER_ID>>>: ", row['USER_ID'], ", D_PASSORD >>> : " , row['D_PWD'], ", ORGI_PASS >>>:", row['PWD'])
        #print("#2-1 ", row)
        if row['USER_ID'] == username and row['PWD'] == row['D_PWD']:
            # Create session data, we can access this data in other routes
            session['loggedin'] = True
            session['user_id'] = row['USER_ID']
            session['username'] = row['NAME']
            # Redirect to home page
            print("#3-1 Redirect to terms_list page ")
            return render_template('terms/list.html', username=session['username'])
            #return render_template('terms/test.html')
            #return 'Logged in successfully!'
        else:
            # account_id doesnt exist or username/password incorrect
            msg = 'Incorrect username/password!'
    # Show the login form with message (if any)
    return render_template('index.html', msg=msg)

@main_bp.route('/logout',methods=['GET', 'POST'])
def logout():
    # Remove session data, this will log the user out
    session.pop('loggedin', None)
    session.pop('id', None)
    session.pop('username', None)

    # Redirect to login page
    print("#3 : Redirect to login page")
    return redirect(url_for('login'))

@main_bp.route('/register',methods=['GET', 'POST'])
def register():
    # Output message if something goes wrong...
    msg = ''
    # Check if "username", "password" and "email" POST requests exist (user submitted form)
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form and 'email' in request.form:
        # Create variables for easy access
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
    elif request.method == 'POST':
        # Form is empty... (no POST data)
        msg = 'Please fill out the form!'
    # Show registration form with message (if any)
    return render_template('/main/register.html', msg=msg)

@main_bp.route('/home')
def home():
    # Check if user is loggedin
    if 'loggedin' in session:
        # User is loggedin show them the home page
        return render_template('/main/home.html')
    # User is not loggedin redirect to login page
    return redirect(url_for('index.login'))

@main_bp.route('/about')
def about():
    # Check if user is loggedin
    if 'loggedin' in session:
        # We need all the account info for the user so we can display it on the profile page
        # Check if account_id exists using MySQL
        try:
            sql = "SELECT * FROM TB_USER WHERE user_id = '%s'" %session['user_id']
            row = db_class.executeOne(sql)
        except Exception as e:
            print(e)
        # Show the profile page with account info
        return render_template('/main/about.html', account=row)
    # User is not loggedin redirect to login page
    return redirect(url_for('index.login'))

