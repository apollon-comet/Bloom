const {config, plugin, Constants, utils} = require('@dreesq/serpent');
const {DRIVER_DB} = Constants;
const configPlugin = plugin('config');

config({
    name: 'getFeatures',
    middleware: [
        'auth:required'
    ]
})({
    logs: configPlugin.get('plugins.logger.driver') === DRIVER_DB,
    translations: configPlugin.get('plugins.i18n.driver') === DRIVER_DB
});

config({
    name: 'getStats',
    middleware: [
        'auth:required'
    ]
})(
    async ({db}) => {
        const {User} = db;

        return {
            users: await User.estimatedDocumentCount()
        }
    }
);

config({
    name: 'getLogs',
    middleware: [
        'auth:required'
    ],
    enabled: configPlugin.get('plugins.logger.driver') === DRIVER_DB,
    input: {
        page: 'number',
        filters: {
            level: 'string',
            message: 'string'
        },
        sorts: {
            level: 'number',
            app: 'number'
        }
    }
})(
    utils.autoFilter('Log', {
        pagination: true,
        before(query, filters) {
            if (filters.level) {
                query.where('level', filters.level);
            }

            if (filters.message) {
                query.where('message', new RegExp(filters.message, 'i'));
            }
        }
    })
);
