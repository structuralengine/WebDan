'use strict';

/**
 * @ngdoc service
 * @name webdan.fatigueComplexColumnsConfig
 * @description
 * # fatigueComplexColumnsConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('fatigueComplexColumnsConfig', [
    {
      data: 'DesignPoint.Member.m_no',
      type: 'numeric',
    },
    {
      data: 'DesignPoint.p_name',
      type: 'text',
    },
    {
      data: 'section',
      type: 'numeric',
      //renderer: renderBH
    },
    {
      data: 'FatiguePosition.rebar_side',
      type: 'text',
    },
    {
      data: 'FatigueDataSet.bendingMoment.SASC',
      type: 'numeric',
    },
    {
      data: 'FatigueDataSet.bendingMoment.SBSC',
      type: 'numeric',
    },
    {
      data: 'FatigueDataSet.bendingMoment.k006.NA',
      type: 'numeric',
    },
    {
      data: 'FatigueDataSet.bendingMoment.k006.NB',
      type: 'numeric',
    },
    {
      data: 'FatigueDataSet.bendingMoment.k012.NA',
      type: 'numeric',
    },
    {
      data: 'FatigueDataSet.bendingMoment.k012.NB',
      type: 'numeric',
    },
    {
      data: 'FatigueDataSet.bendingMoment.r2.a',
      type: 'numeric',
    },
    {
      data: 'FatigueDataSet.bendingMoment.r2.b',
      type: 'numeric',
    },
    {
      data: 'FatigueDataSet.shear.SASC',
      type: 'numeric',
    },
    {
      data: 'FatigueDataSet.shear.SBSC',
      type: 'numeric',
    },
    {
      data: 'FatigueDataSet.shear.k006.NA',
      type: 'numeric',
    },
    {
      data: 'FatigueDataSet.shear.k006.NB',
      type: 'numeric',
    },
    {
      data: 'FatigueDataSet.shear.k012.NA',
      type: 'numeric',
    },
    {
      data: 'FatigueDataSet.shear.k012.NB',
      type: 'numeric',
    },
    {
      data: 'FatigueDataSet.shear.r2.a',
      type: 'numeric',
    },
    {
      data: 'FatigueDataSet.shear.r2.b',
      type: 'numeric',
    },
  ]);
