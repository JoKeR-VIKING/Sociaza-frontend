const { aliasWebpack, aliasJest } = require('react-app-alias');

const aliasMap = {
	'@components': 'src/components',
	'@services': 'src/services',
	'@assets': 'src/assets',
	'@colors': 'src/colors',
	'@hooks': 'src/hooks',
	'@pages': 'src/pages',
	'@redux': 'src/redux',
	'@root': 'src'
};

const options = {
	alias: aliasMap
}

module.exports = aliasWebpack(options);
module.exports.jest = aliasJest(options);