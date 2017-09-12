Imports System.IO
Partial Public Class SaveFile
	Inherits System.Web.UI.Page

	Private components As System.ComponentModel.IContainer
	Private dtb As DataTable
	Friend WithEvents webCellReport1 As AdvanceSoftware.VBReport8.Web.WebCellReport
	Private fileType As String
	Private Sub InitializeComponent()
		Me.components = New System.ComponentModel.Container
		Me.webCellReport1 = New AdvanceSoftware.VBReport8.Web.WebCellReport(Me.components)
		'
		'WebCellReport1
		'
		Me.webCellReport1.TemporaryPath = Nothing

	End Sub
	'【ファイル生成の流れ】=========================================='
	' (1)Web帳票コンポーネント(webCellReport)で帳票ドキュメントを作成します。
	'    ↓↓↓
	' (2)SaveAs 、SavePDFで帳票ドキュメントをストリームとして出力します。
	'    ↓↓↓
	' (3)Response.BinaryWrite でクライアントに送信します。
	'================================================================'
	Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
		InitializeComponent()
		dtb = CType(Session("DataTable"), DataTable)
		fileType = Request.QueryString("FileType")
		CreateDocument()
	End Sub

	''' <summary>
	''' 見積書の作成とファイル出力
	''' </summary>
	Private Sub CreateDocument()
		Dim row As DataRow
		Dim totalPrice As Integer = 0

		'【1】==========================================================='
		' Web帳票コンポーネントにデザインファイルを指定して、帳票作成処理
		' 開始します。処理手順は Windows フォームアプリケーションの帳票作
		' 成処理とほぼ同じです。
		'================================================================'
		Dim designFileName As String = ""
		If (fileType = "XLS") Then
			designFileName = Server.MapPath(".") + "\App_Data\見積書.xls"
		Else
			designFileName = Server.MapPath(".") + "\App_Data\見積書.xlsx"
		End If
		webCellReport1.FileName = designFileName
		webCellReport1.Report.Start()
		webCellReport1.Report.File()

		'【2】==========================================================='
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

		'【3】==========================================================='
		' 帳票作成処理を終了します。
		'================================================================'
		webCellReport1.Report.End()

		'【4】==========================================================='
		' 帳票ドキュメントの出力をストリームで行い、適切なヘッダを設定して
		' バイナリ転送します。各ファイル形式での処理は下記をご確認ください。
		'================================================================'
		Dim ms As MemoryStream = New MemoryStream()
		Select Case fileType
			Case "XLS" ' Excel ファイル(xls 形式)
				webCellReport1.Report.SaveAs(ms)
				Response.Clear()
				Response.ContentType = "application/vnd.ms-excel"
				Response.AddHeader("content-disposition", "attachment; filename=WebReport.xls")
				Response.BinaryWrite(ms.ToArray())
				ms.Close()
			Case "XLSX"	' Excel ファイル(xlsx 形式)
				webCellReport1.Report.SaveAs(ms)
				Response.Clear()
				Response.ContentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
				Response.AddHeader("content-disposition", "attachment; filename=WebReport.xlsx")
				Response.BinaryWrite(ms.ToArray())
				ms.Close()
			Case "PDF" ' PDF ファイル
				webCellReport1.Report.SavePDF(ms)
				Response.Clear()
				Response.ContentType = "application/pdf"
				Response.AddHeader("content-disposition", "attachment; filename=WebReport.pdf")
				Response.BinaryWrite(ms.ToArray())
				ms.Close()
		End Select

		'【5】==========================================================='
		' Response.Endを終了処理で必ず呼び出してください。
		' (実装しない場合、開けないファイルが生成される恐れがあります)
		'================================================================'
		Response.End()
	End Sub
End Class