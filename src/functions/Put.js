const { app, input, output } = require('@azure/functions');

const cosmosInput = input.cosmosDB({
    databaseName: 'DemoDatabase',
    containerName: 'Items',
    connection: 'CosmosDB',
    sqlQuery: "select * from c where c.id = {id}"
});

const cosmosOutput = output.cosmosDB({
    databaseName: 'DemoDatabase',
    containerName: 'Items',
    connection: 'CosmosDB',
    createIfNotExists: true,
});

app.http('putItems', {
    methods: ['PUT'],
    authLevel: 'anonymous',
    extraInputs: [cosmosInput],
    extraOutputs: [cosmosOutput],
    route: 'items/{id}',
    handler: async (request, context) => {
        const items = context.extraInputs.get(cosmosInput);
        const data = await request.json();
        data.id = item[0].id;

        context.extraOutputs.set(cosmosOutput, data)

        return {
            body: JSON.stringify(data),
            status: 200
        };
    }
});
