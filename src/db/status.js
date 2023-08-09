

const SQLQuery = {
    CREATE_PRODUCT_STATUS_TABLE : `CREATE TABLE IF NOT EXISTS status
    (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        status_id integer,
        name character varying(255),
        object_id integer,
        color_code character varying(255),
        next_status_id character varying(255),
        sort_order integer,
        allowed_role_id character varying(255),
        object_name character varying(255),
        update_quantity integer,
        company_id integer,
        group_id integer,
        allow_edit integer,
        project_id integer
    )`,

}

export default SQLQuery;