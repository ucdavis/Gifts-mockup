using System.Web;
using System.Web.Mvc;
using UCDArch.Web.ActionResults;

namespace Gifts.Controllers
{
    public class MockupController : Controller
    {
        //
        // GET: /Mockup/
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Upload(HttpPostedFileBase file)
        {
            return new JsonNetResult(new { success = true });
        }
	}
}