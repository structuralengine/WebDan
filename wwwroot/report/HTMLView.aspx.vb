Partial Public Class HTMLView
    Inherits System.Web.UI.Page

    Private components As System.ComponentModel.IContainer
    Private inputJson As String
    Friend WithEvents webCellReport1 As AdvanceSoftware.VBReport8.Web.WebCellReport

    Private Sub InitializeComponent()
        Me.components = New System.ComponentModel.Container
        Me.webCellReport1 = New AdvanceSoftware.VBReport8.Web.WebCellReport(Me.components)
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
            '取得する
            Try
                Me.inputJson = CType(Session("webdan.postData"), String)
            Catch ex As Exception
                Me.inputJson = ex.Message
            End Try
            CreateDocument()
        End If
    End Sub
    Private Sub CreateDocument()


        '【2】==========================================================='
        webCellReport1.FileName = Server.MapPath(".") + "\見積書.xlsx"
        webCellReport1.Report.Start()
        webCellReport1.Report.File()

        '【3】==========================================================='
        ' デザインファイル内のテンプレートとなるシートを選択し、帳票ドキュ
        ' メントを設定します。
        webCellReport1.Page.Start("見積書", "1")

        ' 送付先
        webCellReport1.Cell("B3").Value = "hallow  " + Left(Me.inputJson, 15)

        webCellReport1.Page.End()

        '【4】==========================================================='
        ' 帳票作成処理を終了します。
        webCellReport1.Report.End()

        '【5】==========================================================='
        ' webCellReport.Web.ScriptPathで出力されるHTMLデータに対する、
        ' Javascriptのパスを設定します。
        webCellReport1.Web.ScriptPath = "scripts/"

        '【6】==========================================================='
        ' webCellReport.Web.HyperlinkEnabledは、セル内のハイパーリンクを
        ' URLとして扱うかどうかの切り替えが可能です。
        webCellReport1.Web.HyperlinkEnabled = True

        '【7】==========================================================='
        ' webCellReport1.Report.GetHtmlで帳票ドキュメントを取得します。
        Dim pages As System.Collections.Generic.List(Of String) = webCellReport1.Report.GetHtml()

        '【8】==========================================================='
        ' HTMLビューアコントロールに取得した帳票ドキュメントを設定します。
        viewerControl1.Pages = pages
    End Sub
End Class