<%@ Page Language="vb" AutoEventWireup="false" CodeBehind="HTMLView.aspx.vb" Inherits="ADVSample.HTMLView" %>

<%@ Register assembly="VBReport8.Web.Viewer" namespace="AdvanceSoftware.VBReport8.Web" tagprefix="vbReport" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html xmlns="http://www.w3.org/1999/xhtml" >
<head id="Head1" runat="server">
    <title>Web 帳票サンプル - プレビューページ</title>
<style type="text/css">
body
{ font-family: "ＭＳ ゴシック", serif; }
div#header
{
	background-color: blue;
	padding: 20px, 0px, 0px, 0px;
	width: 100%;
}
div#header table.headerTable
{
    width: 100%;
}
div#header table.headerTable tr
{
	padding-top: 10px;
	padding-left: 13px;
}
div#header table.headerTable td#title
{
	color: white;
	text-decoration: underline;
	font-family: Impact, Charcoal;
	font-size: 100%;
	margin-top: 0px;
	margin-bottom: 0px;
}
div#header table.headerTable td#comment
{
	color: white;
	font-family: "ＭＳ ゴシック", serif;
	font-size: 80%;
	margin-top: 0px;
	margin-bottom: 0px;
}
table.listTable
{
    width: 640px;
    margin-left: 28px;
}
table.listTable tr
{
	padding-top: 10px;
	padding-left: 13px;
}
table.listTable td.listTitle
{
    color: #000080;
    font-size: 80%;
    width: 70px;
}
table.listTable td.listItem
{
    font-size: 80%;
    width: 380px;
}
p
{
    font-size: 90%;
    margin-left: 10px;
	margin-bottom: 5px;
}
span.comment
{
    font-size: 70%;
}
</style>
</head>
	<%
		'【重要】========================================================//
		' HTMLビューアコントロールを使用する場合は、必ずjQueryの読み込み
		' を実装してください。
		'================================================================//
	 %>
    <script type="text/javascript" src="Scripts/jquery-1.9.0.min.js"></script>
    <script type="text/javascript" src="Scripts/ui/js/jquery-ui-1.10.0.custom.min.js"></script>
    <script type="text/javascript" src="Scripts/ui/i18n/jquery.ui.datepicker-ja.js"></script>
    <script type="text/javascript" src="Scripts/formula.js"></script>
    <script type="text/javascript" src="Scripts/tablecreator.js"></script>
<body>
    <form id="form1" runat="server">
    <div id="header">
    <table class="headerTable" cellpadding="0" cellspacing="0">
        <tr>
            <td id="title" align="left">VB-Report 8.0 for .NET　-　ASP.NET Web Sample</td>
        </tr>
        <tr>
            <td id="comment" align="left">製品一覧で選択した内容の見積書を作成するデモです。</td>
        </tr>
    </table>
    <br />
    </div>
    <div>
    <p><b>見積書のプレビュー(HTMLビューアコントロール)</b><br />
    <span class="comment">※トップページはブラウザの [戻る] ボタンで戻ります。</span></p>
    <vbReport:ViewerControl ID="viewerControl1" runat="server"/>
    </div>
    </form>
    </body>
</html>
