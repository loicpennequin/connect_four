const fs = require('fs-extra');
const { join } = require('path');

(async function() {
    console.log('======GRAPHQL-UPLOAD FIX START======');
    console.log(
        'This script replaces apollo-server-core dependency to graphql-upload@8 by graphql-upload@10'
    );
    console.log(
        'otherwise calling createReadStream() on file upload crashes the server.'
    );
    console.log(
        'see https://github.com/apollographql/apollo-server/issues/3508'
    );

    async function fix(nodeModulesPath) {
        const source = join(__dirname, '../../node_modules/graphql-upload');
        const apolloServerPath = join(nodeModulesPath, 'apollo-server-core');
        const dest = join(apolloServerPath, 'node_modules/graphql-upload');

        try {
            console.log(`\nreplacing ${dest}...`);
            if (fs.existsSync(apolloServerPath)) {
                await fs.emptyDir(dest);
                await fs.copy(source, dest, { overwrite: true });
                console.log('...done');
            } else {
                console.log(`...directory doesn't exist. Skipping.`);
            }
        } catch (err) {
            console.error(err);
            process.exit();
        }
    }

    await fix(join(__dirname, '../../node_modules'));

    await fix(join(__dirname, '../../packages/sc-server/node_modules'));

    console.log('======GRAPHQL-UPLOAD FIX END======');
})();
