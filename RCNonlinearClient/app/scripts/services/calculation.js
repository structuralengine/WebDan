'use strict';

/**
 * @ngdoc service
 * @name webdan.Calculation
 * @description
 * # Calculation
 * Factory in the webdan.
 */
angular.module('webdan')
  .factory('Calculation', function() {
    return {
      page: function(value1, value2) {
        /* sasa → kit
        // 値をセッションへ代入する。この値を HTMLView.aspx が読み込む
        // 下記に VB.Net の例を示す。これと同じことを javascript で実装する

        import System.Data

        ' 見積書作成用のデータテーブルを作成します。
        Dim dtb As New DataTable()
        dtb.TableName = "製品リスト"
        dtb.Columns.Add(New DataColumn("送付先", GetType(String)))
        dtb.Columns.Add(New DataColumn("名前", GetType(String)))
        dtb.Columns.Add(New DataColumn("単価", GetType(String)))
        dtb.Columns.Add(New DataColumn("本数", GetType(String)))

        ' データテーブルにデータを設定します。
        Dim row As DataRow = dtb.NewRow()
        row("送付先") = value1
        row("名前") = value2
        row("単価") = "hoge"
        row("本数") = "moge"
        dtb.Rows.Add(row)

        Session("DataTable") = dtb

        */
        // 呼び出す
        return 'HTMLView.aspx';
      }
    }
  });