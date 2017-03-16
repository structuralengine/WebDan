Public Class Form1
    Private Sub Button1_Click(sender As Object, e As EventArgs) Handles Button1.Click
        Dim rccal As New RCNonlinear.Nonliner
        Dim value = TextBox1.Text
        Dim result = rccal.CalcNonlinearity(value)
        TextBox2.Text = result
    End Sub
End Class
