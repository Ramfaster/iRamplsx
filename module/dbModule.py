import pymysql


class Database():
    def __init__(self):
        self.db = pymysql.connect(host='localhost',
                                  user='sysbench',
                                  password='sysbench',
                                  db='ipythonx',
                                  charset='utf8')
        self.cursor = self.db.cursor(pymysql.cursors.DictCursor)

    def execute(self, query, args={}):
        self.cursor.execute(query, args)

    def executeOne(self, query, args={}):
        self.cursor.execute(query, args)
        row = self.cursor.fetchone()
        return row

    def executeAll(self, query, args={}):
        self.cursor.execute(query, args)
        row = self.cursor.fetchall()
        return row

    def executeRowCount(self, query, args={}):
        self.cursor.execute(query, args)
        cnt = self.cursor.rowcount
        return cnt

    def commit(self):
        self.db.commit()

    def close(self):
        self.db.close()
