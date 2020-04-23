from flask import Blueprint, request, render_template, Flask, flash, redirect, url_for, session
from flask import current_app as app
from datetime import datetime
import re
from module import dbModule

terms_blueprint = Blueprint('terms', __name__, url_prefix='/')

db_class = dbModule.Database()

@terms_blueprint.route('/list', method=['POST'])
def list():
    print("#### terms list init ####")
    str_url = reqeust.META.get('HTTP_REFERER')
    strs = re.findall('list/(\w+)', str_url)
    num = reqeust.GET['rows']
    s_page = 0
    page = 0
    if len(strs) > 0:
        page = int(strs[0])
    else:
        page = 1
 
    if page > 1:
        s_page = page - 1
    n_page = page
    
    
    if request.method == 'POST' and 'searchKey' in request.form and 'searchValue' in request.form:
        # Create variables for easy access
        searchKey = request.form['searchKey']
        searchValue = request.form['searchValue']

        print("#1-1 searchKey: ", searchKey, ", searchValue: ", searchValue)
        # Check if serach totalRowCount
        try:
            if searchKey == 'all':
                sql = "SELECT count(*) cnt FROM TB_WRD_FOAFT WF, TB_WRD_FOAFT_DETL WFD WHERE WF.WRD_ID = WFD.WRD_ID AND WF.KORNM"
                totalRowCount = db_class.executeOne(sql)
            elif searchKey == 'korNm':
                sql = "SELECT count(*) cnt FROM TB_WRD_FOAFT WF, TB_WRD_FOAFT_DETL WFD WHERE WF.WRD_ID = WFD.WRD_ID AND WF.KORNM LIKE '%s'||'%'"%(searchValue)
                totalRowCount = db_class.executeOne(sql)
            elif searchKey == 'engAbrv': 
                sql = "SELECT count(*) cnt FROM TB_WRD_FOAFT WF, TB_WRD_FOAFT_DETL WFD WHERE WF.WRD_ID = WFD.WRD_ID AND WF.ENG_ABRV LIKE '%s'||'%'"%(searchValue)
                totalRowCount = db_class.executeOne(sql)
        except Exception as e:
            print(e)
            
        print("#2-1 totalRowCount>>>: ", row['cnt'])
        print("#2-1 Redirect to terms_list page ")
    return render_template('terms/list.html')

