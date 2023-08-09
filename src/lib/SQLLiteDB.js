import * as SQLite from 'expo-sqlite';

let db;
class SQLiteDB {

static DB =  this.open('oneportal.db');

 static open(DataBase){
   db = SQLite.openDatabase(DataBase);
    return db;
  }

  static async runQuery(dbInstance, query, values) {
    try {
      if (query) {
        let rows;
        let valueList = values && values.length > 0 ? values : [];
        await new Promise((resolve, reject) => {
          dbInstance.exec([{ sql: query, args: valueList }], false, (error, result) => {
            if (result) {
              resolve();
              if (result.length > 0) {
                rows = result[0].rows;
              }
            }
            if (error) {
              console.log("Error Execting the Query: ", error);
              reject();
            }
          });
        });
        return rows;
      }
    } catch (err) {
      console.log(err);
    }
  };

}


export default SQLiteDB;