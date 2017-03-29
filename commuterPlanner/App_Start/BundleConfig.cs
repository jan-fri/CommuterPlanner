using System.Web;
using System.Web.Optimization;

namespace commuterPlanner
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/angular-material").Include(
                        "~/Scripts/angular/angular.js",
                        "~/Scripts/angular-animate/angular-animate.js",
                        "~/Scripts/angular-route.js",
                        "~/Scripts/angular-aria/angular-aria.js",
                        "~/Scripts/angular-material/angular-material.js",
                        "~/Scripts/angular-messages.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
                        "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/lodash").Include(
                        "~/Scripts/lodash*"));

            bundles.Add(new ScriptBundle("~/bundles/myscripts").Include(
                        "~/Scripts/MyScripts/mainApp.js",
                        "~/Scripts/MyScripts/controllers/*.js",
                        "~/Scripts/MyScripts/directives/*.js",
                        "~/Scripts/MyScripts/routes.js",
                        "~/Scripts/MyScripts/services/*.js",                        
                        "~/Scripts/vendor/holder.min.js",
                        "~/Scripts/vendor/jquery.min.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/respond.js"));

            bundles.Add(new StyleBundle("~/Content/css").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/angular-material.css",
                      "~/Content/Custom/my.css",
                      "~/Content/Custom/myless.less"));


        }
    }
}
