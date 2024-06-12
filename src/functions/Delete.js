const { app, output, input } = require('@azure/functions');

const cosmosInput = input.cosmosDB({
    databaseName: 'DB-FB',
    containerName: 'Container-FB',
    connection: 'CosmosDB',
    sqlQuery: "select * from c where c.id = {id}"
});

const cosmosOutput = output.cosmosDB({
    databaseName: 'DB-FB',
    containerName: 'Container_FB',
    connection: 'CosmosDB',
    createIfNotExists: true,
});

app.http('deleteItem', {
    methods: ['DELETE'],
    authLevel: 'anonymous',
    extraInputs: [cosmosInput],
    extraOutputs: [cosmosOutput],
    route: 'items/{id}',
    handler: async (request, context) => {
        const items = context.extraInputs.get(cosmosInput);
        const data = await request.json();
        const id = data.id;

        await context.bindings.cosmosDB.delete(id);

        return {
            body: JSON.stringify(items),
            status: 200
        };
    }
});
