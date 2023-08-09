

const SQLQuery = {
    CREATE_PRODUCT_PRICE_TABLE : `CREATE TABLE IF NOT EXISTS product_price
    (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        product_price_id integer,
        product_id integer,
        cost_price decimal,
        sale_price decimal,
        mrp decimal,
        barcode character varying(255),
        company_id integer,
        is_default integer
    )`,

}

export default SQLQuery;