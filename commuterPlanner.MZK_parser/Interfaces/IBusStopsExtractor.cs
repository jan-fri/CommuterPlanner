using commuterPlanner.MZK_parser.Models;
using HtmlAgilityPack;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace commuterPlanner.MZK_parser.Interfaces
{
    public interface IBusStopsExtractor
    {
        void GetBusStopList(List<BusStopLink> busStopLink, List<BusLink> busLinkList, HtmlWeb htmlWeb, List<string> processedLinks);
    }
}
