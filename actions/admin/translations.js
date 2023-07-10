const {config, utils, plugin} = require('@dreesq/serpent');

config({
    name: 'filterTranslations',
    middleware: [
        'auth:required'
    ],
    input: {
        page: 'number',
        filters: {
            search: 'string'
        }
    }
})(
    utils.autoFilter('Translation', {
        pagination: true,
        before(query, filters, {input}) {
            if (filters.search) {
                query.where('key', new RegExp(filters.search, 'i'));
            }

            query.sort({
                _id: -1,
                key: -1
            });
        },
        async after(result, _, {config}) {
            result.locales = config.get('plugins.i18n.locales');
            return result;
        }
    })
);

const i18n = plugin('i18n');
const configPlugin = plugin('config');

config({
    name: 'setTranslation',
    middleware: [
        'auth:required'
    ],
    input: utils.form({
        key: {
            label: 'Key',
            placeholder: 'a.b.c',
            validation: 'required|string|min:1'
        },
        locale: {
            label: 'Locale',
            type: 'select',
            validation: 'required|string',
            value: 'en',
            values: configPlugin.get('plugins.i18n.locales', ['en']).map(locale => ({
                name: locale.toUpperCase(),
                value: locale
            }))
        },
        content: {
            label: 'Content',
            type: 'textarea',
            validation: 'required|string'
        },
        app: {
            label: 'App',
            validation: 'string',
            ifChanged: true
        }
    })
})(
    async ({input}) => {
        const {locale, key, content, app = null} = input;
        let status = 'success';
        let message = '';

        try {
            await i18n.setTranslation(locale, key, content, app);
        } catch(e) {
            status = 'error';
            message = 'An error occurred';
        }

        return utils[status](message);
    }
);

config({
    name: 'unsetTranslation',
    middleware: [
        'auth:required'
    ],
    input: {
        key: 'required|string|min:1',
        locale: 'required|string',
        app: 'string'
    }
})(
    async ({input}) => {
        const {locale, key, app = null} = input;
        let status = 'success';
        let message = '';

        try {
            await i18n.unsetTranslation(locale, key, app);
        } catch(e) {
            console.log(e);
            status = 'error';
            message = 'An error occurred';
        }

        return utils[status](message);
    }
);
