Imports System.Net
Imports System.Web.Http

Public Class ValuesController
    Inherits ApiController

    ' GET api/values
    Public Function GetValues() As IEnumerable(Of String)
        Return New String() {"value1", "value2"}
    End Function

    ' GET api/values/5
    Public Function GetValue(ByVal id As Integer) As String
        Return "GET api/values/5 通信成功"
    End Function

    'クラス定義すれば可能なようですが、どうも自由に書いたjsonをその場に応じて勝手にdictionaryに入れてくれるなどができないのですかね？
    'ぱっと見やり方が分かりませんでしたが、受け側の処理の関係でjsonオブジェクトをそのまま投げて取得というのが案外難しいようです
    '
    'http://miso-soup3.hateblo.jp/entry/20130204/1359976197
    'http://miso-soup3.hateblo.jp/entry/2014/06/02/000603

    ' POST api/values
    'Public Function PostValue(<FromBody> ByVal value As String) As String
    Public Function PostValue(<FromBody> ByVal value As String) As String

        Try
            If value Is Nothing Then
                Return "Error!! - Input Data Is Nothing"
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
