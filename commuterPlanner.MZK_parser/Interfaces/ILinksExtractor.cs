using commuterPlanner.MZK_parser.Models;
using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace commuterPlanner.MZK_parser.Interfaces
{
    public interface ILinksExtractor
    {
        void MainPageExtract(IEnumerable<HtmlNode> table, List<BusLink> busLinkList);
    }
}
