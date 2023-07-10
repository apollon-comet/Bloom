const {Constants, utils} = require('@dreesq/serpent');
const {USER_STATUS_MAP, USER_STATUS_ACTIVE} = Constants;

exports.userSchema = method => utils.form({
    name: {
        label: 'Name',
        placeholder: 'Name',
        validation: 'required|string|min:5',
        size: {
            xsUp: '70%'
        }
    },
    locale: {
        label: 'Locale',
        type: 'select',
        validation: 'required|string|min:2',
        values: [
            {
                name: 'EN',
                value: 'en'
            }
        ],
        value: 'en',
        size: {
            xsUp: '30%'
        }
    },
    email: {
        label: 'Email',
        placeholder: 'Email',
        type: 'email',
        validation: `${method === 'create' ? 'required|' : ''}email|min:5|unique:user,email`,
        ifChanged: true
    },
    password: {
        label: 'Password',
        placeholder: 'Password',
        type: 'password',
        validation: `${method === 'create' ? 'required|' : ''}string|min:5`,
        ifChanged: true
    },
    role: {
        label: 'Role',
        type: 'autocomplete',
        placeholder: 'Role',
        values: 'roleAutocomplete',
        size: {
            xsUp: '50%'
        }
    },
    status: {
        label: 'Status',
        type: 'select',
        values: Object.keys(USER_STATUS_MAP).map(key => ({
            name: USER_STATUS_MAP[key],
            value: key
        })),
        value: USER_STATUS_ACTIVE,
        size: {
            xsUp: '50%'
        }
    },
    permissions: {
        label: 'Permissions',
        type: 'autocomplete',
        multi: true,
        placeholder: 'Permissions',
        size: '10',
        values: 'permissionAutocomplete',
        value: []
    }
});
