<%@ Page Language="vb" 
    AutoEventWireup="false" 
    CodeBehind="HTMLView.aspx.vb" 
    Inherits="RCNonlinearServer.HTMLView" %>

    <%@ Register assembly="VBReport8.Web.Viewer" 
        namespace="AdvanceSoftware.VBReport8.Web" 
        tagprefix="vbReport" %>

        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

        <html xmlns="http://www.w3.org/1999/xhtml">

        <head id="Head1" runat="server">
            <title>断面照査 - 計算結果</title>
        </head>
        <%  
'           【重要】========================================================//
'           HTMLビューアコントロールを使用する場合は、必ずjQueryの読み込み
'           を実装してください。
	    %>
            <script type="text/javascript" src="scripts/jquery-1.9.0.min.js"></script>
            <script type="text/javascript" src="scripts/ui/js/jquery-ui-1.10.0.custom.min.js"></script>
            <script type="text/javascript" src="scripts/ui/i18n/jquery.ui.datepicker-ja.js"></script>
            <script type="text/javascript" src="scripts/formula.js"></script>
            <script type="text/javascript" src="scripts/tablecreator.js"></script>

            <body>
                <form id="form1" runat="server">
                    <vbReport:ViewerControl ID="viewerControl1" runat="server" />
                </form>
            </body>

        </html>