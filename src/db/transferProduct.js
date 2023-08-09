

const SQLQuery = {
    CREATE_TRANSFER_PRODUCT_TABLE: `CREATE TABLE IF NOT EXISTS transfer_product
    (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        transfer_product_id integer, 
        transfer_id integer,
        quantity integer,
        status integer,
        product_id integer,
        amount numeric,
        unit_price numeric,
        company_id integer,
        created_at DATETIME,
        updated_at DATETIME
    )`,

}

export default SQLQuery;