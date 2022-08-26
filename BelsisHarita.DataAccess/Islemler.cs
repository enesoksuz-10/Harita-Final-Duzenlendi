using BelsisHarita.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace BelsisHarita.DataAccess
{
   public class Islemler
    {
        HaritaContext context;

        public Islemler(HaritaContext _context)
        {
            context = _context;
        }

        public List<Harita> GetAllHaritalar()
        {
            return context.Haritas.ToList();
        }

        public Harita GetHarita(int id)
        {
            return context.Haritas.Find(id);
        }

        public Harita addHarita(Harita h)
        {
            context.Haritas.Add(h);
            context.SaveChanges();
            return h;
        }

        public Harita updateHarita(Harita h)
        {
            var harita = context.Haritas.Find(h.Id);
            if (harita != null)
            {
                harita.Sehir = h.Sehir;
                harita.Ilce = h.Ilce;
                harita.Mahalle = h.Mahalle;
                context.SaveChanges();
                return harita;
            }
            else
            {
                return null;
            }
        }
        public bool delHarita(int id)
        {
            var harita = context.Haritas.Find(id);
            if (harita != null)
            {
                context.Haritas.Remove(harita);
                context.SaveChanges();
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
