using HousingApp.Application.Roles;
using HousingApp.Infrastructure.Persistence.Context;
using HousingApp.Infrastructure.Persistence.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace HousingApp.Infrastructure.Seeders;

public class HousingAppSeeder(HousingApplicationDbContext housingDbContext, RoleManager<IdentityRole> roleManager) : IHousingAppSeeder
{
    public async Task SeedAsync()
    {
        //Seeding room statuses and booking statuses with "HasData"
        await housingDbContext.Database.MigrateAsync();

        //Seeding roles
        foreach (string role in GetRoles())
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }

        //Seeding default services
        if (!await housingDbContext.Services.AnyAsync())
        {
            IEnumerable<ServiceModel> defaultServices = GetDefaultServices();
            await housingDbContext.Services.AddRangeAsync(defaultServices);
            await housingDbContext.SaveChangesAsync();
        }


        //Seeding default policies
        if (!await housingDbContext.Policies.AnyAsync())
        {
            IEnumerable<PolicyModel> defaultPolicies = GetDefaultPolicies();
            await housingDbContext.Policies.AddRangeAsync(defaultPolicies);
            await housingDbContext.SaveChangesAsync();
        }

    }


    private static IEnumerable<ServiceModel> GetDefaultServices()
    {
        return
        [
            new ServiceModel { Code = "service.wifi", Name = "Wi-Fi" },
            new ServiceModel { Code = "service.kitchen", Name = "Cocina" },
            new ServiceModel { Code = "service.tv", Name = "TV" },
            new ServiceModel { Code = "service.air-conditioner", Name = "Aire Acondicionado" },
            new ServiceModel { Code = "service.gym-equipment", Name = "Equipo de gimnasio" }
        ];
    }

    private static IEnumerable<PolicyModel> GetDefaultPolicies()
    {
        return
        [
            new PolicyModel { Code = "policy.rules", Name = "Normas y reglas" },
            new PolicyModel { Code = "policy.cleaning", Name = "Limpieza" },
            new PolicyModel { Code = "policy.pets", Name = "Mascotas" },
            new PolicyModel { Code = "policy.security", Name = "Seguridad" },
            new PolicyModel { Code = "policy.parking", Name = "Estacionamiento" }
        ];
    }

    private static IEnumerable<string> GetRoles()
    {
        return
        [
            RolesDescription.Admin,
            RolesDescription.Student,
            RolesDescription.Householder
        ];
    }
}
