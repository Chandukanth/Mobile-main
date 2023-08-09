

const SQLQuery = {
    CREATE_PRODUCT_INDEX_TABLE : `CREATE TABLE IF NOT EXISTS product_index
    (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        product_id integer,
        product_name text,
        brand_id integer,
        size numeric,
        unit character varying(255),
        product_display_name character varying(255),
        product_media_id integer,
        brand_name character varying(255),
        category_id integer,
        category_name character varying(255),
        cost numeric,
        sale_price numeric,
        mrp numeric,
        company_id integer,
        created_at DATETIME,
        updated_at DATETIME,
        featured_media_url text,
        quantity integer,
        max_quantity integer,
        min_quantity integer,
        status integer,
        allow_transfer_out_of_stock integer,
        barcode character varying(255),
        profit_amount numeric,
        profit_percentage numeric,
        allow_sell_out_of_stock integer,
        tax_percentage numeric,
        pack_size integer,
        track_quantity integer,
        print_name character varying(255),
        cgst_percentage numeric,
        sgst_percentage numeric,
        cgst_amount numeric,
        sgst_amount numeric
    )`,


}

export default SQLQuery;