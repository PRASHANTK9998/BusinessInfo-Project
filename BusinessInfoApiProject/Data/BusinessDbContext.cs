using BusinessInfoApiProject.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PassportApplicationWebApi.Models;

namespace BusinessInfoApiProject.Data
{
    public class BusinessDbContext : IdentityDbContext<ApplicationUser>
    {
        public BusinessDbContext(DbContextOptions<BusinessDbContext> options) : base(options) { }

        public DbSet<Address> Addresses { get; set; }
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<PaymentDetails> PaymentDetails { get; set; }
        public DbSet<Business> Businesses { get; set; }
        public DbSet<BusinessCategory> BusinessCategories { get; set; }
        public DbSet<BusinessProduct> BusinessProducts { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<ContactUs> ContactUs { get; set; }
        public override int SaveChanges()
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e =>
                        e.State == EntityState.Added
                        || e.State == EntityState.Modified);

            foreach (var entityEntry in entries)
            {
                entityEntry.Property("UpdatedDate").CurrentValue = DateTime.Now;

                if (entityEntry.State == EntityState.Added)
                {
                    entityEntry.Property("CreatedDate").CurrentValue = DateTime.Now;
                }
            }

            return base.SaveChanges();
        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            var allEntities = modelBuilder.Model.GetEntityTypes();

            // Configure cascading deletes
            modelBuilder.Entity<Business>()
                .HasOne(b => b.Address)
                .WithOne(a => a.Business)
                .HasForeignKey<Address>(a => a.BusinessId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Business>()
               .HasOne(b => b.ApplicationUser)
               .WithOne(a => a.Business)
               .HasForeignKey<Business>(b => b.BusinessId)
               .OnDelete(DeleteBehavior.Cascade);

            //builder.Entity<ApplicationUser>()
            //    .HasOne(a => a.User)
            //    .WithOne(u => u.AppUser)
            //    .HasForeignKey<User>(u => u.UserId)
            //    .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BusinessProduct>()
                .HasOne(bp => bp.Product)
                .WithMany(p => p.BusinessProducts)
                .HasForeignKey(bp => bp.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<BusinessProduct>()
                .HasOne(bp => bp.Business)
                .WithMany(b => b.BusinessProducts)
                .HasForeignKey(bp => bp.BusinessId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Business)
                .WithMany(b => b.Reviews)
                .HasForeignKey(r => r.BusinessId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Business>()
               .HasOne(b => b.BusinessCategory)
               .WithMany(c => c.Businesses)
               .HasForeignKey(b => b.BusinessCategoryId)
               .OnDelete(DeleteBehavior.Cascade);

            foreach (var entity in allEntities)
            {
                entity.AddProperty("CreatedDate", typeof(DateTime));
                entity.AddProperty("UpdatedDate", typeof(DateTime));
            }

            // Configure other model relationships and constraints if needed
        }
    }
}
