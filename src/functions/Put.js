const { app, input, output } = require('@azure/functions');

const cosmosInput = input.cosmosDB({
    databaseName: 'DB-FB',
    containerName: 'Container-FB',
    connection: 'CosmosDB',
    sqlQuery: "SELECT * FROM c where c.id = {id}",
});

const cosmosOutput = output.cosmosDB({
    databaseName: 'DB-FB',
    containerName: 'Container-FB',
    connection: 'CosmosDB',
    createIfNotExists: false
});

app.http('putItems', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    extraInputs: [cosmosInput],
    extraOutputs: [cosmosOutput],
    route: 'items/{id}',
    handler: async (request, context) => {
        const item = context.extraInputs.get(cosmosInput);
        const data = await request.json();
        data.id = item[0].id;

        context.extraOutputs.set(cosmosOutput, data)

        return {
            body: JSON.stringify(data),
            status: 200,
        }
    }

});
