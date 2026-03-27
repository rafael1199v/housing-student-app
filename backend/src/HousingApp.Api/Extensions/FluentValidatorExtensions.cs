using FluentValidation;

namespace HousingApp.Api.Extensions
{
    public static class FluentValidatorExtensions
    {
        public static IServiceCollection AddFluentValidation(this IServiceCollection services)
        {
            services.AddValidatorsFromAssemblyContaining<Program>();
            return services;
        }
    }
}