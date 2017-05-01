using commuterPlanner.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace commuterPlanner.Interfaces
{
    public interface IGraphDatabaseWrapper
    {
        List<Route> getRoutes(List<Connections> connections, string selectedTravelDay, string selectedTravelTime);
    }
}
