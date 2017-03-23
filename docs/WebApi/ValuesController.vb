Imports System.Net
Imports System.Web.Http

Public Class ValuesController
    Inherits ApiController

    ' GET api/values
    Public Function GetValues() As IEnumerable(Of String)
        Return New String() { "value1", "value2" }
    End Function

    ' GET api/values/5
    Public Function GetValue(ByVal id As Integer) As String
        Return "GET api/values/5 通信成功"
    End Function

    ' POST api/values
    Public Function PostValue(<FromBody()> ByVal value As String) As String

        Try
            If value Is Nothing Then
                Return "Error!! - Input Xml Data Is Nothing"
            Else
                Dim rccal As New RCNonlinear.Nonliner
                Dim result = rccal.CalcNonlinearity(value)

                Return result
            End If
        Catch ex As Exception
            Return "Error!! - " + ex.Message
        End Try

    End Function

    ' PUT api/values/5
    Public Sub PutValue(ByVal id As Integer, <FromBody()> ByVal value As String)

    End Sub

    ' DELETE api/values/5
    Public Sub DeleteValue(ByVal id As Integer)

    End Sub
End Class
