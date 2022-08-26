using BelsisHarita.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Configuration;

namespace BelsisHarita.DataAccess
{
    public class HaritaContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

            optionsBuilder.UseSqlServer("Server=(localdb)\\mssqllocaldb;Database=BelsisHarita;Trusted_Connection=True;MultipleActiveResultSets=true");

            base.OnConfiguring(optionsBuilder);
        }
        public DbSet<Harita> Haritas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Harita>();
        }
    }
}
