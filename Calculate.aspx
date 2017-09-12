<%@ Page Language="vb" 
    AutoEventWireup="false" 
    CodeBehind="Calculate.aspx.vb" 
    Inherits="RCNonlinearServer.Calculate" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">

<head runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>断面照査 - 計算中</title>
    <script type="text/javascript">
        function getLocalStorage() {
            let data = localStorage.getItem('webdan.2');
            var taObj = document.getElementById('jsonarea');
            taObj.value = data;
            document.getElementById("form1").submit();
        }
    </script>
</head>

<body>
    <h2>断面照査 - 計算中...</h2>
    <form id="form1" runat="server">
        <div>
            <asp:TextBox ID="jsonarea" runat="server" Width="1" Height ="1"></asp:TextBox>
        </div>
    </form>

</body>
</html>
