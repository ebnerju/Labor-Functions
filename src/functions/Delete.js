const { app, output, input } = require('@azure/functions');

const cosmosInput = input.cosmosDB({
    databaseName: 'DB-FB',
    containerName: 'FB-Items',
    connection: 'CosmosDB',
    sqlQuery: "select * from c where c.id = {id}"
});

const cosmosOutput = output.cosmosDB({
    databaseName: 'DemoDatabase',
    containerName: 'Items',
    connection: 'CosmosDB',
    createIfNotExists: true,
});

app.http('deleteItem', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    extraInputs: [cosmosInput],
    extraOutputs: [cosmosOutput],
    route: 'item/{id}',
    handler: async (request, context) => {
        const items = context.extraInputs.get(cosmosInput);
        const data = await request.json();
        data.id = item[0].id;
        context.extraOutputs.delete(cosmosOutput, data)
        return {
            body: JSON.stringify(items),
            status: 200
        };
    }
});
