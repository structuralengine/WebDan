Imports System.IO
Imports System.Runtime.Serialization.Json
Imports System.Text
''' <summary> インプットデータから jsonファイルを読み書きするクラス </summary>
Friend Class jsonReader(Of T As New)

    Private _Data As New T
    Public Property Data As T
        Get
            Return Me._Data
        End Get
        Set(value As T)
            _Data = value
        End Set
    End Property

    Public Property jsonData As String

        Get
            Try
                Dim serializer1 As _
                    New DataContractJsonSerializer(GetType(T))
                Using stream As New MemoryStream
                    serializer1.WriteObject(stream, Me._Data)
                    stream.Position = 0
                    Dim sr = New StreamReader(stream)
                    Return sr.ReadToEnd()
                End Using
            Catch ex As Exception
                Return ex.Message
            End Try
        End Get

        Set(value As String)
            Try
                Dim serializer2 As _
                    New DataContractJsonSerializer(GetType(T))

                Using stream As New MemoryStream(Encoding.UTF8.GetBytes(value))
                    stream.Position = 0
                    Me._Data = serializer2.ReadObject(stream)
                End Using

            Catch ex As Exception
                Throw ex
            End Try
        End Set
    End Property



End Class
