const {utils, config, Constants, override} = require('@dreesq/serpent');
const bcrypt = require('bcryptjs');
const {userSchema} = require('./_schemas/user');
const {USER_STATUS_MAP} = Constants;

utils.autoCrud('User', {
    middleware: [
        'auth:required',
    ],
    fields: [
        'role',
        '_id',
        'name',
        'status',
        'locale',
        'email',
        'permissions'
    ],
    schema: userSchema,
    async before({input}, method, filters) {
        if (!input.role) {
            delete input.role;
        }

        if (method === 'find') {
            let search = utils.get(input, 'filters.search', false);

            return query => {
                if (search) {
                    query.or(
                        [
                            {
                                name: new RegExp(search, 'i')
                            }
                        ]
                    );
                }

                query.populate('role').populate('permissions');
            }
        }

        if ((method === 'update' || method === 'create') && input.password) {
            input.password = await bcrypt.hash(input.password, 10);
        }
    },
    async after(ctx, method, result) {
        if (method === 'find') {
            result.data = result.data.map(item => {
                item = item.toJSON();
                item.statusName = USER_STATUS_MAP[item.status];
                item.permissions = item.permissions.filter(x => !!x).map(permission => ({
                    value: permission._id,
                    name: permission.name
                }));

                if (item.role) {
                    item.role = {
                        value: item.role._id,
                        name: item.role.name
                    };
                }

                return item;
            });
        }

        return result;
    }
});

config({
    name: 'roleAutocomplete',
    input: {
        text: 'string'
    },
    middleware: [
        'auth:required'
    ]
})(
    async ({db, input}) => {
        const {Role} = db;
        const roles = await Role.find().where('name', new RegExp(input.text || '', 'i'));

        return roles.map(role => ({
            name: role.name,
            value: role._id
        }));
    }
);

utils.autoCrud('Role', {
    middleware: [
        'auth:required',
    ],
    schema: utils.form({
        name: {
            label: 'Name',
            placeholder: 'Name',
            name: 'name',
            validation: 'required|string|min:3'
        }
    }),
    before({input}, method, filters) {
        if (method === 'find') {
            return query => {
                if (filters.search) {
                    query.where('name', new RegExp(filters.search, 'i'));
                }
            };
        }

        return filters;
    }
});

utils.autoCrud('Permission', {
    middleware: [
        'auth:required',
    ],
    schema: utils.form({
        name: {
            label: 'Name',
            placeholder: 'Name',
            validation: 'required|string|min:3'
        },
        roleId: {
            label: 'Role',
            placeholder: 'Role',
            type: 'autocomplete',
            validation: 'required|string',
            values: 'roleAutocomplete'
        }
    }),
    before({input}, method, filters) {
        if (method === 'find') {
            return query => {
                if (filters.search) {
                    query.where('name', new RegExp(filters.search, 'i'));
                }

                query.populate('roleId');
            };
        }

        return filters;
    },
    async after(ctx, method, result) {
        if (method === 'find') {
            result.data = result.data.map(item => {
                item = item.toJSON();

                if (item.roleId) {
                    item.roleName = item.roleId.name;
                    item.roleId = {
                        name: item.roleId.name,
                        value: item.roleId._id
                    };
                }

                return item;
            });
        }

        return result;
    }
});

config({
    name: 'permissionAutocomplete',
    input: {
        text: 'string'
    },
    middleware: [
        'auth:required'
    ]
})(
    async ({db, input}) => {
        const {Permission} = db;
        const permissions = await Permission.find().where('name', new RegExp(input.text || '', 'i'));

        return permissions.map(permission => ({
            name: permission.name,
            value: permission._id
        }));
    }
);

const capitalize = name => name.charAt(0).toUpperCase() + name.slice(1);
override('setPassword', config => {
    for (const key in config.input) {
        let options = {
            label: `${capitalize(key)} Password`,
            type: 'password',
            placeholder: `${capitalize(key)} Password`,
            validation: config.input[key]
        };

        if (key === 'refresh') {
            options.visible = false;
            options.label = '';
        }

        config.input[key] = options;
    }

    config.input = utils.form(config.input);
    return config;
});

config({
    name: 'setName',
    middleware: [
        'auth:required'
    ],
    input: utils.form({
        name: {
            validation: 'required|min:1',
            label: 'Name'
        }
    })
})(
    async ({user, db, input}) => {
        await db.User.updateOne({
            _id: user._id
        }, {
            name: input.name
        });

        return utils.success({
            message: 'Username updated',
            name: input.name
        });
    }
);
