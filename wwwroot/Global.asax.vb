Imports System.Web.Http
Imports System.Web.Optimization

Public Class WebApiApplication

    Inherits System.Web.HttpApplication

    Protected Sub Application_Start()
        GlobalConfiguration.Configure(AddressOf WebApiConfig.Register)
    End Sub

End Class
