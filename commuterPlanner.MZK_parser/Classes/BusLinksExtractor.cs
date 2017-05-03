using commuterPlanner.MZK_parser.Interfaces;
using commuterPlanner.MZK_parser.Models;
using HtmlAgilityPack;
using System.Collections.Generic;

namespace commuterPlanner.MZK_parser.Classes
{
    public class BusLinksExtractor
    {
        ILinksExtractor _linksExtractor = null;
        public BusLinksExtractor(ILinksExtractor linksExtractor, IEnumerable<HtmlNode> table, List<BusLink> busLinkList)
        {
            _linksExtractor = linksExtractor;
            _linksExtractor.MainPageExtract(table, busLinkList);
        }
    }
}
