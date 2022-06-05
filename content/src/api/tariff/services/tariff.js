'use strict';

/**
 * tariff service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::tariff.tariff');
