

const SQLQuery = {
    CREATE_ORDER_PRODUCT_TABLE : `CREATE TABLE IF NOT EXISTS order_product
    (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        order_product_id integer,
        order_id integer,
        product_id bigint,
        quantity integer,
        unit_price numeric,
        price numeric,
        store_id integer,
        media_id integer,
        media_url character varying(255),
        image text,
        company_id integer,
        created_at DATETIME,
        updated_at DATETIME
    )`,

}

export default SQLQuery;