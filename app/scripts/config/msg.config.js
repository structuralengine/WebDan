'use strict';

/**
 * @ngdoc service
 * @name webdan.config/msgConfig
 * @description
 * # config/msgConfig
 * Constant in the webdan.
 */
angular.module('webdan')
  .constant('msgConfig', {
    files: {
      save: {
        failed: [
          'ファイルの保存に失敗しました',
          'ファイルをダウンロードします'
        ].join('\n'),
        noData: [
          'データが読み込まれていません',
          'データを新規作成するか、ファイルを読み込んでください'
        ].join('\n')
      },
    },
  });
