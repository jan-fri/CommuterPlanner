using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(commuterPlanner.Startup))]
namespace commuterPlanner
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //ConfigureAuth(app);
        }
    }
}
