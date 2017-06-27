'use strict';

/**
 * @ngdoc service
 * @name webdan.defaults/considerRebarDefaults
 * @description
 * # defaults/considerRebarDefaults
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('considerRebarDefaults', [
    {
      no: '1',
      name: '引張鉄筋',
      value: 'rebar_01',
    },{
      no: '2',
      name: '引張＋圧縮',
      value: 'rebar_02',
    },{
      no: '3',
      name: '全周鉄筋',
      value: 'rebar_03',
    },{
      no: '4',
      name: 'All 位置指定',
      value: 'rebar_04',
    },
  ]);
