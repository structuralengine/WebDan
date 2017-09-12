'use strict';

angular.module('webdan')
  .constant('considerRebarDefaults', [
    {
      no: '1',
      label: '引張鉄筋',
      value: 'rebar_01'
    },{
      no: '2',
      label: '引張＋圧縮',
      value: 'rebar_02'
    },{
      no: '3',
      label: '全周鉄筋',
      value: 'rebar_03'
    },{
      no: '4',
      label: 'All 位置指定',
      value: 'rebar_04'
    }
  ]);
