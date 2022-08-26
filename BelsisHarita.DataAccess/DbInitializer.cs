using System;
using System.Collections.Generic;
using System.Text;

namespace BelsisHarita.DataAccess
{
    public static class DbInitializer
    {
        public static void Initialize(HaritaContext context)
        {
            context.Database.EnsureCreated();
        }
    }
}
