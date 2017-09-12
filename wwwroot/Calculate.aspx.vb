
Public Class Calculate
    Inherits System.Web.UI.Page


    Private Sub Calculate_LoadComplete(sender As Object, e As EventArgs) Handles Me.LoadComplete
        If Len(jsonarea.Text) = 0 Then
            Try
                ClientScript.RegisterStartupScript(Me.GetType(), "javascript", "getLocalStorage();", True)
            Catch ex As Exception
                jsonarea.Text = "error"
            End Try
        Else
            If jsonarea.Text <> "error" Then
                Session("webdan.postData") = jsonarea.Text
                Dim responseURL As String = "report/HTMLView.aspx"
                Response.Clear()
                Response.Redirect(responseURL, True)
                Response.End()
            End If
        End If
    End Sub



End Class