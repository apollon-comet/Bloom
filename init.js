const Serpent = require('@dreesq/serpent');
const bcrypt = require('bcryptjs');

/**
 * Default roles
 * @type {*[]}
 */

const roles = [
    'user',
    'admin'
];

/**
 * Default users
 * @type {*[]}
 */

const users = [
    {
        name: 'Admin',
        email: 'admin@admin.com',
        role: 'admin',
        password: 'password123'
    },
    {
        name: 'User',
        email: 'user@user.com',
        role: 'user',
        password: 'password123'
    }
];

(async () => {
    await Serpent.standalone({
        autoload: {
            actions: false
        }
    });

    const {User, Role} = Serpent.plugin('db');
    const logger = Serpent.plugin('logger');
    const rolesMap = {};

    logger.info('================ Running initialization script ===============');

    for (const role of roles) {
        const created = await Role.create({
            name: role
        });

        rolesMap[role] = created._id;
    }

    for (const user of users) {
        logger.info('Creating user:');
        logger.info(user);
        await User.create({
            name: user.name,
            email: user.email,
            password: await bcrypt.hash(user.password, 10),
            role: rolesMap[user.role]
        });
    }

    logger.info('============================ Done ===========================');
})();
