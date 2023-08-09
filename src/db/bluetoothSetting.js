

const SQLQuery = {
    CREATE_SETTINGS_TABLE : `CREATE TABLE IF NOT EXISTS setting
    (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        name character varying(255),
        value character varying(255)
    )`,
}

export default SQLQuery;