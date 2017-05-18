'use strict';

/**
 * @ngdoc service
 * @name webdan.barsColumnsComplexConfig
 * @description
 * # barsColumnsComplexConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('barsColumnsComplexConfig', [
    // 部材番号
    {
      description: '部材番号',
      data: 'DesignPoint.Member.m_no',
      type: 'numeric',
    },
    // 算出点名
    {
      description: '算出点名',
      data: 'DesignPoint.p_name',
      type: 'text',
    },
    // 断面
    {
      description: '断面',
      data: 'section',
      type: 'numeric',
    },
    // ハンチ高
    {
      description: 'ハンチ高',
      data: 'haunchHeight',
      type: 'numeric',
    },
    // 位置
    {
      description: '位置',
      data: 'BarDataSet.rebar_side',
      type: 'text',
    },
    // 軸方向鉄筋
    {
      description: '鉄筋径',
      data: 'BarDataSet.rebar_01',
      type: 'numeric',
    },
    {
      description: '本数',
      data: 'BarDataSet.rebar_02',
      type: 'numeric',
    },
    {
      description: '一段目カブリ',
      data: 'BarDataSet.rebar_03',
      type: 'numeric',
    },
    {
      description: '並び数',
      data: 'BarDataSet.rebar_04',
      type: 'numeric',
    },
    {
      description: 'アキ',
      data: 'BarDataSet.rebar_05',
      type: 'numeric',
    },
    {
      description: '間隔',
      data: 'BarDataSet.rebar_06',
      type: 'numeric',
    },
    // 側方鉄筋
    {
      description: '鉄筋径',
      data: 'BarDataSet.sidebar_01',
      type: 'numeric',
    },
    {
      description: '本数片',
      data: 'BarDataSet.sidebar_02',
      type: 'numeric',
    },
    {
      description: '上端位置/ピッチ',
      data: 'BarDataSet.sidebar_03',
      type: 'numeric',
    },
    // スターラップ
    {
      description: '鉄筋径',
      data: 'BarDataSet.hoop_01',
      type: 'numeric',
    },
    {
      description: '組数',
      data: 'BarDataSet.hoop_02',
      type: 'numeric',
    },
    {
      description: '間隔',
      data: 'BarDataSet.hoop_03',
      type: 'numeric',
    },
    // 主筋の斜率
    {
      description: '主筋の斜率',
      data: 'BarDataSet.rebar_07',
      type: 'numeric',
    },
    // tan&gamma; + tan&beta;
    {
      description: 'tan&gamma; + tan&beta;',
      data: 'BarDataSet.rebar_08',
      type: 'numeric',
    },
    // 折曲げ鉄筋
    {
      description: '鉄筋径',
      data: 'BarDataSet.bent_01',
      type: 'numeric',
    },
    {
      description: '本数',
      data: 'BarDataSet.bent_02',
      type: 'numeric',
    },
    {
      description: '間隔',
      data: 'BarDataSet.bent_03',
      type: 'numeric',
    },
    {
      description: '角度',
      data: 'BarDataSet.bent_04',
      type: 'numeric',
    },
    // 処理
    {
      description: '処理',
      data: 'BarDataSet.flg_enable',
      type: 'numeric',
    },
  ]);
