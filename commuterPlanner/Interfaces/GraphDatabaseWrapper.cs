using commuterPlanner.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace commuterPlanner.Interfaces
{
    public class GraphDatabaseWrapper
    {
        IGraphDatabaseWrapper _graphDatabase = null;
        public GraphDatabaseWrapper(IGraphDatabaseWrapper graphDatabase)
        {
            _graphDatabase = graphDatabase;
        }

        public List<Route> getRoutes(List<Connections> connections, string selectedTravelDay, string selectedTravelTime)
        {
            return _graphDatabase.getRoutes(connections, selectedTravelDay, selectedTravelTime);
        }
    }
}