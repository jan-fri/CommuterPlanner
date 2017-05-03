using commuterPlanner.Models;
using System.Collections.Generic;

namespace commuterPlanner.Interfaces
{
    public interface IGraphDatabaseWrapper
    {
        List<Route> getRoutes(List<Connections> connections, string selectedTravelDay, string selectedTravelTime);
    }
}
