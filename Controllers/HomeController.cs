using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace WebDan.Controllers
{
    public class HomeController : Controller
    {
        /// <summary>
        /// Open the wwwroot/index.html
        /// </summary>
        public IActionResult Index() => File("/index.html", "text/html");
    }
}
