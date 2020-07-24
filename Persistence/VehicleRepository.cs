using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using vega.Core;
using vega.Core.Models;
using vega.Extensions;

namespace vega.Persistence
{
  public class VehicleRepository : IVehicleRepository
  {
    private readonly VegaDbContext context;
    public VehicleRepository(VegaDbContext context)
    {
        this.context = context;
    }

    public async Task<IEnumerable<Vehicle>> GetVehicles(VehicleQuery queryObj)
    {
            if (queryObj is null)
            {
                throw new ArgumentNullException(nameof(queryObj));
            }

            var query = context.Vehicles
          .Include(v => v.Features)
            .ThenInclude(vf => vf.Feature)
          .Include(v => v.Model)
            .ThenInclude(m => m.Make)
          .AsQueryable();

      if(queryObj.MakeId.HasValue)
        query = query.Where(q => q.Model.MakeId == queryObj.MakeId.Value);

        //Expression<Func<Vehicle, object>> exp; prikaz kako smo napravili expression
        var columnsMap= new Dictionary<string, Expression<Func<Vehicle, object>>>()
        {
          ["make"] = v => v.Model.Make.Name,
          ["model"] = v => v.Model.Name,
          ["contactName"] =  v => v.ContactName,
          ["id"] = v => v.Id
        };
        
        query = query.ApplyOrdering(queryObj, columnsMap);
        query = query.ApplyPaging(queryObj);
      
       return await query.ToListAsync();            
    }

    
    public async Task<Vehicle> GetVehicle(int id, bool includeRelated = true)
    {
        if (!includeRelated)
          return await context.Vehicles.FindAsync(id);

        return await context.Vehicles
          .Include(v => v.Features)
            .ThenInclude(vf => vf.Feature)
          .Include(v => v.Model)
            .ThenInclude(m => m.Make)
          .SingleOrDefaultAsync(v => v.Id == id);
     }

    public void Add(Vehicle vehicle) 
    {
      context.Vehicles.Add(vehicle);
    }

    public void Remove(Vehicle vehicle)
    {
      context.Remove(vehicle);
    }
  }
}