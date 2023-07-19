import pg_promise from 'pg-promise';

const camelizeColumns = (data: Record<string, object>[]) => {
    const tmp = data[0];
    for (const prop in tmp) {
        const camel = pgp.utils.camelize(prop);
        if (!(camel in tmp)) {
            for (let i = 0; i < data.length; i++) {
                const d = data[i];
                d[camel] = d[prop];
                delete d[prop];
            }
        }
    }
};

const pgp = pg_promise({
    receive(e) {
        camelizeColumns(e.data);
    },
});

const connection = process.env.CONNECTION_STRING;

if (!connection) {
    throw new Error('Connection string not defined');
}

const database = pgp<unknown>(connection);

const postgres = {
    database,
    pgp,
};

export default postgres;
