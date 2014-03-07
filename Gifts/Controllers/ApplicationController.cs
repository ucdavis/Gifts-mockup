using UCDArch.Web.Controller;
using UCDArch.Web.Attributes;

namespace Gifts.Controllers
{
    [Version(MajorVersion = 3)]
    //[ServiceMessage("Gifts", ViewDataKey = "ServiceMessages", MessageServiceAppSettingsKey = "MessageService")]
    public abstract class ApplicationController : SuperController
    {
    }
}