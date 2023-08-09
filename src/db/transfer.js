

const SQLQuery = {
    CREATE_TRANSFER_TABLE : `CREATE TABLE IF NOT EXISTS transfer
    (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        transfer_id integer, 
        from_store_id integer,
        to_store_id integer,
        date DATETIME,
        status character varying(255),
        company_id integer,
        created_at DATETIME,
        updated_at DATETIME,
        transfer_number integer,
        type integer
    )`,

}

export default SQLQuery;