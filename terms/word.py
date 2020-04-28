from flask import Blueprint, request, render_template, Flask, flash, redirect, url_for, session, Response, jsonify
from datetime import datetime
from collections import OrderedDict
import re, json
from module import dbModule
from flask_paginate import Pagination, get_page_parameter

if __name__ == "__main__":
    app.debug = True

terms_bp = Blueprint('terms_bp', __name__, url_prefix='/terms')

db_class = dbModule.Database()

@terms_bp.route('/list_page', methods=['GET','POST'])
def list_page():
    print("#### terms list_page init ####")
    return render_template('terms/list.html')

@terms_bp.route('/list', methods=['GET','POST'])
def list():
    print("#### terms list Ajax ####")
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
            print("#1-1 all #")
            sql = "SELECT WF.KORNM, WF.ENG_ABRV, WFD.ENG_MEAN, WF.WRD_TY, WFD.DESCR, WFD.SYNONYM FROM TB_WRD_FOAFT WF, TB_WRD_FOAFT_DETL WFD WHERE WF.WRD_ID = WFD.WRD_ID AND WF.KORNM"
            totalRowCount = db_class.executeRowCount(sql)
            words = db_class.executeAll(sql)            
        elif searchKey == 'korNm':
            print("#1-2 korNm #")
            sql = "SELECT WF.KORNM, WF.ENG_ABRV, WFD.ENG_MEAN, WF.WRD_TY, WFD.DESCR, WFD.SYNONYM FROM TB_WRD_FOAFT WF, TB_WRD_FOAFT_DETL WFD WHERE WF.WRD_ID = WFD.WRD_ID AND WF.KORNM LIKE '%s'||'%'"%(searchValue)
            totalRowCount = db_class.executeRowCount(sql)
            words = db_class.executeAll(sql)
        elif searchKey == 'engAbrv':
            print("#1-1 engAbrv #")
            sql = "SELECT WF.KORNM, WF.ENG_ABRV, WFD.ENG_MEAN, WF.WRD_TY, WFD.DESCR, WFD.SYNONYM FROM TB_WRD_FOAFT WF, TB_WRD_FOAFT_DETL WFD WHERE WF.WRD_ID = WFD.WRD_ID AND WF.ENG_ABRV LIKE '%s'||'%'"%(searchValue)
            totalRowCount = db_class.executeRowCount(sql)
            words = db_class.executeAll(sql)
    except Exception as e:
        print(e)

    print("#2-1 totalRowCount>>> : ", totalRowCount)
    total_rows = totalRowCount
    pagination = Pagination(page=page, total=totalRowCount, search=searchKey, record_name='words')
    print("#2-2 pagination>>> : ", pagination)
    
    dic_data = []
    for row in words:
        d = OrderedDict()
        d['korNm']  = row["KORNM"]
        d['engAbrv']  = row["ENG_ABRV"] 
        d['engMean']  = row["ENG_MEAN"]
        d['wrdTy']  = row["WRD_TY"]
        d['synonym']  = row["SYNONYM"]
        d['descr']  = row["DESCR"]
        
        dic_data.append(d)
        
    context={
        "page":page,
        #"pagination":pagination,
        "total":totalRowCount,
        "records":words,
        "words":dic_data
    }
    
    #return Response(json.dumps(context), mimetype='application/json')
    return Response(json.dumps(context))
    #return render_template('terms/list.html'
    #                       ,words=dic_data
    #                       #,pagination=pagination
    #                       )
    
@terms_bp.route('/register', methods=['GET', 'POST'])
def register():
    print("#### terms register init ####")

    return render_template('terms/register.html')

