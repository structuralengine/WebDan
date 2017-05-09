Partial Public Class HTMLView
    Inherits System.Web.UI.Page

    Private components As System.ComponentModel.IContainer
    Private dtb As DataTable
    Friend WithEvents webCellReport1 As AdvanceSoftware.VBReport8.Web.WebCellReport

    Private Sub InitializeComponent()
        Me.components = New System.ComponentModel.Container
        Me.webCellReport1 = New AdvanceSoftware.VBReport8.Web.WebCellReport(Me.components)
        '
        'WebCellReport1
        '
        Me.webCellReport1.TemporaryPath = Nothing

    End Sub
    '【HTMLビューアコントロールによるプレビューの流れ】=============='
    ' (1)Web帳票コンポーネント(webCellReport)で帳票ドキュメントを作成します。
    '    ↓↓↓
    ' (2)出力されるHTMLデータに対する、Javascriptのパスを設定します。
    '    ↓↓↓
    ' (3)GetHTMLで帳票ドキュメントを取得します。
    '    ↓↓↓
    ' (4)ビューアコントロールに帳票ドキュメントを設定します。
    '================================================================'
    Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
        InitializeComponent()
        '【1】==========================================================='
        ' HTMLビューアコントロールを操作すると、ページがリロードされるた
        ' め、帳票作成は初期表示の際にのみ行なうように判定を行ないます。
        ' PageNo=0の場合、帳票は非表示(初期表示)の状態となります。
        '================================================================'
        If (IsPostBack = False) Then
            dtb = CType(Session("DataTable"), DataTable)
            CreateDocument()
        End If
    End Sub

    ''' <summary>
    ''' 見積書の作成とプレビュー
    ''' </summary>
    Private Sub CreateDocument()
        Dim row As DataRow
        Dim totalPrice As Integer = 0

        '【2】==========================================================='
        ' Web帳票コンポーネントにデザインファイルを指定して、帳票作成処理
        ' 開始します。処理手順は Windows フォームアプリケーションの帳票作
        ' 成処理とほぼ同じです。
        '================================================================'
        webCellReport1.FileName = Server.MapPath(".") + "\App_Data\見積書.xls"
        webCellReport1.Report.Start()
        webCellReport1.Report.File()

        '【3】==========================================================='
        ' デザインファイル内のテンプレートとなるシートを選択し、帳票ドキュ
        ' メントを設定します。
        '================================================================'
        webCellReport1.Page.Start("見積書", "1")
        ' 送付先
        row = dtb.Rows(0)
        webCellReport1.Cell("B3").Value = row("送付先")
        ' 見積書作成日、見積番号
        Dim dt As DateTime = DateTime.Now
        webCellReport1.Cell("B6").Value = dt
        webCellReport1.Cell("E3").Value = "ADV" + dt.Date.ToString("MMdd") + "-01"
        ' 製品データ
        Dim count As Integer = dtb.Rows.Count
        For i As Integer = 0 To count - 1
            ' 名前
            row = dtb.Rows(i)
            webCellReport1.Cell("B13", 0, i).Value = row("名前")
            ' 本数
            Dim unitNumber As Integer = Convert.ToInt32(row("本数"))
            webCellReport1.Cell("D13", 0, i).Value = unitNumber
            ' 単価
            Dim unitPrice As Integer = Convert.ToInt32(row("単価"))
            webCellReport1.Cell("E13", 0, i).Value = unitPrice
            ' 金額
            Dim price As Integer = unitNumber * unitPrice
            webCellReport1.Cell("F13", 0, i).Value = price
            totalPrice += price
        Next
        ' 小計
        webCellReport1.Cell("D28").Value = totalPrice
        ' 消費税
        webCellReport1.Cell("D29").Value = totalPrice * 0.05F
        ' 合計
        webCellReport1.Cell("**合計").Value = totalPrice * 1.05F

        webCellReport1.Page.End()

        '【4】==========================================================='
        ' 帳票作成処理を終了します。
        '================================================================'
        webCellReport1.Report.End()

        '【5】==========================================================='
        ' webCellReport.Web.ScriptPathで出力されるHTMLデータに対する、
        ' Javascriptのパスを設定します。
        '================================================================'
        webCellReport1.Web.ScriptPath = "scripts/"

        '【6】==========================================================='
        ' webCellReport.Web.HyperlinkEnabledは、セル内のハイパーリンクを
        ' URLとして扱うかどうかの切り替えが可能です。
        '================================================================'
        webCellReport1.Web.HyperlinkEnabled = True

        '【7】==========================================================='
        ' webCellReport1.Report.GetHtmlで帳票ドキュメントを取得します。
        '================================================================'
        Dim pages As System.Collections.Generic.List(Of String) = webCellReport1.Report.GetHtml()

        '【8】==========================================================='
        ' HTMLビューアコントロールに取得した帳票ドキュメントを設定します。
        '================================================================'
        viewerControl1.Pages = pages
    End Sub
End Class