

const SQLQuery = {
    CREATE_STOCK_ENTRY_PRODUCT_TABLE: `CREATE TABLE IF NOT EXISTS stock_entry_product
    (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        stock_entry_product_id integer,
        stock_entry_id integer,
        product_id integer,  
        quantity integer,
        company_id integer,
        created_at DATETIME,
        updated_at DATETIME
    )`,

}

export default SQLQuery;