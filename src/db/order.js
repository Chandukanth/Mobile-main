

const SQLQuery = {
    CREATE_ORDER_TABLE : `CREATE TABLE IF NOT EXISTS "order"
    (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        order_id integer,
        date DATETIME,
        total_amount numeric,
        store_id bigint,
        company_id integer,
        created_at DATETIME,
        updated_at DATETIME,
        order_number bigint,
        status character varying(255),
        sales_executive_user_id integer,
        shift integer,
        uuid uuid,
        payment_type integer,
        createdBy integer
    )`,

}

export default SQLQuery;