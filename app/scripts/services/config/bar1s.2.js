'use strict';

/**
 * @ngdoc service
 * @name webdan.bar1sConfig
 * @description
 * # bar1sConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('bar1sConfig', {
    "部材番号": {
      en: "Member No",
      column: {
        data: "DesignPoint.Member.m_no",
        type: "numeric",
      },
    },
    "算出点名": {
      en: "Design Point",
      column: {
        data: "DesignPoint.p_name",
        type: "text",
      },
    },
    "断面": {
      en: "Section",
      items: {
        "B": {
          en: "Width",
          column: {
            data: "B",
            type: "numeric",
          },
        },
        "H": {
          en: "Height",
          column: {
            data: "H",
            type: "numeric",
          },
        },
      },
    },
    "ハンチ高": {
      en: "Haunch Height",
      items: {
        "曲げ": {
          en: "Bending Moment",
          column: {
            data: "dH_m",
            type: "numeric",
          },
        },
        "せん断": {
          en: "Shear",
          column: {
            data: "dH_s",
            type: "numeric",
          },
        },
      },
    },
  });
