from flask import Blueprint, request, render_template, Flask, flash, redirect, url_for, session, Response, jsonify
from datetime import datetime
import re, json
#from math import ceil
from module import dbModule
from flask_paginate import Pagination, get_page_parameter

if __name__ == "__main__":
    app.debug = True

terms_bp = Blueprint('terms_bp', __name__, url_prefix='/terms')

db_class = dbModule.Database()

@terms_bp.route('/list', methods=['GET','POST'])
def list():
    print("#### terms list init ####")
    str_url = request.referrer
    print("str_url : ", str_url)
    page = request.args.get(get_page_parameter(), type=int, default=1)
   
    # if request.method == 'GET' and 'searchKey' in request.form and 'searchValue' in request.form:
    # Create variables for easy access
    #serchKey = request.form['searchKey']
    #searchValue = request.form['searchValue']
    searchKey = request.form.get('searchKey')
    searchValue = request.form.get('searchValue')    

    print("#1-1 searchKey: ", searchKey, ", searchValue: ", searchValue)
    # Check if serach dataset / totalRowCount
    try:
        if searchKey == 'all' or searchKey == None:
            sql = "SELECT WF.KORNM, WF.ENG_ABRV, WFD.ENG_MEAN, WF.WRD_TY, WFD.DESCR, WFD.SYNONYM FROM TB_WRD_FOAFT WF, TB_WRD_FOAFT_DETL WFD WHERE WF.WRD_ID = WFD.WRD_ID AND WF.KORNM"
            totalRowCount = db_class.executeRowCount(sql)
            words = db_class.executeAll(sql)            
        elif searchKey == 'korNm':
            sql = "SELECT WF.KORNM, WF.ENG_ABRV, WFD.ENG_MEAN, WF.WRD_TY, WFD.DESCR, WFD.SYNONYM FROM TB_WRD_FOAFT WF, TB_WRD_FOAFT_DETL WFD WHERE WF.WRD_ID = WFD.WRD_ID AND WF.KORNM LIKE '%s'||'%'"%(searchValue)
            totalRowCount = db_class.executeRowCount(sql)
            words = db_class.executeAll(sql)
        elif searchKey == 'engAbrv':
            sql = "SELECT WF.KORNM, WF.ENG_ABRV, WFD.ENG_MEAN, WF.WRD_TY, WFD.DESCR, WFD.SYNONYM cnt FROM TB_WRD_FOAFT WF, TB_WRD_FOAFT_DETL WFD WHERE WF.WRD_ID = WFD.WRD_ID AND WF.ENG_ABRV LIKE '%s'||'%'"%(searchValue)
            totalRowCount = db_class.executeRowCount(sql)
            words = db_class.executeAll(sql)
    except Exception as e:
        print(e)

    print("#2-1 totalRowCount>>> : ", totalRowCount)
    total_rows = totalRowCount
    pagination = Pagination(page=page, total=totalRowCount, search=search, record_name='words')
    
    for index in range(0,words):
        dic_data ={}
        #dic_data["no"]=str(index)
        dic_data["KORNM"] = dataset[index]
        dic_data["ENG_ABRV"] = dataset[index]
        dic_data["ENG_MEAN"] = dataset[index]
        dic_data["WRD_TY"] = dataset[index]
        dic_data["SYNONYM"] = dataset[index]
        dic_data["DESCR"] = dataset[index]
        row_array.append(dic_data)
    context={
        "page":page,
        "pagination":pagination,
        "total":totalRowCount,
        "records":str(words),
        "words":row_array
    }
    
    return Response(json.dumps(context), mimetype='application/json')
    
@terms_bp.route('/register', methods=['GET', 'POST'])
def register():
    print("#### terms register init ####")

    return render_template('terms/register.html')

