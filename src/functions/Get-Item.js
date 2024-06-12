const { app, input } = require('@azure/functions');

const cosmosInput = input.cosmosDB({
    databaseName: 'DB-FB',
    containerName: 'Container-FB',
    connection: 'CosmosDB',
    sqlQuery: "SELECT * FROM c where c.id = {id}"
});

app.http('getItems', {
    methods: ['GET'],
    authLevel: 'anonymous',
    extraInputs: [cosmosInput],
    route: 'items/{id}',
    handler: async (request, context) => {
        const items = context.extraInputs.get(cosmosInput);
        return {
            body: JSON.stringify(items),
            status: 200
        };
    }
});
