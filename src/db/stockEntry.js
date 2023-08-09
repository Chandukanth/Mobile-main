

const SQLQuery = {
    CREATE_STOCK_ENTRY_TABLE : `CREATE TABLE IF NOT EXISTS stock_entry
    (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        stock_entry_id integer, 
        store_id integer,
        date DATETIME,
        stock_entry_number integer,
        status character varying(255),
        owner_id integer,
        company_id integer,
        created_at DATETIME,
        updated_at DATETIME
    )`,

}

export default SQLQuery;