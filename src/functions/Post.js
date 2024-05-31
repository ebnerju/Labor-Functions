const { app, output } = require('@azure/functions');

const cosmosOutput = output.cosmosDB({
    databaseName: 'DemoDatabase',
    containerName: 'Items',
    connection: 'CosmosDB',
    createIfNotExists: true
});

app.http('postItems', {
    methods: ['POST'],
    authLevel: 'anonymous',
    extraOutputs: [cosmosOutput],
    route: 'items',
    handler: async (request, context) => {
        const item = await request.json()
        item.id = ((Math.random() + 1).toString(36))
        context.extraOutputs.set(cosmosOutput, item);
        console.log(item)
        return {
            status: 200,
            body: JSON.stringify(item)


        };
    }
});